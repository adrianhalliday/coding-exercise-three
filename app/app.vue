<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { onMounted } from 'vue';
const userData = useUserData();
const videoData = useVideoData();

onMounted(async() => {
  if (!process.client) return;
  await callOnce(userData.loadFromStorage);
});
</script>