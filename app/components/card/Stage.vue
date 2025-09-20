<script setup>
import { ref, onMounted } from 'vue';
const { $gsap: gsap, $Draggable: Draggable } = useNuxtApp();

onMounted(() => {
  let startX, startY, currentX, currentY;

  const card = document.querySelector('.card');

  Draggable.create(card, {
    type: "x,y",
    lockAxis: true,
    // @TODO: constrain to fake mobile container
    bounds: "body",
    inertia: true,

    onPress: function() {
      startX = this.x;
      startY = this.y;
    },

    onClick: function() {
      console.warn("Click!");
    },

    onDrag: function() {
      if(this.isDragging && this.x !== startX) {
        gsap.to(card, 1, {rotation: 0 + (this.x / 6)});
      } else if(this.isDragging && this.y !== startY) {
        gsap.to(card, 1, {scale: 1 + (this.y / 1000)});
      }
    },

    onDragEnd: () => {
      gsap.killTweensOf(card);
      hitTest(card);
    },
  });


  const hitTest = (card) => {
    const hitbox = card.querySelector('.hitbox');
    const areas = [
      {
        name: 'top',
        element: document.querySelector(".card--drop.top"),
        endTransform: {
          opacity: 0,
          x: startX,
          y: startY - (window.innerHeight/2),
          scale: .3,
          rotation: 0,
          duration: 0.5,
          ease: "power2.out",
        }
      },
      {
        name: 'left',
        element: document.querySelector(".card--drop.left"),
        endTransform: {
          opacity: 0,
          x: startX - window.innerWidth,
          y: startY,
          scale: .4,
          rotation: -40,
          duration: 0.5,
          ease: "power2.out",
        }
      },
      {
        name: 'right',
        element: document.querySelector(".card--drop.right"),
        endTransform: {
          opacity: 0,
          x: startX + window.innerWidth,
          y: startY,
          scale: .4,
          rotation: +40,
          duration: 0.5,
          ease: "power2.out",
        }
      },
      {
        name: 'bottom',
        element: document.querySelector(".card--drop.bottom"),
        endTransform: {
          opacity: 1,
          x: startX,
          y: (window.innerHeight/2)*.86,
          scale: 1.28,
          rotation: 0,
          duration: 0.5,
          ease: "power2.out",
        }
      },
      {
        name: 'centre',
        element: document.querySelector(".card--drop.centre"),
        endTransform: {
          opacity: 1,
          x: startX,
          y: startY + (window.innerWidth / 2),
          scale: 1.3,
          rotation: 0,
          duration: 0.5,
          ease: "power2.out",
        }
      },
    ];
  
    areas.some(({ name, element, endTransform }) => {
      if (element && Draggable.hitTest(hitbox, element, 12)) {
        console.warn(`You just hit ${name}`);
        
        // const area = areas.filter((area) => area.name === name)
        gsap.to(card,endTransform)
  
        return true;
      }
    });
  }
});

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
