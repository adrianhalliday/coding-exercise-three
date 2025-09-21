<template>
  <div class="card" ref="cardRef">
    <div class="inner" ref="innerRef">
      <!-- @TODO: make action-specific overlays -->
      <div class="action-overlay discard">
        <Icon name="material-symbols:delete-rounded" />
      </div>
      <div class="action-overlay dislike">
        <Icon name="material-symbols:thumb-down-rounded" />
      </div>
      <div class="action-overlay favourite">
        <Icon name="material-symbols:favorite-rounded" />
      </div>
      <div class="action-overlay playlist">
        <Icon name="material-symbols:playlist-add-rounded" />
      </div>
    </div>
    <div class="card--image">
      <NuxtImg src="/nuxt-icon.png" />
      <div class="hitbox" ref="hitBox"></div>
    </div>
    <div class="card--details"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
const { $gsap, $Draggable } = useNuxtApp()
const props = defineProps([
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

const getAreas = () => {
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
        y: (props.containerHeight / 2),
        scale: 1.28,
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

const getAction = (axis, currentX, currentY) => {
  if (axis === "x") {
    return currentX < startX ? "dislike" : "favourite";
  } else if (axis === "y") {
    return currentY < startY ? "discard" : "playlist";
  }
  return null;
};

const handleDrag = (currentX, currentY) => {
  const axis = getAxis(currentX, currentY);
  const action = getAction(axis,currentX,currentY);

  if (axis === "x") {
    $gsap.to(cardRef.value, { rotation: currentX / 6, duration: 0.3 });

    const element = innerRef.value.querySelector(`.${action}`);
    if (element) {
      const opacity = Math.abs(currentX - startX) / (props.containerWidth / 2);
      $gsap.to(element, { opacity: Math.min(1, opacity), duration: 0.3 });
    }
  } else if (axis === "y") {
    $gsap.to(cardRef.value, { scale: 1 + (currentY - startY) / 500, duration: 0.3 });

    const element = innerRef.value.querySelector(`.${action}`);
    if (element) {
      const opacity = Math.abs(currentY - startY) / (props.containerHeight / 3);
      $gsap.to(element, { opacity: Math.min(1, opacity), duration: 0.3 });
    }
  }
};

const doHitTest = function(el) {
  const axis = getAxis(el.x, el.y);
  const action = getAction(axis,el.x,el.y);

  const areas = getAreas();
  const targetArea = areas[action];
  
  if(targetArea) {
    const hit = draggableInstance.hitTest(targetArea.element,hitBox.value, "20%");

    if(hit) {
      $gsap.killTweensOf([cardRef.value, innerRef]);
      // Tween to final position based on selected direction
      $gsap.to(cardRef.value, targetArea.endTransform);
      $gsap.to(innerRef.value.querySelectorAll("div"), {
        duration: 0.5,
        opacity: 0,
        ease: "power2.out",
      });
    } else {
      $gsap.killTweensOf([cardRef.value, innerRef]);
      // Reset to middle position if no hit
      $gsap.to(cardRef.value, areas['centre'].endTransform);
      $gsap.to(innerRef.value.querySelectorAll("div"), {
        duration: 0.5,
        opacity: 0,
        ease: "power2.out",
      });
    }
  } 
};

onMounted(async () => {
  if ($gsap && !process.server) {
    await nextTick()

    if (!cardRef.value) {
      console.error("refs are not yet mounted!");
      return;
    }

    draggableInstance = $Draggable.create(cardRef.value, {
      type: "x,y",
      lockAxis: true,
      trigger: cardRef.value,
      // @TODO: Finalise bounds relative to mobile viewport
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
    $gsap.killTweensOf([cardRef.value, innerRef]);
  }
});

</script>

<style lang="scss" scoped>
.card {
  width: 80%;
  height: auto;
  position: absolute;
  top: calc((var(--container-height) / 2) - 50%);
  top: 40%;
  left: 10%;

  &--image {
    width: 100%;
    aspect-ratio: 16/9;
    background-color: darkgreen;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;

    img {
      position: absolute;
      inset: 0;
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
    font-size: 2rem;
    height: 4ch;
    background-color: #fff;
  }
  .iconify {
    display: block;
        width: 40px;
        height: 40px;
        color: var(--c-white);
      }
  .inner {
    position: absolute;
    inset: 0;
    z-index: 10;
    
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