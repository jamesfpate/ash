<script lang="ts">
  import { wordLists } from '$lib/stores/wordLists';
  import type { WordList } from '$lib/types';
  import { caseMode } from '$lib/stores/caseSettings';
  import type { CaseMode } from '$lib/stores/caseSettings';
  import { keyboardSettings } from '$lib/stores/keyboardSettings';

  let newListName = '';
  let newListWords = '';
  let editingList: WordList | null = null;
  let editingWords = '';

  function addNewList() {
    if (!newListName.trim() || !newListWords.trim()) return;

    const words = newListWords
      .split('\n')
      .map(word => word.trim())
      .filter(word => word.length > 0);

    if (words.length === 0) return;

    wordLists.add(newListName, words);
    newListName = '';
    newListWords = '';
  }

  function startEditing(list: WordList) {
    editingList = list;
    editingWords = list.words.join('\n');
  }

  function saveEdit() {
    if (!editingList || !editingWords.trim()) return;

    const words = editingWords
      .split('\n')
      .map(word => word.trim())
      .filter(word => word.length > 0);

    if (words.length === 0) return;

    wordLists.update(editingList.id, { words });
    editingList = null;
    editingWords = '';
  }

  function cancelEdit() {
    editingList = null;
    editingWords = '';
  }

  function deleteList(id: string) {
    if (confirm('Are you sure you want to delete this list?')) {
      wordLists.delete(id);
    }
  }

  function toggleList(id: string) {
    wordLists.toggleEnabled(id);
  }
</script>

<div class="settings-container">
  <h1>Word Lists Settings</h1>

  <div class="case-settings">
    <h2>Display Settings</h2>
    <div class="case-options">
      <label>
        <input
          type="radio"
          name="case"
          value="default"
          checked={$caseMode === 'default'}
          on:change={() => ($caseMode = 'default')}
        />
        Default (as stored)
      </label>
      <label>
        <input
          type="radio"
          name="case"
          value="uppercase"
          checked={$caseMode === 'uppercase'}
          on:change={() => ($caseMode = 'uppercase')}
        />
        UPPERCASE
      </label>
      <label>
        <input
          type="radio"
          name="case"
          value="lowercase"
          checked={$caseMode === 'lowercase'}
          on:change={() => ($caseMode = 'lowercase')}
        />
        lowercase
      </label>
    </div>
  </div>

  <div class="keyboard-settings">
    <h2>Keyboard Settings</h2>
    <label class="checkbox-label">
      <input
        type="checkbox"
        checked={$keyboardSettings.restrictToCorrectLetter}
        on:change={(e) => {
          $keyboardSettings = {
            ...$keyboardSettings,
            restrictToCorrectLetter: e.currentTarget.checked
          };
        }}
      />
      <span>Only allow typing the correct next letter</span>
    </label>
  </div>

  <div class="new-list-form">
    <h2>Create New List</h2>
    <input
      bind:value={newListName}
      placeholder="List name..."
      on:keydown={(e) => e.key === 'Enter' && e.preventDefault()}
    />
    <textarea
      bind:value={newListWords}
      placeholder="Enter words/phrases (one per line)..."
      rows="5"
    ></textarea>
    <button on:click={addNewList} class="primary">
      Add List
    </button>
  </div>

  <div class="lists">
    <h2>Your Word Lists</h2>
    {#if $wordLists.length === 0}
      <p class="no-lists">No word lists yet. Create one above!</p>
    {:else}
      {#each $wordLists as list (list.id)}
        <div class="list-item" class:disabled={!list.enabled}>
          <div class="list-header">
            <label class="checkbox-label">
              <input
                type="checkbox"
                checked={list.enabled}
                on:change={() => toggleList(list.id)}
              />
              <span class="list-name">{list.name}</span>
              <span class="word-count">({list.words.length} words)</span>
            </label>
            <div class="list-actions">
              {#if editingList?.id !== list.id}
                <button on:click={() => startEditing(list)} class="edit">
                  Edit
                </button>
                <button on:click={() => deleteList(list.id)} class="delete">
                  Delete
                </button>
              {/if}
            </div>
          </div>

          {#if editingList?.id === list.id}
            <div class="edit-area">
              <textarea
                bind:value={editingWords}
                rows="5"
              ></textarea>
              <div class="edit-actions">
                <button on:click={saveEdit} class="primary">
                  Save
                </button>
                <button on:click={cancelEdit} class="secondary">
                  Cancel
                </button>
              </div>
            </div>
          {:else}
            <div class="words-preview">
              {list.words.slice(0, 3).join(', ')}
              {#if list.words.length > 3}
                <span class="more">... and {list.words.length - 3} more</span>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .settings-container {
    max-width: 600px;
    margin: 0 auto;
  }

  h1 {
    color: #333;
    margin-bottom: 2rem;
  }

  .case-settings, .keyboard-settings {
    background-color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }

  .case-options {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .case-options label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
  }

  .case-options input[type="radio"] {
    width: auto;
    margin: 0;
  }

  h2 {
    color: #555;
    margin-bottom: 1rem;
  }

  .new-list-form {
    background-color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }

  input, textarea {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    font-size: 1rem;
    font-family: inherit;
  }

  input:focus, textarea:focus {
    outline: none;
    border-color: #007bff;
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button.primary {
    background-color: #007bff;
    color: white;
  }

  button.primary:hover {
    background-color: #0056b3;
  }

  button.secondary {
    background-color: #6c757d;
    color: white;
  }

  button.secondary:hover {
    background-color: #545b62;
  }

  button.edit {
    background-color: #28a745;
    color: white;
  }

  button.edit:hover {
    background-color: #218838;
  }

  button.delete {
    background-color: #dc3545;
    color: white;
  }

  button.delete:hover {
    background-color: #c82333;
  }

  .lists {
    background-color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .no-lists {
    text-align: center;
    color: #666;
    padding: 2rem;
  }

  .list-item {
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    transition: opacity 0.2s;
  }

  .list-item.disabled {
    opacity: 0.6;
  }

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .checkbox-label input[type="checkbox"] {
    width: auto;
    margin: 0;
  }

  .list-name {
    font-weight: bold;
    color: #333;
  }

  .word-count {
    color: #666;
    font-size: 0.9rem;
  }

  .list-actions {
    display: flex;
    gap: 0.5rem;
  }

  .list-actions button {
    padding: 0.25rem 0.75rem;
    font-size: 0.9rem;
  }

  .words-preview {
    color: #666;
    font-size: 0.9rem;
    padding-left: 1.5rem;
  }

  .more {
    font-style: italic;
  }

  .edit-area {
    margin-top: 1rem;
  }

  .edit-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
</style>