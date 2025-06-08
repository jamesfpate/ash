<script lang="ts">
  import { onMount } from 'svelte';
  import { enabledWords } from '$lib/stores/wordLists';
  import { caseMode, applyCase } from '$lib/stores/caseSettings';
  import { keyboardSettings } from '$lib/stores/keyboardSettings';
  import { getRandomSuccessMessage } from '$lib/defaultLists';
  import { playRandomSuccessSound, playChimeSound, initializeSounds } from '$lib/sounds';

  let currentWord = '';
  let previousWord = '';
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
    
    // If there's only one word, we have to use it
    if ($enabledWords.length === 1) {
      previousWord = currentWord;
      currentWord = $enabledWords[0];
      userInput = '';
      setTimeout(() => ensureFocus(), 0);
      return;
    }
    
    // Keep selecting until we get a different word
    let newWord = currentWord;
    let attempts = 0;
    while (newWord === currentWord && attempts < 10) {
      const randomIndex = Math.floor(Math.random() * $enabledWords.length);
      newWord = $enabledWords[randomIndex];
      attempts++;
    }
    
    previousWord = currentWord;
    currentWord = newWord;
    userInput = '';
    // Ensure focus after word change
    setTimeout(() => ensureFocus(), 0);
  }

  function checkAnswer() {
    const trimmedInput = userInput.trim();
    const trimmedTarget = currentWord.trim();
    
    // Compare case-insensitively since the case mode is just for display/input
    const normalizedInput = trimmedInput.toLowerCase();
    const normalizedTarget = trimmedTarget.toLowerCase();
    
    if (normalizedInput === normalizedTarget) {
      successMessage = getRandomSuccessMessage();
      showSuccess = true;
      playRandomSuccessSound();
      setTimeout(() => {
        showSuccess = false;
        selectRandomWord();
      }, 2000);
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    const char = event.key;
    
    // Allow special keys (backspace, delete, arrow keys, etc.)
    if (char.length > 1) {
      return;
    }
    
    // Check if we've reached the end of the word
    if (userInput.length >= currentWord.length) {
      if ($keyboardSettings.restrictToCorrectLetter) {
        event.preventDefault();
      }
      return;
    }
    
    const expectedChar = currentWord[userInput.length];
    
    // Check if the typed character is correct (case-insensitive)
    const isCorrect = char.toLowerCase() === expectedChar.toLowerCase();
    
    if (isCorrect) {
      // Play chime sound for correct letter
      playChimeSound();
    }
    
    // If restriction is enabled, prevent incorrect characters from being typed
    if ($keyboardSettings.restrictToCorrectLetter && !isCorrect) {
      event.preventDefault();
      return;
    }
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    let newValue = target.value;
    
    // Apply case transformation
    if ($caseMode === 'uppercase') {
      newValue = newValue.toUpperCase();
    } else if ($caseMode === 'lowercase') {
      newValue = newValue.toLowerCase();
    }
    
    // Update the input value
    userInput = newValue;
    target.value = userInput;
    
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
    initializeSounds();
    
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
        on:keypress={handleKeyPress}
        placeholder=""
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