<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
const { $gsap, $Draggable } = useNuxtApp()

let draggableInstance = null;
let startX = 0, startY = 0;
let inner;
const cardRef = ref(null);
const stage = ref(null);
const topRef = ref(null);
const leftRef = ref(null);
const centreRef = ref(null);
const rightRef = ref(null);
const bottomRef = ref(null);
const containerWidth = ref(0);
const containerHeight = ref(0);

const getAreas = () => {
  return {
    top:{
      name: "top",
      element: topRef.value,
      innerOpacity: 1,
      endTransform: {
        opacity: 0,
        x: startX,
        y: startY - containerHeight.value / 2,
        scale: 0.3,
        rotation: 0,
        duration: 0.5,
        ease: "power2.out",
      },
    },
    left:{
      name: "left",
      element: leftRef.value,
      innerOpacity: 1,
      endTransform: {
        opacity: 0,
        x: startX - containerWidth.value,
        y: startY,
        scale: 0.5,
        rotation: -36,
        duration: 0.7,
        ease: "power2.out",
      },
    },
    right:{
      name: "right",
      element: rightRef.value,
      innerOpacity: 1,
      endTransform: {
        opacity: 0,
        x: startX + containerWidth.value,
        y: startY,
        scale: 0.5,
        rotation: +36,
        duration: 0.7,
        ease: "power2.out",
      },
    },
    bottom:{
      name: "bottom",
      element: bottomRef.value,
      innerOpacity: 1,
      endTransform: {
        opacity: 1,
        x: startX,
        y: (containerHeight.value / 2),
        scale: 1.28,
        rotation: 0,
        duration: 0.5,
        ease: "power2.out",
      },
    },
    centre:{
      name: "centre",
      element: centreRef.value,
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

const updateDimensions = () => {
  if (stage.value) {
    containerWidth.value = stage.value.offsetWidth;
    containerHeight.value = stage.value.offsetHeight;
  }
};

const getAxis = (currentX, currentY) => {
  if (currentX !== startX) return "x";
  if (currentY !== startY) return "y";
  return null;
};

const getDirection = (axis, currentX, currentY) => {
  if (axis === "x") {
    return currentX < startX ? "left" : "right";
  } else if (axis === "y") {
    return currentY < startY ? "top" : "bottom";
  }
  return null;
};

const handleDrag = (currentX, currentY) => {
  const axis = getAxis(currentX, currentY);
  const direction = getDirection(axis,currentX,currentY);

  if (axis === "x") {
    $gsap.to(cardRef.value.root, { rotation: currentX / 6, duration: 0.3 });

    const opacity = Math.abs(currentX - startX) / (containerWidth.value / 2);
    const element = inner?.querySelector(`.${direction}`);
    if (element) {
      $gsap.to(element, { opacity: Math.min(1, opacity), duration: 0.3 });
    }
  } else if (axis === "y") {
    $gsap.to(cardRef.value.root, { scale: 1 + (currentY - startY) / 1000, duration: 0.3 });

    const opacity = Math.abs(currentY - startY) / (containerHeight.value / 2);
    const element = inner?.querySelector(`.${direction}`);
    if (element) {
      $gsap.to(element, { opacity: Math.min(1, opacity), duration: 0.3 });
    }
  }
};

const doHitTest = function(el) {
  const hitbox = cardRef.value.root?.querySelector(".hitbox");
  // console.log({
  //   el: el,
  //   hitbox,
  //   cardRef: cardRef.value.root,
  // })
  const axis = getAxis(el.x, el.y);
  const direction = getDirection(axis,el.x,el.y);

  if (!hitbox) {
    console.error("Hitbox not found!");
    return;
  }

  const areas = getAreas();
  const targetArea = areas[direction];
  
  if(targetArea) {
    const hit = draggableInstance.hitTest(targetArea.element,hitbox, "-20%");

    if(hit) {
      console.warn(`You just hit ${targetArea.name}`);
      $gsap.killTweensOf([cardRef.value.root, inner]);
      $gsap.to(cardRef.value.root, targetArea.endTransform);
      $gsap.to(inner.querySelectorAll("div"), {
        duration: 0.5,
        opacity: 0,
        ease: "power2.out",
      });
    } else {
      $gsap.killTweensOf([cardRef.value.root, inner]);
      $gsap.to(cardRef.value.root, areas['centre'].endTransform);
      $gsap.to(inner.querySelectorAll("div"), {
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

    if (cardRef.value.root) {
      inner = cardRef.value.innerRef;
    }

    const container = document.querySelector('.card--stage');
    if (container) {
      containerWidth.value = container.offsetWidth;
      containerHeight.value = container.offsetHeight;
    }

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    draggableInstance = $Draggable.create(cardRef.value.root, {
      type: "x,y",
      lockAxis: true,
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
  window.removeEventListener('resize', updateDimensions);
  if (cardRef.value.root) {
    $gsap.killTweensOf([cardRef.value.root, inner]);
  }
});
</script>

<template>
  <div class="card--stage" ref="stage">
    <div class="card--drop--top" ref="topRef"></div>
    <div class="card--drop--left" ref="leftRef"></div>
    <div class="card--drop--centre" ref="centreRef"></div>
    <div class="card--drop--right" ref="rightRef"></div>
    <div class="card--drop--bottom" ref="bottomRef"></div>

    <Card ref="cardRef" :style="{ '--container-height': containerHeight }" />
  </div>
</template>

<style lang="scss" scoped>
.card {
  &--stage {
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: 1fr 80% 1fr;
    grid-template-rows: 2fr 60% 1fr;
    grid-template-areas:
      "left top right"
      "left centre right"
      "left bottom right";

    z-index: 100;
  }

  &--drop {
    &--top {
      grid-area: top;
      border-bottom: 1px solid red;
    }
    &--left {
      grid-area: left;
      border-right: 1px solid red;
      
    }
    &--centre {
      grid-area: centre;
    }
    &--right {
      grid-area: right;
      border-left: 1px solid red;
    }
    &--bottom {
      grid-area: bottom;
      border-top: 1px solid red;
    }
  }
}
</style>
