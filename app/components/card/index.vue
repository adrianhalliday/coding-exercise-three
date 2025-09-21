<template>
  <div class="card" ref="cardRef">
    <div class="inner" ref="innerRef">
      <!-- @TODO: make action-specific overlays -->
      <div class="action-overlay discard">
        <ClientOnly>
          <Icon name="material-symbols:delete-rounded" />
        </ClientOnly>
      </div>
      <div class="action-overlay dislike">
        <ClientOnly>
          <Icon name="material-symbols:thumb-down-rounded" />
        </ClientOnly>
      </div>
      <div class="action-overlay favourite">
        <ClientOnly>
          <Icon name="material-symbols:favorite-rounded" />
        </ClientOnly>
      </div>
      <div class="action-overlay playlist">
        <ClientOnly>
          <Icon name="material-symbols:playlist-add-rounded" />
        </ClientOnly>
      </div>
    </div>
    <div class="card--image">
      <span 
        v-if="videoDuration" 
        class="video--duration"
      >
        {{ videoDuration }}
      </span>
      <ClientOnly>
        <Icon name="material-symbols:smart-display" />
      </ClientOnly>
      <NuxtImg :src="video.snippet.thumbnails.high.url || './assets/placeholder.webp'" />
      <div class="hitbox" ref="hitBox"></div>
    </div>
    <div class="card--details">
      <h3 class="video--title">
        {{ video.snippet.title }}
      </h3>

      <p>{{ video.snippet.description }}</p>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
const { $gsap, $Draggable } = useNuxtApp();
const userData = useUserData();

const props = defineProps([
  'index',
  'video',
  'stage',
  'discard',
  'dislike',
  'centreRef',
  'rightRef',
  'bottomRef',
  'containerHeight',
  'containerWidth',
]);

let draggableInstance = null;
let startX = 0, startY = 0;
const cardRef = ref(null);
const innerRef = ref(null);
const hitBox = ref(null);
const isLoadingDuration = ref(true);
const videoDuration = ref(null);

const getActions = () => {
  return {
    discard:{
      name: "discard",
      element: props.discard,
      innerOpacity: 1,
      endTransform: {
        opacity: 0,
        x: startX,
        y: startY - props.containerHeight / 2,
        scale: 0.3,
        rotation: 0,
        duration: 0.5,
        ease: "power2.out",
      },
    },
    dislike:{
      name: "dislike",
      element: props.dislike,
      innerOpacity: 1,
      endTransform: {
        opacity: 0,
        x: startX - props.containerWidth,
        y: startY,
        scale: 0.5,
        rotation: -36,
        duration: 0.7,
        ease: "power2.out",
      },
    },
    favourite:{
      name: "favourite",
      element: props.rightRef,
      innerOpacity: 1,
      endTransform: {
        opacity: 0,
        x: startX + props.containerWidth,
        y: startY,
        scale: 0.5,
        rotation: +36,
        duration: 0.7,
        ease: "power2.out",
      },
    },
    playlist:{
      name: "playlist",
      element: props.bottomRef,
      innerOpacity: 1,
      endTransform: {
        opacity: 1,
        x: startX,
        y: (props.containerHeight / 2) + (props.containerWidth *.47),
        scale: 1.25,
        rotation: 0,
        duration: 0.5,
        ease: "power2.out",
      },
    },
    centre:{
      name: "centre",
      element: props.centreRef,
      innerOpacity: 0,
      endTransform: {
        opacity: 1,
        x: startX,
        y: startY,
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: "power2.out",
      },
    },
  }
};

const getAxis = (currentX, currentY) => {
  if (currentX !== startX) return "x";
  if (currentY !== startY) return "y";
  return null;
};

const determineAction = (axis, currentX, currentY) => {
  if (axis === "x") {
    return currentX < startX ? "dislike" : "favourite";
  } else if (axis === "y") {
    return currentY < startY ? "discard" : "playlist";
  }
  return null;
};

const handleDrag = (currentX, currentY) => {
  const axis = getAxis(currentX, currentY);
  const action = determineAction(axis,currentX,currentY);

  if (axis === "x") {
    $gsap.to(cardRef.value, { rotation: currentX / 6, duration: 0.3 });

    const element = innerRef.value.querySelector(`.${action}`);
    if (element) {
      const opacity = Math.abs(currentX - startX) / (props.containerWidth / 2);
      $gsap.to(element, { opacity: Math.min(1, opacity), duration: 0.3 });
    }
  } else if (axis === "y") {
    const multiplier = (currentY - startY > 0) ? 1200 : 500;
    $gsap.to(cardRef.value, { scale: 1 + (currentY - startY) / multiplier, duration: 0.3 });

    const element = innerRef.value.querySelector(`.${action}`);
    if (element) {
      const opacity = Math.abs(currentY - startY) / (props.containerHeight / 3);
      $gsap.to(element, { opacity: Math.min(1, opacity), duration: 0.3 });
    }
  }
};

const handleAction = (targetAction) => {
  switch(targetAction.name) {
    case 'discard':
      // Action here to remove video from search results array
      // Not required as we're not properly storing search results or paging at this stage
      break;
    case 'dislike':
    case 'favourite':
    case 'playlist':
      // Dislike is placeholder for exclusion from search results
      // @TODO - add logic to search to exclude these IDs
      props.video?.id?.videoId && userData.add(props.video.id.videoId,targetAction.name);
      break;
  }
}

