<script lang="ts">
  import { caseMode } from '$lib/stores/caseSettings';
  import { keyboardSettings } from '$lib/stores/keyboardSettings';
  import { imageSettings } from '$lib/stores/imageSettings';
  
  let isOpen = false;
  
  function toggleSettings() {
    isOpen = !isOpen;
  }
</script>

<div class="settings-panel">
  <button class="settings-toggle" on:click={toggleSettings}>
    {isOpen ? '▼' : '▶'} Settings
  </button>
  
  {#if isOpen}
    <div class="settings-content">
      <div class="settings-section">
        <h3>Display Settings</h3>
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
      
      <div class="settings-section">
        <h3>Keyboard Settings</h3>
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
      
      <div class="settings-section">
        <h3>Image Settings</h3>
        <label class="checkbox-label">
          <input
            type="checkbox"
            checked={$imageSettings.showTextWithImages}
            on:change={(e) => {
              $imageSettings = {
                ...$imageSettings,
                showTextWithImages: e.currentTarget.checked
              };
            }}
          />
          <span>Show text for words with images</span>
        </label>
      </div>
    </div>
  {/if}
</div>

<style>
  .settings-panel {
    max-width: 1200px;
    margin: 3rem auto 2rem;
    padding: 0 2rem;
  }
  
  .settings-toggle {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 auto;
  }
  
  .settings-toggle:hover {
    background-color: #5a6268;
    transform: translateY(-1px);
  }
  
  .settings-content {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-top: 1rem;
    padding: 2rem;
    animation: slideDown 0.3s ease-out;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .settings-section {
    margin-bottom: 2rem;
  }
  
  .settings-section:last-child {
    margin-bottom: 0;
  }
  
  h3 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.2rem;
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
  
  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
  }
  
  input[type="radio"],
  input[type="checkbox"] {
    width: auto;
    margin: 0;
    cursor: pointer;
  }
</style>