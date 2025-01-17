import { findBasicInputFields, findCheckboxes, labelAndCountCheckboxes } from './detectFields';
import { openFieldConfigurator, setupConfiguratorUI, loadFieldRulesFromLocalStorage, configShown } from './configurator';
import { validateField } from './validation';

// Initialisiert die Benutzeroberfläche, indem das Konfigurator-Element und die Testausgabebox hinzugefügt werden
function initializeUI() {
    setupConfiguratorUI();
    addTestOutputBox();
}

// Setzt die Event-Listener für das Laden des Fensters und Änderungen im Chrome-Speicher
function setupEventListeners() {
    window.addEventListener('load', onWindowLoad);
    chrome.storage.onChanged.addListener(onStorageChange);
}

// Wird beim Laden des Fensters aufgerufen, um den Status der Erweiterung zu überprüfen und die UI entsprechend zu aktualisieren
function onWindowLoad() {
    chrome.storage.local.get(['extensionEnabled'], (result) => {
        if (chrome.runtime.lastError) {
            console.error('Fehler beim Zugriff auf den Speicher:', chrome.runtime.lastError);
            return;
        }
        const isEnabled = result.extensionEnabled || false;
        let configDiv = document.querySelector('.field-configurator') as HTMLElement;
        if (!isEnabled) {
            configDiv.style.display = 'none';
        }
        updateContentUI(isEnabled);
    });

    // Erkennen und Labeln der grundlegenden Eingabefelder
    const fields = findBasicInputFields();

    fields.forEach((field, index) => {
        const label = createFieldLabel(index, field);
        document.body.appendChild(label);

        // Kontextmenü-Event-Listener, um den Konfigurator zu öffnen, wenn die Erweiterung aktiviert ist
        field.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            chrome.storage.local.get(['extensionEnabled'], (result) => {
                if (chrome.runtime.lastError) {
                    console.error('Fehler beim Zugriff auf den Speicher:', chrome.runtime.lastError);
                    return;
                }
                const isEnabled = result.extensionEnabled || false;
                if (isEnabled && !configShown) {
                    openFieldConfigurator(field);
                }
            });
        });

        //field.addEventListener('input', () => validateField(field));
    });

    // Aktualisiert das Overlay mit der Anzahl der erkannten Felder
    updateFieldCountOverlay(fields.length);

    // Erkennen und Zählen der Checkboxen
    const checkboxes = findCheckboxes();
    labelAndCountCheckboxes(checkboxes);

    // Lädt die gespeicherten Feldregeln aus dem lokalen Speicher
    loadFieldRulesFromLocalStorage();
}

function onStorageChange(changes: { [key: string]: chrome.storage.StorageChange }, namespace: string) {
    if (changes.extensionEnabled) {
        const newValue = changes.extensionEnabled.newValue;
        updateContentUI(newValue);
    }
}

function updateFieldCountOverlay(count: number) {
    let overlay = document.getElementById('field-count-overlay') as HTMLElement;

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'field-count-overlay';
        overlay.classList.add('content-ui-element');
        overlay.style.position = 'fixed';
        overlay.style.bottom = '10px';
        overlay.style.right = '10px';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.color = 'white';
        overlay.style.padding = '10px';
        overlay.style.borderRadius = '5px';
        overlay.style.zIndex = '10000';
        overlay.style.fontSize = '14px';
        document.body.appendChild(overlay);
    }

    overlay.innerText = `Erkannte Felder: ${count}`;
}

// Fügt eine Box zur Anzeige der generierten Tests hinzu
function addTestOutputBox() {
    const outputContainer = document.createElement('div');
    outputContainer.id = 'test-output-container';
    outputContainer.classList.add('content-ui-element');
    outputContainer.style.position = 'fixed';
    outputContainer.style.bottom = '10px';
    outputContainer.style.left = '10px';
    outputContainer.style.width = '300px';
    outputContainer.style.height = '250px';
    outputContainer.style.backgroundColor = 'white';
    outputContainer.style.border = '1px solid #ddd';
    outputContainer.style.borderRadius = '10px';
    outputContainer.style.padding = '10px';
    outputContainer.style.overflowY = 'auto';
    outputContainer.style.zIndex = '10001';
    outputContainer.style.fontFamily = 'monospace';

    // Box für generierte Tests
    const outputBox = document.createElement('div');
    outputBox.id = 'test-output';
    outputBox.classList.add('content-ui-element');
    outputBox.style.display = 'block';
    outputBox.style.height = '200px';
    outputBox.style.overflowY = 'auto';
    outputBox.style.whiteSpace = 'pre-wrap';
    outputBox.style.marginBottom = '10px';
    outputContainer.appendChild(outputBox);

    // Button zum Kopieren der generierten Tests
    const copyButton = document.createElement('button');
    copyButton.innerText = 'Tests kopieren';
    copyButton.style.display = 'block';
    copyButton.style.width = '100%';
    copyButton.style.padding = '10px';
    copyButton.style.fontSize = '14px';
    copyButton.style.color = 'white';
    copyButton.style.backgroundColor = '#4CAF50';
    copyButton.style.border = 'none';
    copyButton.style.borderRadius = '5px';
    copyButton.style.cursor = 'pointer';
    copyButton.style.textAlign = 'center';

    // Event-Listener zum Kopieren der Tests in die Zwischenablage
    copyButton.addEventListener('click', () => {
        const outputContent = document.getElementById('test-output')?.textContent || '';
        if (outputContent.trim() === '') {
            alert('Keine Tests vorhanden, um sie zu kopieren.');
            return;
        }
        navigator.clipboard.writeText(outputContent)
            .then(() => {
                alert('Tests erfolgreich in die Zwischenablage kopiert!');
            })
            .catch((err) => {
                console.error('Fehler beim Kopieren:', err);
                alert('Fehler beim Kopieren der Tests.');
            });
    });

    outputContainer.appendChild(copyButton);
    document.body.appendChild(outputContainer);
}

// Erstellt ein Label für ein Eingabefeld
function createFieldLabel(index: number, field: Element): HTMLSpanElement {
    const label = document.createElement('span');
    label.innerText = `Feld ${index + 1}`;
    label.classList.add('content-ui-element');

    // Stile für das Label anwenden
    Object.assign(label.style, {
        position: 'absolute',
        backgroundColor: 'yellow',
        color: 'black',
        fontSize: '12px',
        padding: '2px',
        border: '1px solid black',
        borderRadius: '3px',
        zIndex: '1000'
    });

    // Positioniere das Label relativ zum Eingabefeld
    const rect = field.getBoundingClientRect();
    label.style.top = `${window.scrollY + rect.top - 20}px`;
    label.style.left = `${window.scrollX + rect.left}px`;

    return label;
}

// Aktualisiert die Sichtbarkeit der UI-Elemente basierend auf dem Aktivierungsstatus der Erweiterung
export function updateContentUI(isEnabled: boolean) {
    const uiElements = document.querySelectorAll('.content-ui-element');
    uiElements.forEach(element => {
        if (isEnabled) {
            (element as HTMLElement).style.display = 'block';
        } else {
            (element as HTMLElement).style.display = 'none';
        }
    });
}

// Initialisiert die UI und setzt die Event-Listener
initializeUI();
setupEventListeners();
