<script lang="ts">
  import { onMount } from 'svelte';
  import { wordLists } from '$lib/stores/wordLists';

  onMount(() => {
    wordLists.load();
  });
</script>

<nav>
  <a href="/">Game</a>
  <a href="/settings">Settings</a>
</nav>

<main>
  <slot />
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: #f0f0f0;
  }

  nav {
    background-color: #333;
    padding: 1rem;
    display: flex;
    gap: 2rem;
    justify-content: center;
  }

  nav a {
    color: white;
    text-decoration: none;
    font-size: 1.2rem;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    transition: background-color 0.2s;
  }

  nav a:hover {
    background-color: #555;
  }

  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
</style>