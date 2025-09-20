<template>
  <div class="card">
    <div class="inner">
      <div class="top">Top</div>
      <div class="left">Left</div>
      <div class="right">Right</div>
      <div class="bottom">Bottom</div>
    </div>
    <div class="card--image">
      <NuxtImg src="/nuxt-icon.png" />
      <div class="hitbox"></div>
    </div>
    <div class="card--details"></div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  width: 80%;
  height: auto;
  position: absolute;
  top: 40%;
  left: 10%;

  &--image {
    width: 100%;
    aspect-ratio: 16/9;
    background-color: darkgreen;
    position: relative;

    img {
      max-width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }

    .hitbox {
      width: 34%;
      aspect-ratio: 1;
      position: absolute;
      bottom: 0;
      left: 33%;
      background-color: white;
      border-radius: 50%;
    }
  }

  &--details {
    width: 100%;
    font-size: 2rem;
    height: 4ch;
    background-color: #fff;
  }

  .inner {
    position: absolute;
    inset: 0;
    z-index: 10;
    
    > div {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      background-color: black;
      opacity: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
  }
}
</style>