const doHitTest = function(el) {
  const axis = getAxis(el.x, el.y);
  const action = determineAction(axis,el.x,el.y);

  const actions = getActions();
  const targetAction = actions[action];
  
  if(targetAction) {
    const hit = draggableInstance.hitTest(targetAction.element,hitBox.value, "20%");

    if(hit) {
      $gsap.killTweensOf([cardRef.value, innerRef.value]);
      // Tween to final position based on selected direction
      $gsap.to(cardRef.value, targetAction.endTransform);
      $gsap.to(innerRef.value.querySelectorAll("div"), {
        duration: 0.5,
        opacity: 0,
        ease: "power2.out",
      });

      handleAction(targetAction);
      if (draggableInstance) {
        draggableInstance.kill();
      }
    } else {
      $gsap.killTweensOf([cardRef.value, innerRef.value]);
      // Reset to middle position if no hit
      $gsap.to(cardRef.value, actions['centre'].endTransform);
      $gsap.to(innerRef.value.querySelectorAll("div"), {
        duration: 0.5,
        opacity: 0,
        ease: "power2.out",
      });
    }
  } 
};

const parseDuration = (duration) => {
  const regex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/;
  const matches = duration.match(regex);

  if(!matches) return null;

  const h = parseInt(matches[1]) || false;
  const m = parseInt(matches[2]) || 0;
  const s = parseFloat(matches[3]) || 0;

  return h ? `${h}h ${m}m` : `${m}m ${s}s`;
}

onMounted(async () => {
  const { getVideoDuration } = useVideoSearch();

  const handleGetVideoDuration = async (id) => {
    try {
      const response = await getVideoDuration(id);
      videoDuration.value = parseDuration(response);
    } catch (error) {
      console.error('Duration lookup failed:', error);
    } finally {
      isLoadingDuration.value = false;
    }
  }
  handleGetVideoDuration(props.video.id.videoId);

  if ($gsap && !process.server) {
    await nextTick()

    if (!cardRef.value) {
      return;
    }

    draggableInstance = $Draggable.create(cardRef.value, {
      type: "x,y",
      lockAxis: true,
      trigger: cardRef.value,
      // @TODO: Finalise bounds relative to mobile viewport
      // for better experience on other viewports
      bounds: "body",
      inertia: true,

      onPress: function() {
        startX = this.x;
        startY = this.y;
      },

      onClick: () => console.warn("Click!"),

      onDrag: function() {
        handleDrag(this.x, this.y);
      },

      onDragEnd: function() {
        doHitTest(this);
      }
    })[0];
  }

});

onBeforeUnmount(() => {
  if (draggableInstance) {
    draggableInstance.kill();
  }
  if (cardRef.value) {
    $gsap.killTweensOf([cardRef.value, innerRef.value]);
  }
});

</script>

<style lang="scss" scoped>
.card {
  width: 80%;
  aspect-ratio: 4/5;
  position: absolute;
  top: calc((var(--container-height) / 2) * 1px);
  margin-top: -50%;
  left: 10%;
  border-radius: 1rem;
  overflow: hidden;
  background-image: linear-gradient(60deg, #1d1d20 1%, #3e4140 100%);
  border: 1px solid #ffffff01;
  box-sizing: border-box;
  
  &--image {
    width: 100%;
    aspect-ratio: 4/3;
    background-color: black;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    z-index: 1;

    .video--duration {
      font-size: .7rem;
      color: var(--c-white-20);
      position: absolute;
      top: 0;
      right: 0;
      z-index: 3;
      font-weight: 700;
      padding: .7rem;
    }
    
    &::after {
      content: "";
      position: absolute;
      display: block;
      inset: 0;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(60deg, #1d1d20 1%, #3e4140 100%);
      mix-blend-mode: multiply;
      z-index: 2;
      opacity: .6;
    }

    .iconify {
      position: absolute;
      inset: 50%;
      display: block;
      width: 60px;
      height: 60px;
      margin: -20px 0 0 -20px;
      color: var(--c-white);
      z-index: 3;
    }

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }

    .hitbox {
      width: 80px;
      height: 80px;
      position: absolute;
      bottom: 0;
      border-radius: 50%;
    }
  }

  &--details {
    width: 100%;
    font-size: 1rem;
    aspect-ratio: 4/2;
    color: var(--c-white);
    padding: .8rem .6rem .8rem .8rem;
    box-sizing: border-box;

    h3, p {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    h3 {
      font-weight: 500;
      line-height: 1.2;
      margin-block-start: 0;
      -webkit-line-clamp: 3;
    }
    
    p {
      margin-block-start: 0;
      font-size: .8rem;
      line-height: 1.3;
      color: var(--c-white-20);
      -webkit-line-clamp: 2;
    }
  }
  
  .inner {
    position: absolute;
    inset: 0;
    z-index: 10;
    user-select: none;

    .iconify {
      display: block;
      width: 5rem;
      height: 5rem;
      color: var(--c-white);
      user-select: none;
    }
    
    .action-overlay {
      position: absolute;
      inset: 0;
      opacity: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--c-white);

      &.discard {
        background-color: var(--c-action-discard);
      }
      &.dislike {
        background-color: var(--c-action-dislike);
      }
      &.favourite {
        background-color: var(--c-action-favourite);
      }
      &.playlist {
        background-color: var(--c-action-playlist);
      }
    }
  }
}
</style>