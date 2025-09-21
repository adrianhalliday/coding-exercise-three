<template>
  <AppLoading v-if="loading" />
  <SearchForm v-else />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
const loading = ref(true);

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  },2600)
})
</script>
