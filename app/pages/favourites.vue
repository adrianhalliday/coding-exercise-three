<template>
  <div class="page--container">
    <div class="page--header">
      <h3>Liked videos</h3>
    </div>
    <div class="page--body">
      <div class="playlist--container" v-if="userData?.favourite">
        <div
          v-for="video in userData?.favourite"
          :key="video.id?.videoId || video.id"
          class="playlist--item"
          @click.stop="handlePlay(video)"
        >
          <NuxtImg
            class="item--thumb"
            :src="video.snippet?.thumbnails?.default?.url || './assets/placeholder.webp'"
          />

          <div class="item--details">
            <h4 class="item--title">
              {{ video.snippet?.title || 'Placeholder title' }}
            </h4>
          </div>

          <div class="item--remove" @click.stop="handleRemove(video)">
            <ClientOnly>
              <Icon name="material-symbols:delete-outline-rounded" />
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const userData = useUserData();
const videoData = useVideoData();

const handlePlay = (video) => {
  if(!video) return;
  videoData.setVideo(video);
  navigateTo({
    path: '/player',
    query: {
      id: video.id.videoId
    }
  });
}

const handleRemove = (video) => {
  userData.removeVideo(video,'favourite');
}

</script>