<script lang="ts">
  import { wordLists } from '$lib/stores/wordLists';
  import WordListButton from './WordListButton.svelte';
  import WordListModal from './WordListModal.svelte';
  import type { WordList } from '$lib/types';
  
  let showModal = false;
  let editingList: WordList | null = null;
  
  function handleCreate() {
    editingList = null;
    showModal = true;
  }
  
  function handleEdit(list: WordList) {
    editingList = list;
    showModal = true;
  }
  
  function closeModal() {
    showModal = false;
    editingList = null;
  }
</script>

<div class="word-list-manager">
  <div class="word-list-container">
    {#each $wordLists as list (list.id)}
      <WordListButton {list} onEdit={handleEdit} />
    {/each}
    
    <button class="create-button" on:click={handleCreate}>
      + New List
    </button>
  </div>
</div>

{#if showModal}
  <WordListModal list={editingList} onClose={closeModal} />
{/if}

<style>
  .word-list-manager {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 1rem 2rem;
  }
  
  .word-list-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }
  
  .create-button {
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    margin: 0.5rem;
    font-size: 1.1rem;
    background-color: #007bff;
    color: white;
    border: 2px solid #007bff;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .create-button:hover {
    background-color: #0056b3;
    border-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
</style>