export const useVideoSearch = () => {
  const getVideoDuration = async ( id ) => {
    const data = await $fetch('/api/video', {
      query: { id: id }
    });
    
    return data?.items[0]?.contentDetails?.duration || null;
  }

  return {
    getVideoDuration
  }
}