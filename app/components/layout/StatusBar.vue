<template>
  <div class="ui_status-bar">
    <div class="ui_status-bar--left">
      <div class="provider">Belong</div>
    </div>
    <div class="ui_status-bar--right">
      <div class="signal mid"><i class="bar"></i></div>
      <div class="data">5G</div>
      <div class="battery mid"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// Adapted from https://codepen.io/JorgeAguilar/pen/MWeXVZg
.ui_status-bar {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
  
  align-content: center;
  height: 20px;
  padding: 10px 20px 0px 20px;
  padding-right: 12px;
  position: absolute;
  width: 100%;
  z-index: 999;
  cursor: grab;

  &--left,
  &--right {
    color: white;
    font-size: 10px;
    text-transform: uppercase;
    position: relative;
  }

  &--right {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    gap: 5px;
    // justify-content: flex-end;
  }
}

.signal {
  display: flex;
  width: 18px;
  height: 10px;
  position: relative;
  overflow: hidden;
  &.mid {
    &:before {
      opacity: 0.4;
    }
  }
  &.low {
    &:before,
    &:after,
    .bar::before {
      opacity: 0.4;
    }
  }
  &:before,
  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    width: 3px;
    border-radius: 5px;
    background-color: white;
  }
  &:before {
    right: 0;
    height: 100%;
  }
  &:after {
    right: 4px;
    height: 80%;
  }
  .bar {
    &:before,
    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      width: 3px;
      border-radius: 5px;
      background-color: white;
    }
    &:before {
      right: 8px;
      height: 60%;
    }
    &:after {
      right: 12px;
      height: 40%;
    }
  }
}

.battery {
  display: flex;
  width: 15px;
  height: 8px;
  border-radius: 2px;
  border: 1px solid rgba(white, 0.5);
  position: relative;
  align-items: center;
  &.mid {
    &:after {
      width: 50%;
    }
  }
  &.low {
    &:after {
      width: 20%;
      background-color: #ffe600;
    }
  }
  &:before,
  &:after {
    content: "";
    position: absolute;
    background-color: white;
  }
  &:before {
    right: -2px;
    width: 2px;
    height: 50%;
    border-top-right-radius: 1px;
    border-bottom-right-radius: 1px;
  }
  &:after {
    left: 1px;
    width: 100%;
    height: 6px;
    border-radius: 1px;
    max-width: calc(100% - 2px);
  }
}
</style>
