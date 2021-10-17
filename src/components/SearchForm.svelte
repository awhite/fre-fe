<script>
  import { onMount } from 'svelte'
  import * as apiClient from '../lib/apiClient'
  import metaStore, { searchResultsStore } from '../stores'

  const ERROR_TIMEOUT = 'The request timed out'

  let query
  let searchInput
  let submittedQuery = null

  onMount(() => {
    searchInput.focus()
  })
  let cancelRequest = null

  function cancelInProgress() {
    if (cancelRequest) {
      cancelRequest()
      cancelRequest = null
    }
  }

  async function search(e) {
    e.preventDefault()
    cancelInProgress()
    $metaStore.isLoading = true
    $metaStore.error = null

    const timeout = setTimeout(() => {
      $metaStore.isLoading = false
      $metaStore.error = ERROR_TIMEOUT
      console.log('Timeout')
      cancelInProgress()
    }, 10 * 1000)

    try {
      $metaStore.query = query
      submittedQuery = query
      let resultsPromise
      ;[resultsPromise, cancelRequest] = apiClient.search(query)
      const results = await resultsPromise
      searchResultsStore.set(results)
    } catch (err) {}
    submittedQuery = null
    clearTimeout(timeout)
    $metaStore.isLoading = false
  }
</script>

<form class="flex flex-col w-full mb-4" on:submit={search}>
  <input
    bind:this={searchInput}
    type="text"
    class="border border-gray-600 rounded-md text-lg mb-8"
    placeholder="Search for a TV show"
    bind:value={query}
  />

  <div class="flex items-center">
    <input
      type="submit"
      disabled={($metaStore.isLoading || !query) && query === submittedQuery}
      class="btn-primary btn-block"
      value={$metaStore.isLoading ? 'Loading...' : 'Search'}
    />
    {#if $metaStore.isLoading}
      <button
        class="ml-2 border rounded-md px-3 py-1.5"
        on:click={() => {
          cancelInProgress()
        }}>Cancel</button
      >
    {/if}
  </div>
  <hr class="border border-gray-200 dark:border-gray-700 mt-4" />
</form>

<style>
  .checkbox-label {
    @apply mr-4 inline-flex items-center;
  }

  .checkbox-label > input:first-child {
    @apply mr-2;
  }
</style>
