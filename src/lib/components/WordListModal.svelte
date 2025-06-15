<script lang="ts">
  import { wordLists } from '$lib/stores/wordLists';
  import type { WordList, WordWithImage } from '$lib/types';
  
  export let list: WordList | null;
  export let onClose: () => void;
  
  let name = list?.name || '';
  
  interface WordRow {
    text: string;
    imageUrl: string;
  }
  
  let wordRows: WordRow[] = list?.words.map(w => {
    if (typeof w === 'string') {
      return { text: w, imageUrl: '' };
    }
    return { text: w.text, imageUrl: w.imageUrl || '' };
  }) || [{ text: '', imageUrl: '' }];
  
  function addRow() {
    wordRows = [...wordRows, { text: '', imageUrl: '' }];
  }
  
  function removeRow(index: number) {
    wordRows = wordRows.filter((_, i) => i !== index);
  }
  
  async function handleSave() {
    const words = wordRows
      .filter(row => row.text.trim())
      .map(row => {
        if (row.imageUrl.trim()) {
          return {
            text: row.text.trim(),
            imageUrl: row.imageUrl.trim()
          } as WordWithImage;
        }
        return row.text.trim();
      });
    
    if (!name.trim()) {
      alert('Please enter a list name');
      return;
    }
    
    if (words.length === 0) {
      alert('Please enter at least one word');
      return;
    }
    
    if (list) {
      // Update existing list
      await wordLists.update(list.id, { name, words });
    } else {
      // Create new list
      await wordLists.add(name, words);
    }
    
    onClose();
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      onClose();
    }
  }
</script>

<div class="modal-backdrop" on:click={onClose} on:keydown={handleKeydown}>
  <div class="modal" on:click|stopPropagation>
    <div class="modal-header">
      <h2>{list ? 'Edit' : 'Create'} Word List</h2>
      <button class="close-button" on:click={onClose}>×</button>
    </div>
    
    <div class="modal-body">
      <div class="form-group">
        <label for="list-name">List Name</label>
        <input
          id="list-name"
          type="text"
          bind:value={name}
          placeholder="Enter list name"
        />
      </div>
      
      <div class="form-group">
        <label>Words</label>
        <div class="table-container">
          <table class="word-table">
            <thead>
              <tr>
                <th></th>
                <th>Word</th>
                <th>Image URL (optional)</th>
              </tr>
            </thead>
            <tbody>
              {#each wordRows as row, index}
                <tr>
                  <td class="action-cell">
                    <button
                      type="button"
                      class="remove-button"
                      on:click={() => removeRow(index)}
                      disabled={wordRows.length === 1}
                    >
                      ×
                    </button>
                  </td>
                  <td>
                    <input
                      type="text"
                      bind:value={row.text}
                      placeholder="Enter word"
                      class="word-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      bind:value={row.imageUrl}
                      placeholder="/images/word.jpg or https://..."
                      class="url-input"
                    />
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
          <button type="button" class="add-button" on:click={addRow}>
            + Add Word
          </button>
        </div>
      </div>
    </div>
    
    <div class="modal-footer">
      <button class="cancel-button" on:click={onClose}>Cancel</button>
      <button class="save-button" on:click={handleSave}>
        {list ? 'Update' : 'Create'} List
      </button>
    </div>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 2rem;
    line-height: 1;
    color: #999;
    cursor: pointer;
    padding: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .close-button:hover {
    color: #666;
  }
  
  .modal-body {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group:last-child {
    margin-bottom: 0;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }
  
  input,
  textarea {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 2px solid #ddd;
    border-radius: 0.25rem;
    transition: border-color 0.2s;
  }
  
  input:focus,
  textarea:focus {
    outline: none;
    border-color: #007bff;
  }
  
  textarea {
    resize: vertical;
    font-family: inherit;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1.5rem;
    border-top: 1px solid #e0e0e0;
  }
  
  .cancel-button,
  .save-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .cancel-button {
    background-color: #e0e0e0;
    color: #666;
  }
  
  .cancel-button:hover {
    background-color: #d0d0d0;
  }
  
  .save-button {
    background-color: #007bff;
    color: white;
  }
  
  .save-button:hover {
    background-color: #0056b3;
  }
  
  .help-text {
    font-size: 0.85rem;
    color: #666;
    margin-top: 0.5rem;
    font-style: italic;
  }
  
  .table-container {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
  }
  
  .word-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .word-table th {
    background-color: #f5f5f5;
    padding: 0.75rem;
    text-align: left;
    font-weight: 500;
    border-bottom: 2px solid #ddd;
    position: sticky;
    top: 0;
    z-index: 1;
  }
  
  .word-table td {
    padding: 0.5rem;
    border-bottom: 1px solid #eee;
  }
  
  .word-table tr:last-child td {
    border-bottom: none;
  }
  
  .word-input,
  .url-input {
    width: 100%;
    padding: 0.5rem;
    margin: 0;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    font-size: 0.9rem;
  }
  
  .word-input {
    min-width: 150px;
  }
  
  .url-input {
    min-width: 250px;
  }
  
  .action-cell {
    width: 40px;
    text-align: center;
  }
  
  .remove-button {
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 0.25rem;
    width: 30px;
    height: 30px;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .remove-button:hover:not(:disabled) {
    background-color: #c82333;
  }
  
  .remove-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .add-button {
    width: 100%;
    padding: 0.75rem;
    margin-top: 0.5rem;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    cursor: pointer;
  }
  
  .add-button:hover {
    background-color: #218838;
  }
</style>