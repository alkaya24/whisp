/// <reference types="chrome" />

// UI-Elemente aus dem Popup-DOM abrufen
const toggleExtension = document.getElementById('toggle-extension') as HTMLInputElement;
const toggleLabel = document.getElementById('toggle-label') as HTMLElement;
const generateTestsButton = document.getElementById('generate-tests') as HTMLButtonElement;
const message = document.getElementById('message') as HTMLElement;

// Initialisiert die Popup-UI, indem der Status der Erweiterung aus dem Chrome-Speicher geladen wird
function initializePopupUI() {
    chrome.storage.local.get(['extensionEnabled'], result => {
        if (chrome.runtime.lastError) {
            console.error('Fehler beim Zugriff auf den Speicher:', chrome.runtime.lastError);

            return;
        }
        const isEnabled = result.extensionEnabled || false;
        toggleExtension.checked = isEnabled;
        updateToggleUI(isEnabled);
    });
}

// Setzt die Event-Listener für die UI-Elemente im Popup
function setupPopupEventListeners() {
    toggleExtension.addEventListener('change', onToggleChange);
    generateTestsButton.addEventListener('click', onGenerateTestsClick);
}

// Wird aufgerufen, wenn der Schalter für die Erweiterung umgelegt wird
function onToggleChange() {
    const isEnabled = toggleExtension.checked;

    // Speichert den neuen Status der Erweiterung im Chrome-Speicher
    chrome.storage.local.set({ extensionEnabled: isEnabled });

    updateToggleUI(isEnabled); // Aktualisiert die UI basierend auf dem neuen Status
}

// Asynchrone Funktion, die aufgerufen wird, wenn der Button zum Generieren von Tests geklickt wird
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

// Aktualisiert die UI-Elemente basierend auf dem Aktivierungsstatus der Erweiterung
function updateToggleUI(isEnabled: boolean) {
    toggleExtension.checked = isEnabled;
    toggleLabel.textContent = isEnabled ? 'Extension aktiviert' : 'Extension deaktiviert';
    generateTestsButton.style.display = isEnabled ? 'block' : 'none';
}

// Initialisiert die Popup-UI und setzt die Event-Listener
initializePopupUI();
setupPopupEventListeners();
