<template>
  <div class="card--stage" ref="stage">
    <div class="card--drop--top" ref="discard"></div>
    <div class="card--drop--left" ref="dislike"></div>
    <div class="card--drop--centre" ref="centreRef"></div>
    <div class="card--drop--right" ref="rightRef"></div>
    <div class="card--drop--bottom" ref="bottomRef"></div>

    <Card
      :style="{ '--container-height': containerHeight }"
      :stage="stage"
      :discard="discard"
      :dislike="dislike"
      :centreRef="centreRef"
      :rightRef="rightRef"
      :bottomRef="bottomRef"
      :containerHeight="containerHeight"
      :containerWidth="containerWidth"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

const stage = ref(null);
const discard = ref(null);
const dislike = ref(null);
const centreRef = ref(null);
const rightRef = ref(null);
const bottomRef = ref(null);
const containerWidth = ref(0);
const containerHeight = ref(0);

const updateDimensions = () => {
  containerWidth.value = stage.value.offsetWidth;
  containerHeight.value = stage.value.offsetHeight;
};

onMounted(async () => {
  updateDimensions();
  window.addEventListener("resize", updateDimensions);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateDimensions);
});
</script>

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
      // border-bottom: 1px solid red;
    }
    &--left {
      grid-area: left;
      // border-right: 1px solid red;
    }
    &--centre {
      grid-area: centre;
    }
    &--right {
      grid-area: right;
      // border-left: 1px solid red;
    }
    &--bottom {
      grid-area: bottom;
      // border-top: 1px solid red;
    }
  }
}
</style>
