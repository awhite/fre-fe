<script>
  import { onDestroy } from 'svelte'

  import LoadingSpinner from './LoadingSpinner.svelte'
  import metaStore, { searchResultsStore, episodeResultsStore } from '../stores'
  import * as apiClient from '../lib/apiClient'

  let searchResults
  let query
  let episodeResults

  const unsubscribeSearchResultsStore = searchResultsStore.subscribe((data) => {
    searchResults = data
  })
  onDestroy(unsubscribeSearchResultsStore)

  const unsubscribeMeta = metaStore.subscribe((data) => {
    query = data.query
  })
  onDestroy(unsubscribeMeta)

  const unsubscribeEpisodeResultsStore = episodeResultsStore.subscribe(
    (data) => {
      episodeResults = data
    }
  )
  onDestroy(unsubscribeEpisodeResultsStore)

  async function pickRandomEpisodeForShow() {
    $metaStore.isLoading = true
    let resultsPromise
    ;[resultsPromise] = apiClient.getRandomEpisodeForShow($metaStore.showId)
    const data = await resultsPromise
    episodeResultsStore.set(data)
    $metaStore.isLoading = false
  }
</script>

{#if $metaStore.isLoading}
  <div class="flex justify-center w-full h-full spinner-container">
    <LoadingSpinner />
  </div>
{:else if $metaStore.error}
  <div class="flex-col justify-center w-full h-full">
    <h4>Error ⚠️</h4>
    <p>{$metaStore.error}</p>
  </div>
{:else if episodeResults}
  <div class="flex-col items-center">
    <h2 class="text-xl text-center">{episodeResults.code}</h2>
    <p class="text-md text-center mb-8">{episodeResults.title}</p>
    <button
      class="w-full border rounded bg-gray-200"
      on:click={pickRandomEpisodeForShow}>Regenerate</button
    >
  </div>
{:else if searchResults.length > 0}
  <div class="flex-col items-center w-full pb-12">
    <h3 class="text-center text-2xl mb-4">
      Results: <span class="font-light underline">{query}</span>
    </h3>
    <ul class="results-list">
      {#each searchResults as { name, id }}
        <li
          class="border border-gray-800 dark:border-gray-200 mb-2 rounded-md p-4"
          on:click={() => {
            $metaStore.showId = id
            pickRandomEpisodeForShow()
          }}
        >
          {name}
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  .spinner-container {
    padding-top: 25%;
  }

  .results-list > li {
    overflow-wrap: break-word;
  }
</style>
