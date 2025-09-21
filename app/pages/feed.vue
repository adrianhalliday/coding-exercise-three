<template>
  <div>
    <CardStage :videos="videos" :isLoading="isLoading" />
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue"
const route = useRoute()

const query = route?.query?.q || 'travel';

const videos = ref([])
const isLoading = ref(false)
const nextPageToken = ref(null)

const handleSearchResults = (response) => {
  console.log(response)
  nextPageToken.value = response.nextPageToken
  videos.value = response.items
}

onMounted(async () => {
  const { searchVideos } = useYouTubeSearch()

  const handleSearch = async (searchTerm, searchTopic = null) => {
    isLoading.value = true
    try {
      const response = await searchVideos(searchTerm, searchTopic ?? null, nextPageToken.value)
      handleSearchResults(response)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Call handleSearch and log the result
  await handleSearch(query, null)
  console.log(videos.value)
})
</script>