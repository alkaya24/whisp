/// <reference types="chrome" />

// UI-Elemente
const toggleExtension = document.getElementById('toggle-extension') as HTMLInputElement;
const toggleLabel = document.getElementById('toggle-label') as HTMLElement;
const generateTestsButton = document.getElementById('generate-tests') as HTMLButtonElement;
const message = document.getElementById('message') as HTMLElement;

window.addEventListener('load', () => {
    // Lade den Status aus Chrome Storage
    chrome.storage.local.get(['extensionEnabled'], (result) => {
        const isEnabled = result.extensionEnabled || false;
        toggleExtension.checked = isEnabled;
        console.log('Checkbox-Status aus Chrome Storage geladen:', isEnabled);
        updateToggleUI(isEnabled);
    });
});

toggleExtension.addEventListener('change', () => {
    const isEnabled = toggleExtension.checked;

    // Speichere den Status in Chrome Storage
    chrome.storage.local.set({ extensionEnabled: isEnabled }, () => {
        console.log('extensionEnabled in Chrome Storage gesetzt auf:', isEnabled);
    });

    updateToggleUI(isEnabled); // UI aktualisieren
});

// UI basierend auf dem Status aktualisieren
function updateToggleUI(isEnabled: boolean) {
    console.log('updateToggleUI called with:', isEnabled);
    toggleExtension.checked = isEnabled;
    toggleLabel.textContent = isEnabled ? 'Extension aktiviert' : 'Extension deaktiviert';
}

// Tests generieren
generateTestsButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            chrome.runtime.sendMessage(
                { type: 'generateTests' },
                (response) => {
                    if (response?.success) {
                        const testCases = response.testCases
                            .map((test: any) => {
                                const rules = test.rules;
                                const constraints = rules.type === 'number'
                                    ? `Min: ${rules.min || 'N/A'}, Max: ${rules.max || 'N/A'}`
                                    : 'String-Feld';
                                return `Feld ${test.fieldId}: ${constraints}`;
                            })
                            .join('\n');

                        alert(`Generierte Tests:\n\n${testCases}`);
                    }
                }
            );
        }
    });

    // Zeige eine Bestätigungsmeldung
    if (message) {
        message.style.display = 'block';
        setTimeout(() => (message.style.display = 'none'), 3000);
    }
});
