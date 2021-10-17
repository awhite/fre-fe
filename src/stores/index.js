import { writable } from 'svelte/store'

export const searchResultsStore = writable([])

export const episodeResultsStore = writable(null)

export default writable({
  isLoading: false,
  error: null,
  query: '',
  showId: null,
})
