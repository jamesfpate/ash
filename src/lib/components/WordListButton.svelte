<script lang="ts">
  import type { WordList } from '$lib/types';
  import { wordLists } from '$lib/stores/wordLists';
  
  export let list: WordList;
  export let onEdit: (list: WordList) => void;
  
  let showDropdown = false;
  
  $: imageCount = list.words.filter(w => typeof w !== 'string' && w.imageUrl).length;
  
  function toggleEnabled() {
    wordLists.toggleEnabled(list.id);
  }
  
  function handleEdit() {
    showDropdown = false;
    onEdit(list);
  }
  
  function handleDelete() {
    showDropdown = false;
    if (confirm(`Delete "${list.name}"?`)) {
      wordLists.delete(list.id);
    }
  }
  
  function toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    showDropdown = !showDropdown;
  }
  
  function closeDropdown() {
    showDropdown = false;
  }
</script>

<div class="word-list-button" class:enabled={list.enabled}>
  <button class="main-button" on:click={toggleEnabled}>
    {list.name}
    <span class="word-count">
      ({list.words.length}{imageCount > 0 ? `, ${imageCount} 🖼️` : ''})
    </span>
  </button>
  
  <div class="dropdown-container">
    <button class="dropdown-toggle" on:click={toggleDropdown}>
      ⋮
    </button>
    
    {#if showDropdown}
      <div class="dropdown-menu">
        <button class="dropdown-item" on:click={handleEdit}>Edit</button>
        <button class="dropdown-item delete" on:click={handleDelete}>Delete</button>
      </div>
      <div class="dropdown-backdrop" on:click={closeDropdown}></div>
    {/if}
  </div>
</div>

<style>
  .word-list-button {
    display: inline-flex;
    position: relative;
    margin: 0.5rem;
    align-items: stretch;
  }
  
  .main-button {
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
    background-color: #e0e0e0;
    color: #666;
    border: 2px solid #ccc;
    border-radius: 0.5rem 0 0 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    border-right: none;
    display: flex;
    align-items: center;
    line-height: 1.2;
    flex: 1;
  }
  
  .word-list-button.enabled .main-button {
    background-color: #4caf50;
    color: white;
    border-color: #4caf50;
  }
  
  .dropdown-container {
    position: relative;
    display: flex;
  }
  
  .dropdown-toggle {
    padding: 0.75rem 0.75rem;
    font-size: 1.2rem;
    background-color: #d0d0d0;
    color: #666;
    border: 2px solid #ccc;
    border-left: 1px solid #bbb;
    border-radius: 0 0.5rem 0.5rem 0;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    width: 45px;
  }
  
  .word-list-button.enabled .dropdown-toggle {
    background-color: #45a049;
    color: white;
    border-color: #4caf50;
    border-left-color: #45a049;
  }
  
  .main-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .word-count {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-left: 0.5rem;
  }
  
  .dropdown-toggle:hover {
    background-color: #c0c0c0;
  }
  
  .word-list-button.enabled .dropdown-toggle:hover {
    background-color: #3d8b40;
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    margin-top: 0.25rem;
    min-width: 100px;
  }
  
  .dropdown-item {
    display: block;
    width: 100%;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .dropdown-item:hover {
    background-color: #f5f5f5;
  }
  
  .dropdown-item.delete {
    color: #dc3545;
  }
  
  .dropdown-item.delete:hover {
    background-color: #fee;
  }
  
  .dropdown-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
  }
</style>