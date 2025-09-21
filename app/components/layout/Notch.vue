<template>
  <div class="ui_notch">
    <span class="speaker"></span>
    <span class="camera"></span>
  </div>
</template>

<style lang="scss" scoped>
// Adapted from https://codepen.io/adielhercules/pen/dJJGBQ
.ui_notch {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 0px;
  width: 56%;
  height: var(--d-notch-height, 30px);
  background-color: #1f1f1f;
  border-radius: 0px 0px 20px 20px;
  z-index: 1000;
}

span {
  position: absolute;
  display: block;
  color: transparent;

  &.speaker {
    top: 0px;
    left: 50%;
    transform: translate(-50%, 6px);
    height: 8px;
    width: 50%;
    background-color: #101010;
    border-radius: 8px;
    box-shadow: inset 0px -3px 3px 0px rgba(256, 256, 256, 0.2);
  }

  &.camera {
    right: 24px;
    top: 4px;
    width: 12px;
    height: 12px;
    background-color: #101010;
    border-radius: 12px;
    box-shadow: inset 0px -3px 2px 0px rgba(256, 256, 256, 0.2);

    &:after {
      content: "";
      position: absolute;
      background-color: #2d4d76;
      width: 6px;
      height: 6px;
      top: 2px;
      left: 2px;
      top: 3px;
      left: 3px;
      display: block;
      border-radius: 4px;
      box-shadow: inset 0px -2px 2px rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
