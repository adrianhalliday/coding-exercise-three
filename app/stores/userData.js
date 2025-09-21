import { v4 as uuidv4 } from 'uuid';

export const useUserData = defineStore('userData', {
  state: () => ({
    userDataKey: null,
    favourite: [],
    playlist: [],
    dislike: [],
  }),
  actions: {
    setUserDataKey(ID) {
      this.userDataKey = ID;
    },
    add(ID,type) {
      if(type == 'favourite' && this.favourite.includes(ID)) return;

      this[type].push(ID);
      
      const localData = localStorage.getItem(`${this.userDataKey}-${type}`);
      const parsedLocalData = localData ? JSON.parse(localData) : [];

      localStorage.setItem(
        `${this.userDataKey}-${type}`,
        JSON.stringify([...parsedLocalData, ID])
      );
    },
    set(list,type) {
      this[type] = [...list];
    },
    loadUserKey() {
      const localUserDataKey = localStorage.getItem('localUserDataKey');

      if(!this.userDataKey) {
        const UUID = localUserDataKey ?? uuidv4();
        this.setUserDataKey(UUID);
      } else if(!localUserDataKey) {
        localStorage.setItem('localUserDataKey',this.userDataKey);
      }
    },
    loadFromStorage() {
      this.loadUserKey();

      if (!this.userDataKey) return;
      
      const favourite = localStorage.getItem(`${this.userDataKey}-favourite`);
      const playlist = localStorage.getItem(`${this.userDataKey}-playlist`);
      const dislike = localStorage.getItem(`${this.userDataKey}-dislike`);
      
      if (favourite) {
        this.favourite = JSON.parse(favourite);
      }
      if (playlist) {
        this.playlist = JSON.parse(playlist);
      }
      if (dislike) {
        this.dislike = JSON.parse(dislike);
      }
    }
  }
});