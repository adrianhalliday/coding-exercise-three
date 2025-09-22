<template>
  <div class="page--container">
    <div class="page--header">
      <h3>Up next...</h3>
    </div>
    <div class="page--body">
      <div class="playlist--container" v-if="userData?.playlist">
        <div
          v-for="video in userData?.playlist"
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
  userData.removeVideo(video,'playlist');
}

</script>

<style lang="scss">
.page {
  &--container {
    padding: 8rem 1.2rem 0;
    color: var(--c-white);
    box-sizing: border-box;
  }
  &--header {

  }
}
.playlist {
  &--container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &--item {
    display: grid;
    grid-template-columns: 22% auto 16.915%;
    cursor: pointer;
    position: relative;

    &:nth-last-child(n + 2):after {
      content: "";
      display: block;
      position: absolute;
      width: 70%;
      height: 1px;
      background-color: var(--c-white-70);
      left: 15%;
      bottom: -1rem;
    }
  }
}

.item {
  &--thumb {
    position: relative;
    width: 100%;
    height: auto;
  }
  &--details {
    padding: .5rem 1rem;

    h4 {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-block-start: 0;
      font-weight: 500;
      line-height: .9;
      -webkit-line-clamp: 2;
      margin-bottom: 0;
    }
  }
  &--remove {
    padding: 1rem;

    .iconify {
      display: block;
      width: 1.4rem;
      height: 1.4rem;
      color: var(--c-white);
    }
  }
}
</style>