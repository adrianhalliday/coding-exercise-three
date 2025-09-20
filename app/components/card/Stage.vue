<script setup>
import { ref, onMounted } from 'vue';
const { $gsap: gsap, $Draggable: Draggable } = useNuxtApp();

onMounted(() => {
  let startX, startY;
  const card = document.querySelector('.card');

  Draggable.create(card, {
    type: "x,y",
    // @TODO: constrain to fake mobile container
    bounds: "body",
    inertia: true,

    onPress: function() {
        startX = this.x;
        startY = this.y;
    },

    onDragEnd: function() {
      hitTest(card)
      gsap.to(this.target, {
          x: startX,
          y: startY,
          duration: 0.5,
          ease: "power2.out"
      });
    }
  });
});

const hitTest = (card) => {
  const areas = [
    {
      key: "top",
      class: ".top",
    },
    {
      key: "left",
      class: ".left",
    },
    {
      key: "right",
      class: ".right",
    },
    {
      key: "bottom",
      class: ".bottom",
    },
  ]
  
  areas.forEach((area) => {
    const hitbox = card.querySelector('.hitbox');
    if( Draggable.hitTest(hitbox, document.querySelector(area.class), 12) ) {
      window.alert(`You just hit the ${area.key}`)
    }
  })
}
</script>

<template>
  <div class="card--stage">
    <div class="card--drop top"></div>
    <div class="card--drop left"></div>
    <div class="card--drop centre"></div>
    <div class="card--drop right"></div>
    <div class="card--drop bottom"></div>
  
    <Card ref="card" />
  </div>
</template>

<style lang="scss" scoped>
.card {
  &--stage {
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    background: lightgrey;
    display: grid;
    grid-template-columns: 1fr 60% 1fr;
    grid-template-rows: 1fr 50% 1fr;
    grid-template-areas:
      "left top right"
      "left centre right"
      "left bottom right";
  }

  &--drop {
    &.top {
      grid-area: top;
      background-color: red;
    }
    &.left {
      grid-area: left;
      background-color: blue;
    }
    &.centre {
      grid-area: centre;
      background-color: cyan;
    }
    &.right {
      grid-area: right;
      background-color: magenta;
    }
    &.bottom {
      grid-area: bottom;
      background-color: yellow;
    }
  }
}
</style>
