export const useUserData = defineStore('userData', {
  state: () => ({
    userDataKey: null,
    favourites: [],
    playlist: [],
    ignore: [],
  }),
  actions: {
    setUserDataKey(ID) {
      this.userDataKey = ID;
    },
    addFavourite(ID) {
      if(this.favourites.find(ID)) return;
      this.favourites.push(ID);
    },
    addToPlaylist(ID) {
      this.playlist.push(ID);
    },
    addIgnore(ID) {
      this.ignore.push(ID);
    },
    setFavourites(list) {
      this.favourites = [...list];
    },
    setToPlaylist(list) {
      this.playlist = [...list];
    },
    setIgnores(list) {
      this.ignore = [...list];
    },
  }
});
