import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { CSSPlugin } from 'gsap/CSSPlugin';

gsap.registerPlugin(Draggable, CSSPlugin);

const cssPlugin = CSSPlugin;

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      gsap,
      Draggable,
      CSSPlugin, // Optionally provide CSSPlugin for debugging
    },
  };
});