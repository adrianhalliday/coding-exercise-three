export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { q, searchTopic = null, nextPageToken = null } = query;
  const config = useRuntimeConfig();
  
  try {
    const response = await $fetch('https://www.googleapis.com/youtube/v3/search', {
      headers: {
        'Referer': 'http://localhost:3000'
      },
      params: {
        part: 'snippet',
        q,
        maxResults: 20,
        type: 'video',
        topicId: searchTopic,
        videoEmbeddable: true,
        nextPageToken,
        key: config.youtubeApiKey
      }
    })
    return response;

  } catch (error) {
    throw createError({
      statusCode: error.response?.status || 500,
      key: config.youtubeApiKey,
      statusMessage: error.response?.statusText || 'Failed to fetch YouTube data',
      data: error.response?._data || error.data || { 
        error: {
          message: error.message || 'YouTube API request failed',
          code: error.response?.status || 500
        }
      }
    });
  }
});