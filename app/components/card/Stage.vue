<script setup>
import { ref, onMounted, computed } from "vue";
const { $gsap: gsap, $Draggable: Draggable } = useNuxtApp();

onMounted(() => {
  if (process.client) {
    let startX, startY, currentX, currentY, containerWidth, containerHeight;

    const card = document.querySelector(".card");
    const inner = card.querySelector(".inner");
    const stage = document.querySelector(".card--stage");

    const updateDimensions = () => {
      containerWidth = stage.offsetWidth;
      containerHeight = stage.offsetHeight;
    }
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    Draggable.create(card, {
      type: "x,y",
      lockAxis: true,
      // @TODO: constrain to fake mobile container
      bounds: "body",
      inertia: true,

      onPress: function () {
        startX = this.x;
        startY = this.y;
      },

      onClick: function () {
        console.warn("Click!");
      },

      onDrag: function () {
        currentX = this.x;
        currentY = this.y;
        const axis = computed(() => {
          if (currentX !== startX) return "x";
          if (currentY !== startY) return "y";
        });
        let directionClass;
        switch (axis.value) {
          case "x":
            directionClass = currentX < 0 ? ".left" : ".right";
            break;
          case "y":
            directionClass = currentY < 0 ? ".up" : ".down";
            break;
        }

        const maxDistanceX = containerWidth / 2;
        const maxDistanceY = containerHeight / 2;

        if (this.isDragging && axis === "x") {
          gsap.to(card, 1, { rotation: 0 + currentX / 6 });

          const opacity = Math.abs(currentX) / maxDistanceX;
          gsap.to(inner.querySelector(directionClass), 1, {
            opacity: Math.min(1, opacity),
          });
        } else if (this.isDragging && currentY !== startY) {
          gsap.to(card, 1, { scale: 1 + currentY / 1000 });

          const opacity = Math.abs(currentY) / maxDistanceY;
          gsap.to(inner.querySelector(directionClass), 1, {
            opacity: Math.min(1, opacity),
          });
        }
      },

      onDragEnd: () => {
        gsap.killTweensOf(card);
        gsap.killTweensOf(inner);
        hitTest(card);
      },
    });

    const areas = [
      {
        name: "top",
        element: document.querySelector(".card--drop.top"),
        innerOpacity: 1,
        endTransform: {
          opacity: 0,
          x: startX,
          y: startY - containerHeight / 2,
          scale: 0.3,
          rotation: 0,
          duration: 0.5,
          ease: "power2.out",
        },
      },
      {
        name: "left",
        element: document.querySelector(".card--drop.left"),
        innerOpacity: 1,
        endTransform: {
          opacity: 0,
          x: startX - containerWidth,
          y: startY,
          scale: 0.5,
          rotation: -36,
          duration: 0.7,
          ease: "power2.out",
        },
      },
      {
        name: "right",
        element: document.querySelector(".card--drop.right"),
        innerOpacity: 1,
        endTransform: {
          opacity: 0,
          x: startX + containerWidth,
          y: startY,
          scale: 0.5,
          rotation: +36,
          duration: 0.7,
          ease: "power2.out",
        },
      },
      {
        name: "bottom",
        element: document.querySelector(".card--drop.bottom"),
        innerOpacity: 1,
        endTransform: {
          opacity: 1,
          x: startX,
          y: (containerHeight / 2) * 0.9,
          scale: 1.28,
          rotation: 0,
          duration: 0.5,
          ease: "power2.out",
        },
      },
      {
        name: "centre",
        element: document.querySelector(".card--drop.centre"),
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
    ];

    const hitTest = (card) => {
      const hitbox = card.querySelector(".hitbox");

      areas.some(({ name, element, endTransform, innerOpacity }) => {
        if (element && Draggable.hitTest(hitbox, element, 12)) {
          console.warn(`You just hit ${name}`);

          gsap.to(card, endTransform);
          gsap.to(inner.querySelectorAll("div"), {
            duration: 0.5,
            opacity: innerOpacity,
            ease: "power2.out",
          });
          return true;
        }
      });
    };
  }
});
</script>

<template>
  <div class="card--stage" ref="stage">
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
