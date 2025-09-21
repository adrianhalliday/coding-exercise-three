export const useYouTubeSearch = () => {
  const searchVideos = async (searchQuery, searchTopic = null, nextPageToken = null) => {
    const data = await $fetch('/api/search', {
      query: {
        q: searchQuery,
        searchTopic,
        nextPageToken
      }
    });
    
    return data
  }

  return {
    searchVideos
  }
}