<template>
  <div>
    <div class="player--container" :class="{isLoaded: isLoaded}">
      <div class="card" ref="cardRef">
        <div class="card--image">
          <div
            class="player"
            ref="video"
            style="width:100%;height:100%;"
          ></div>
          <div class="player--icon">
            <ClientOnly>
              <Icon name="material-symbols:smart-display" />
            </ClientOnly>
          </div>
        </div>
        <div class="card--details">
          <div class="inner">
            <h3 class="video--title">
              {{ videoData?.video?.snippet?.title }}
            </h3>

            <p>{{ videoData?.video?.snippet?.description }}</p>
          </div>

          <div class="player--controls">
            <div 
              class="player--controls--seekBack"
              @click="handleSeek('back')"
            >
              <ClientOnly>
                <Icon name="material-symbols:fast-rewind-rounded" />
              </ClientOnly>
            </div>
            <div 
              class="player--controls--play-pause" 
              :class="{isPlaying, isPaused: !isPlaying}"
              @click="handlePlayPause"
            >
              <div class="play">
                <ClientOnly>
                  <Icon name="material-symbols:play-arrow-rounded" />
                </ClientOnly>
              </div>
              <div class="pause">
                <ClientOnly>
                  <Icon name="material-symbols:pause-rounded" />
                </ClientOnly>
              </div>
            </div>
            <div 
              class="player--controls--seekFwd"
              @click="handleSeek('forward')"
            >
              <ClientOnly>
                <Icon name="material-symbols:fast-forward-rounded" />
              </ClientOnly>
            </div>
            <div 
              class="player--controls--mute-unmute"
              :class="{isMuted, isUnMuted: !isMuted}"
              @click="handleMuteUnmute"
            >
              <div class="soundOff">
                <ClientOnly>
                  <Icon name="material-symbols:volume-off-rounded" />
                </ClientOnly>
              </div>
              <div class="soundOn">
                <ClientOnly>
                  <Icon name="material-symbols:volume-up-rounded" />
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- @TODO: Add Mute/Unmute button -->
    <!-- material-symbols:volume-off-rounded -->
    <!-- material-symbols:volume-up-rounded -->
  </div>
</template>

<script setup>
import { ref } from "vue";
const route = useRoute();
const videoData = useVideoData();
const videoId = route?.query?.id || videoData?.video?.id?.videoId;
const video = ref();
const player = ref(null);
const { onLoaded } = useScriptYouTubePlayer();

const isLoaded = ref(false);
const isPlaying = ref(false);
const isMuted = ref(false);

onLoaded(async ({ YT }) => {
  const YouTube = await YT;
  await new Promise((resolve) => {
    if (typeof YT.Player === 'undefined')
      YouTube.ready(resolve);
    else
      resolve();
  })
  
  player.value = new YT.Player(video.value, {
    videoId: videoId,
    playerVars: { 
      controls: 0,
      playsinline: 1,
    },
    events: {
      'onReady': onPlayerReady
    }
  })
});

const onPlayerReady = () => {
  isLoaded.value = true;
  handlePlayPause();
}

const handlePlayPause = () => {
  switch(isPlaying.value) {
    case true:
      player.value?.pauseVideo();
      isPlaying.value = false;
      break;
    case false:
      player.value?.playVideo();
      isPlaying.value = true;
      break;
  }
}

const handleMuteUnmute = () => {
  switch(isMuted.value) {
    case true:
      player.value?.unMute();
      isMuted.value = false;
      break;
    case false:
      player.value?.mute();
      isMuted.value = true;
      break;
  }
}

const handleSeek = (direction) => {
  if(!isPlaying) return;
  const currentTime = player.value?.getCurrentTime();

  switch(direction) {
    case 'forward':
      player.value?.seekTo(currentTime + 10, true);
      break;
    case 'back':
      player.value?.seekTo(currentTime - 10, true);
      break;
  }
}
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  top: unset;
  margin-top: unset;
  left: unset;
  transition: all 0.5s cubic-bezier(0.65,0.05,0.36,1);

  .isLoaded & {
    width: 100%;
    border-radius: 0;
    background-image: linear-gradient(60deg, #1d1d2000 1%, #3e414000 100%);
    border-color: transparent;
  }

  .player--icon {
    position: absolute;
    display: block;
    inset: 50%;
    z-index: 3;
    width: 60px;
    height: 60px;
    margin: -20px 0 0 -20px;
    opacity: 1;
    transition: 0.2s ease;

    .iconify {
      width: 100%;
      height: 100%;
      color: var(--c-white);
    }
    
    .isLoaded & {
      opacity: 0;
    }
  }

  &--image {
    aspect-ratio: 4/3;
    transition: all 0.2s ease;
    position: relative;

    .isLoaded & {
      aspect-ratio: 16/10;
    }
  }

  &--details {
    position: relative;
    .inner {
      position: absolute;
      padding: .8rem .6rem .8rem .8rem;
      z-index: 1;
    }

    .isLoaded & {
      .inner { opacity: 0; }
    }
  }
}

.player {
  &--container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: transparent;
    transition: background-color 0.5s cubic-bezier(0.65,0.05,0.36,1) 0.3s;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  
    &.isLoaded {
      background-color: #000;
    }
  }

  &--controls {
    position: relative;
    margin-inline: auto;
    display: grid;
    align-items: center;
    justify-content: center;
    grid-template-columns: repeat(3, min-content);
    grid-template-rows: 1fr auto;
    gap: 1rem;
    margin-top: 2rem;
    opacity: 0;
    transition: opacity 0.5s cubic-bezier(0.65,0.05,0.36,1) 0.6s;
    z-index: 5;

    .isLoaded & {
      opacity: 1;
    }

    &--seekBack,
    &--play-pause,
    &--seekFwd,
    &--mute-unmute {
      aspect-ratio: 1;
      background-color: transparent;
      border: 2px solid var(--c-white);
      transition: background-color 0.2s ease;
      display: grid;
      align-content: center;
      justify-content: center;
      grid-template-rows: 1fr;
      grid-template-columns: 1fr;
      border-radius: 50%;
      padding: 1rem;
      cursor: pointer;
      
      .iconify {
        display: block;
        width: 100%;
        height: 100%;
        color: var(--c-white);
      }

      &:hover {
        background-color: var(--c-white-20);
      }
    }
    
    &--play-pause {
      width: 2rem;

      .play, .pause {
        grid-column: 1;
        grid-row: 1;
        opacity: 0;
      }

      &.isPlaying .pause { opacity: 1; }
      &.isPaused .play { opacity: 1; }
    }

    &--seekBack,
    &--seekFwd {
      width: 1.2rem;
    }

    &--mute-unmute {
      grid-row: 2;
      grid-column: 2;
      margin-top: 1rem;
      width: 1rem;
      padding: .5rem;
      margin-inline: auto;
      opacity: .5;
      border-color: transparent;

      .soundOff, .soundOn {
        grid-column: 1;
        grid-row: 1;
        opacity: 0;
      }
      
      &.isUnMuted {
        border-color: var(--c-white);
      }

      &.isMuted .soundOff { opacity: 1; }
      &.isUnMuted .soundOn { opacity: 1; }
    }
  }
}
</style>