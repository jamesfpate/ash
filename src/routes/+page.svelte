<script lang="ts">
  import { onMount } from 'svelte';
  import { enabledWords } from '$lib/stores/wordLists';
  import { wordQueue } from '$lib/stores/wordQueue';
  import { caseMode, applyCase } from '$lib/stores/caseSettings';
  import { keyboardSettings } from '$lib/stores/keyboardSettings';
  import { getRandomSuccessMessage } from '$lib/defaultLists';
  import { playRandomSuccessSound, playChimeSound, initializeSounds } from '$lib/sounds';
  import WordListManager from '$lib/components/WordListManager.svelte';
  import SettingsPanel from '$lib/components/SettingsPanel.svelte';
  import { imageSettings } from '$lib/stores/imageSettings';
  import type { WordWithImage } from '$lib/types';

  let currentWord: string | WordWithImage | null = null;
  let userInput = '';
  let showSuccess = false;
  let inputElement: HTMLInputElement;
  let successMessage = '';
  
  $: currentWordText = currentWord ? (typeof currentWord === 'string' ? currentWord : currentWord.text) : '';
  $: currentWordImage = currentWord && typeof currentWord !== 'string' ? currentWord.imageUrl : null;

  $: if ($enabledWords.length > 0 && !currentWord) {
    selectNextWord();
  }

  function selectNextWord() {
    const nextWord = wordQueue.getNextWord();
    if (nextWord) {
      currentWord = nextWord;
      userInput = '';
      // Ensure focus after word change
      setTimeout(() => ensureFocus(), 0);
    } else {
      currentWord = '';
    }
  }

  function checkAnswer() {
    const trimmedInput = userInput.trim();
    const trimmedTarget = currentWordText.trim();
    
    // Compare case-insensitively since the case mode is just for display/input
    const normalizedInput = trimmedInput.toLowerCase();
    const normalizedTarget = trimmedTarget.toLowerCase();
    
    if (normalizedInput === normalizedTarget) {
      successMessage = getRandomSuccessMessage();
      showSuccess = true;
      playRandomSuccessSound();
      setTimeout(() => {
        showSuccess = false;
        selectNextWord();
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
    if (userInput.length >= currentWordText.length) {
      if ($keyboardSettings.restrictToCorrectLetter) {
        event.preventDefault();
      }
      return;
    }
    
    const expectedChar = currentWordText[userInput.length];
    
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

<div class="page-wrapper">
  <div class="game-section" class:success={showSuccess}>
    <div class="success-wave-container">
      {#if showSuccess}
        <div class="wave wave1"></div>
        <div class="wave wave2"></div>
        <div class="wave wave3"></div>
        <div class="wave wave4"></div>
        <div class="radial-wave radial1"></div>
        <div class="radial-wave radial2"></div>
      {/if}
    </div>
    <div class="game-container">
      <div class="success-text-container">
        {#if showSuccess}
          <div class="success-message">
            {successMessage}
          </div>
        {/if}
      </div>
      
      {#if $enabledWords.length === 0}
        <div class="no-words">
      <h2>No words available!</h2>
      <p>Please go to <a href="/settings">Settings</a> to create and enable word lists.</p>
    </div>
  {:else}
    <div class="word-display">
      {#if currentWordImage}
        <div class="word-image-container">
          <img src={currentWordImage} alt={currentWordText} class="word-image" />
        </div>
      {/if}
      {#if !currentWordImage || $imageSettings.showTextWithImages}
        <h1>{applyCase(currentWordText, $caseMode)}</h1>
      {/if}
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


    <button class="skip-button" on:click={selectNextWord} disabled={showSuccess}>
      Skip Word
    </button>
  {/if}
    </div>
  </div>
  
  <WordListManager />
  
  <SettingsPanel />
</div>

<style>
  .page-wrapper {
    min-height: 100vh;
  }
  
  .game-section {
    background-color: #2d3436;
    padding: 3rem 0;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    position: relative;
    overflow: hidden;
    transition: background-color 0.5s ease;
  }
  
  .game-section.success {
    background-color: #4caf50;
  }
  
  .success-wave-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 1;
  }
  
  .wave {
    position: absolute;
    width: 200%;
    height: 100%;
    animation-duration: 1.8s;
    animation-timing-function: ease-out;
    animation-fill-mode: forwards;
  }
  
  .wave1 {
    bottom: 0;
    left: -20%;
    background: linear-gradient(45deg, rgba(34,139,34,0.5), rgba(50,205,50,0.7), rgba(144,238,144,0.6));
    animation-name: waveBottomLeft;
    animation-delay: 0s;
  }
  
  .wave2 {
    top: 0;
    right: -30%;
    background: linear-gradient(225deg, rgba(30,144,255,0.5), rgba(0,191,255,0.7), rgba(135,206,250,0.6));
    animation-name: waveTopRight;
    animation-delay: 0.2s;
  }
  
  .wave3 {
    bottom: 0;
    right: -10%;
    background: linear-gradient(135deg, rgba(0,128,128,0.5), rgba(72,209,204,0.7), rgba(175,238,238,0.6));
    animation-name: waveBottomRight;
    animation-delay: 0.4s;
  }
  
  .wave4 {
    top: 0;
    left: -40%;
    background: linear-gradient(315deg, rgba(34,139,34,0.5), rgba(0,100,0,0.7), rgba(50,205,50,0.6));
    animation-name: waveTopLeft;
    animation-delay: 0.6s;
  }
  
  .radial-wave {
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    animation-duration: 2s;
    animation-timing-function: ease-out;
    animation-fill-mode: forwards;
  }
  
  .radial1 {
    bottom: 20%;
    left: 10%;
    background: radial-gradient(circle, rgba(0,255,127,0.6), rgba(46,139,87,0.4), rgba(0,128,128,0.3), transparent 70%);
    animation-name: radialExpand1;
    animation-delay: 0.3s;
  }
  
  .radial2 {
    top: 30%;
    right: 15%;
    background: radial-gradient(circle, rgba(70,130,180,0.6), rgba(100,149,237,0.4), rgba(173,216,230,0.3), transparent 70%);
    animation-name: radialExpand2;
    animation-delay: 0.8s;
  }
  
  @keyframes waveBottomLeft {
    0% {
      transform: translateX(-100%) scaleY(0) rotate(0deg);
      border-radius: 0 0 80% 20%;
    }
    60% {
      transform: translateX(20%) scaleY(1.2) rotate(10deg);
      border-radius: 0 0 60% 40%;
    }
    100% {
      transform: translateX(100%) scaleY(0.3) rotate(15deg);
      border-radius: 0 0 40% 60%;
      opacity: 0;
    }
  }
  
  @keyframes waveTopRight {
    0% {
      transform: translateX(100%) scaleY(0) rotate(0deg);
      border-radius: 50% 50% 0 0;
    }
    60% {
      transform: translateX(-20%) scaleY(1) rotate(-8deg);
      border-radius: 30% 70% 0 0;
    }
    100% {
      transform: translateX(-100%) scaleY(0.4) rotate(-12deg);
      border-radius: 20% 80% 0 0;
      opacity: 0;
    }
  }
  
  @keyframes waveBottomRight {
    0% {
      transform: translateX(100%) scaleY(0) rotate(0deg);
      border-radius: 0 0 20% 80%;
    }
    60% {
      transform: translateX(-30%) scaleY(0.9) rotate(-5deg);
      border-radius: 0 0 40% 60%;
    }
    100% {
      transform: translateX(-100%) scaleY(0.2) rotate(-8deg);
      border-radius: 0 0 60% 40%;
      opacity: 0;
    }
  }
  
  @keyframes waveTopLeft {
    0% {
      transform: translateX(-100%) scaleY(0) rotate(0deg);
      border-radius: 80% 20% 0 0;
    }
    60% {
      transform: translateX(40%) scaleY(0.8) rotate(12deg);
      border-radius: 60% 40% 0 0;
    }
    100% {
      transform: translateX(100%) scaleY(0.1) rotate(18deg);
      border-radius: 40% 60% 0 0;
      opacity: 0;
    }
  }
  
  @keyframes radialExpand1 {
    0% {
      transform: scale(0) rotate(0deg);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.5) rotate(180deg);
      opacity: 0.6;
    }
    100% {
      transform: scale(3) rotate(360deg);
      opacity: 0;
    }
  }
  
  @keyframes radialExpand2 {
    0% {
      transform: scale(0) rotate(0deg);
      opacity: 0.7;
    }
    50% {
      transform: scale(1.2) rotate(-180deg);
      opacity: 0.5;
    }
    100% {
      transform: scale(2.5) rotate(-360deg);
      opacity: 0;
    }
  }
  
  .success-text-container {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
  }
  
  .success-message {
    font-size: 2.5rem;
    color: white !important;
    text-align: center;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    font-weight: 700;
    animation: successBounce 0.6s ease-out;
    z-index: 10;
    position: relative;
  }
  
  @keyframes successBounce {
    0% {
      transform: scale(0) rotate(-180deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.3) rotate(-90deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }
  
  .game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 0 2rem;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 280px;
    padding: 1rem 0;
  }

  .word-image-container {
    margin-bottom: 1.5rem;
  }

  .word-image {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border: 3px solid rgba(255, 255, 255, 0.2);
  }

  .word-display h1 {
    margin: 0;
    font-size: 3.5rem;
    color: white;
    text-align: center;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    font-weight: 600;
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