export const useVideoData = defineStore('videoData', {
  state: () => ({
    video: null,
  }),
  actions: {
    setVideo(obj) {
      this.video = obj;
    },
    clearVideo() {
      this.video = null;
    }
  }
});