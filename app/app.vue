<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';
import { ref, onMounted } from 'vue';
const userData = useUserData();
const userDataKey = ref(null);

const initUserData = () => {
  if (!process.client) return;

  const localUserDataKey = localStorage.getItem('localUserDataKey');
  userDataKey.value = userData.userDataKey;

  if(!userDataKey.value) {
    const UUID = localUserDataKey ?? uuidv4();
    userData.setUserDataKey(UUID);
  } else if(!localUserDataKey) {
    localStorage.setItem('localUserDataKey',userData.userDataKey);
  }

  initStoredData();
}

const initStoredData = () => {
  if (!process.client) return;

  const localFavourites = localStorage.getItem(`${userDataKey.value}-favourites`);
  const localPlaylist = localStorage.getItem(`${userDataKey.value}-playlist`);
  const localIgnore = localStorage.getItem(`${userDataKey.value}-ignore`);

  if(localFavourites) userData.setFavourites(localFavourites);
  if(localPlaylist) userData.setToPlaylist(localPlaylist);
  if(localIgnore) userData.setIgnores(localIgnore);
}

onMounted(async() => {
  if (!process.client) return;
  initUserData();
});
</script>