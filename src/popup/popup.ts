/// <reference types="chrome" />

// UI-Elemente
const toggleExtension = document.getElementById('toggle-extension') as HTMLInputElement;
const toggleLabel = document.getElementById('toggle-label') as HTMLElement;
const generateTestsButton = document.getElementById('generate-tests') as HTMLButtonElement;
const message = document.getElementById('message') as HTMLElement;

function initializePopupUI() {
    // Lade den Status aus Chrome Storage
    chrome.storage.local.get(['extensionEnabled'], (result) => {
        if (chrome.runtime.lastError) {
            console.error('Fehler beim Zugriff auf den Speicher:', chrome.runtime.lastError);
            return;
        }
        const isEnabled = result.extensionEnabled || false;
        toggleExtension.checked = isEnabled;
        updateToggleUI(isEnabled);
    });
}

function setupPopupEventListeners() {
    toggleExtension.addEventListener('change', onToggleChange);
    generateTestsButton.addEventListener('click', onGenerateTestsClick);
}

function onToggleChange() {
    const isEnabled = toggleExtension.checked;

    // Speichere den Status in Chrome Storage
    chrome.storage.local.set({ extensionEnabled: isEnabled });

    updateToggleUI(isEnabled); // UI aktualisieren
}

async function onGenerateTestsClick() {
    console.log('generateTestsButton clicked');
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs[0].id) {
            const response = await chrome.tabs.sendMessage(tabs[0].id, { action: 'generateTests' });
            if (response) {
                message.textContent = 'Gesamttest erfolgreich generiert!';
                message.style.display = 'block';
                setTimeout(() => (message.style.display = 'none'), 3000);
            }
        }
    } catch (error) {
        console.error('Fehler beim Generieren der Tests:', error);
    }
}

// UI basierend auf dem Status aktualisieren
function updateToggleUI(isEnabled: boolean) {
    toggleExtension.checked = isEnabled;
    toggleLabel.textContent = isEnabled ? 'Extension aktiviert' : 'Extension deaktiviert';
    generateTestsButton.style.display = isEnabled ? 'block' : 'none';
}

// Call the new functions
initializePopupUI();
setupPopupEventListeners();
