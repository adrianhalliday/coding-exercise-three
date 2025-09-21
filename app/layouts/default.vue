<template>
  <div class="l_app--container">
    <LayoutNotch />
    <LayoutStatusBar />
    <div class="l_app">
      <!-- <AppNav /> -->
      <slot />
      <!-- <AppFooter /> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
// Adapted from https://codepen.io/adielhercules/pen/dJJGBQ
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

    @media (min-width: 450px) {
      margin: clamp(5px, 5vh, 40px) auto;
      width: 360px;
      height: 780px;
      background-image: linear-gradient(60deg, #1d1d20 1%, #3e4140 100%);
      border-radius: 30px;
      box-shadow:
        0px 0px 0px 11px #1f1f1f,
        0px 0px 0px 13px #191919,
        0px 0px 0px 20px #111;
    }
  }
}
</style>
