<template>
  
</template>

<script setup>
import { ref } from "vue";
const route = useRoute();


const video = ref();
const player = ref(null);
const { onLoaded } = useScriptYouTubePlayer();
</script>
