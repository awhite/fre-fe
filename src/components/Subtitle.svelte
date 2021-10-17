<script>
  export let seeds;
  export let peers;
  export let size;
</script>

<span class="mt-2 block"
  ><strong class="text-green-700 dark:text-green-300">{seeds}</strong> seeder{seeds === 1
    ? ""
    : "s"} •
  <strong class="text-red-700 dark:text-red-300">{peers}</strong>
  leecher{peers === 1 ? "" : "s"}
  •
  <strong>{size}</strong></span
>
