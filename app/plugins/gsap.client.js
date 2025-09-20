import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    gsap.registerPlugin(Draggable);
  }

  return {
    provide: {
      gsap,
      Draggable,
    },
  };
});