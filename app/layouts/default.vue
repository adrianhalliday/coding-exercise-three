<template>
  <div class="l_app--container">
    <LayoutNotch />
    <LayoutStatusBar />
    <div class="l_app">
      <AppNav />
      <!-- <slot /> -->
      <!-- :transition="route.meta.transition || { name: 'page', mode: 'out-in' }" -->
      <NuxtPage class="l_app--inner" />
      <!-- <AppFooter /> -->
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
</script>

<style scoped lang="scss">
// Phone mock adapted from https://codepen.io/adielhercules/pen/dJJGBQ
.l_app {
  padding-top: var(--d-notch-height);
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  &--container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: clamp(5px, 5vh, 40px) auto;
    width: 360px;
    height: 780px;
    border-radius: 30px;

    background-image: linear-gradient(60deg, #1d1d20 1%, #3e4140 100%);

    @media (min-width: 450px) {
      box-shadow:
        0px 0px 0px 11px #1f1f1f,
        0px 0px 0px 13px #191919,
        0px 0px 0px 20px #111;
    }
  }
  
  :deep(.l_app--inner) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    // transition: background-image 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    z-index: 5;
  }
}
</style>
