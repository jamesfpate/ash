<script lang="ts">
  import { onMount } from 'svelte';
  import { enabledWords } from '$lib/stores/wordLists';
  import { caseMode, applyCase } from '$lib/stores/caseSettings';
  import { getRandomSuccessMessage } from '$lib/defaultLists';

  let currentWord = '';
  let userInput = '';
  let showSuccess = false;
  let inputElement: HTMLInputElement;
  let successMessage = '';

  $: if ($enabledWords.length > 0 && !currentWord) {
    selectRandomWord();
  }

  function selectRandomWord() {
    if ($enabledWords.length === 0) {
      currentWord = '';
      return;
    }
    const randomIndex = Math.floor(Math.random() * $enabledWords.length);
    currentWord = $enabledWords[randomIndex];
    userInput = '';
    // Ensure focus after word change
    setTimeout(() => ensureFocus(), 0);
  }

  function checkAnswer() {
    const normalizedInput = userInput.trim().toLowerCase();
    const normalizedTarget = currentWord.trim().toLowerCase();
    
    if (normalizedInput === normalizedTarget) {
      successMessage = getRandomSuccessMessage();
      showSuccess = true;
      setTimeout(() => {
        showSuccess = false;
        selectRandomWord();
      }, 2000);
    }
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const rawValue = target.value;
    
    // Apply case transformation if needed
    if ($caseMode === 'uppercase') {
      userInput = rawValue.toUpperCase();
      target.value = userInput;
    } else if ($caseMode === 'lowercase') {
      userInput = rawValue.toLowerCase();
      target.value = userInput;
    } else {
      userInput = rawValue;
    }
    
    checkAnswer();
  }

  function ensureFocus() {
    if (inputElement && !showSuccess) {
      inputElement.focus();
    }
  }

  // Keep input focused at all times
  $: if (inputElement && !showSuccess) {
    setTimeout(() => inputElement.focus(), 0);
  }

  onMount(() => {
    ensureFocus();
    
    // Re-focus when window regains focus
    const handleWindowFocus = () => ensureFocus();
    window.addEventListener('focus', handleWindowFocus);
    
    // Re-focus when clicking anywhere on the page
    const handlePageClick = () => ensureFocus();
    document.addEventListener('click', handlePageClick);
    
    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('click', handlePageClick);
    };
  });
</script>

<div class="game-container">
  {#if $enabledWords.length === 0}
    <div class="no-words">
      <h2>No words available!</h2>
      <p>Please go to <a href="/settings">Settings</a> to create and enable word lists.</p>
    </div>
  {:else}
    <div class="word-display" class:success={showSuccess}>
      <h1>{applyCase(currentWord, $caseMode)}</h1>
    </div>

    <div class="input-area">
      <input
        bind:this={inputElement}
        bind:value={userInput}
        on:input={handleInput}
        placeholder="Type the word here..."
        disabled={showSuccess}
      />
    </div>

    {#if showSuccess}
      <div class="success-message">
        {successMessage}
      </div>
    {/if}

    <button class="skip-button" on:click={selectRandomWord} disabled={showSuccess}>
      Skip Word
    </button>
  {/if}
</div>

<style>
  .game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
  }

  .no-words {
    text-align: center;
    padding: 3rem;
  }

  .no-words a {
    color: #007bff;
    text-decoration: none;
  }

  .no-words a:hover {
    text-decoration: underline;
  }

  .word-display {
    background-color: white;
    padding: 3rem 4rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .word-display h1 {
    margin: 0;
    font-size: 3rem;
    color: #333;
    text-align: center;
  }

  .word-display.success {
    background-color: #4caf50;
    transform: scale(1.1);
  }

  .word-display.success h1 {
    color: white;
  }

  .input-area {
    display: flex;
    gap: 1rem;
    width: 100%;
    max-width: 500px;
  }

  input {
    flex: 1;
    padding: 1rem;
    font-size: 1.5rem;
    border: 2px solid #ddd;
    border-radius: 0.5rem;
    outline: none;
    transition: border-color 0.2s;
  }

  input:focus {
    border-color: #007bff;
  }

  input:disabled {
    background-color: #f0f0f0;
  }

  button {
    padding: 1rem 2rem;
    font-size: 1.2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:hover:not(:disabled) {
    background-color: #0056b3;
  }

  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .skip-button {
    background-color: #6c757d;
  }

  .skip-button:hover:not(:disabled) {
    background-color: #545b62;
  }

  .success-message {
    font-size: 2rem;
    color: #4caf50;
    animation: bounce 0.5s ease-out;
  }

  @keyframes bounce {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
</style>