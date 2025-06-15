<script lang="ts">
  import { onMount } from 'svelte';
  import { wordLists } from '$lib/stores/wordLists';

  onMount(() => {
    wordLists.load();
  });
</script>


<main>
  <slot />
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: #f0f0f0;
  }

  main {
    padding: 0;
  }
</style>