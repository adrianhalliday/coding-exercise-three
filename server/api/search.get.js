export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { q, searchTopic = null, nextPageToken = null } = query;
  const config = useRuntimeConfig();
  
  try {
    const response = await $fetch('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q,
        maxResults: 20,
        type: 'video',
        topicId: searchTopic,
        nextPageToken,
        key: config.youtubeApiKey
      }
    })
    return response;

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch YouTube data'
    });
  }
});