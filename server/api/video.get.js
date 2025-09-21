export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { id } = query
  const config = useRuntimeConfig()
  
  try {
    const response = await $fetch('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails',
        id,
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