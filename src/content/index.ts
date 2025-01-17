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

// Wird aufgerufen, wenn sich der Speicher ändert
function onStorageChange(changes: { [key: string]: chrome.storage.StorageChange }, namespace: string) {
    if (changes.extensionEnabled) {
        const newValue = changes.extensionEnabled.newValue;
        updateContentUI(newValue);
    }
}

// Aktualisiert die Anzahl der erkannten Felder im Overlay
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

    const initialWidth = 300;
    const initialHeight = 250;
    outputContainer.style.width = initialWidth + 'px';
    outputContainer.style.height = initialHeight + 'px';

    // Basis-Styling für die Box
    Object.assign(outputContainer.style, {
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '10px',
        overflow: 'hidden',
        zIndex: '10001',
        fontFamily: 'monospace'
    });

    // Der Textbereich (oben in der Box)
    const outputBox = document.createElement('div');
    outputBox.id = 'test-output';
    outputBox.classList.add('content-ui-element');
    Object.assign(outputBox.style, {
        position: 'absolute',
        top: '10px',
        left: '10px',
        right: '10px',
        bottom: '60px',
        overflowY: 'auto',
        whiteSpace: 'pre-wrap',
        backgroundColor: '#f9f9f9'
    });
    outputContainer.appendChild(outputBox);

    // Separater Container für die beiden Buttons
    const buttonContainer = document.createElement('div');
    Object.assign(buttonContainer.style, {
        position: 'absolute',
        left: '10px',
        right: '10px',
        bottom: '10px',
        display: 'flex',
        gap: '10px',
        justifyContent: 'space-between'
    });
    outputContainer.appendChild(buttonContainer);

    // Copy-Button
    const copyButton = document.createElement('button');
    copyButton.innerText = 'Tests kopieren';
    Object.assign(copyButton.style, {
        flex: '1',
        height: '40px',
        fontSize: '14px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: '#4CAF50',
        color: 'white'
    });
    copyButton.addEventListener('click', () => {
        const outputContent = outputBox.textContent || '';
        if (outputContent.trim() === '') {
            alert('Keine Tests vorhanden, um sie zu kopieren.');
            return;
        }
        navigator.clipboard.writeText(outputContent)
            .then(() => alert('Tests erfolgreich kopiert!'))
            .catch(err => alert('Fehler beim Kopieren: ' + err));
    });
    buttonContainer.appendChild(copyButton);

    // Clear-Button
    const clearButton = document.createElement('button');
    clearButton.innerText = 'Inhalt löschen';
    Object.assign(clearButton.style, {
        flex: '1',
        height: '40px',
        fontSize: '14px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: '#f44336',
        color: 'white'
    });
    clearButton.addEventListener('click', () => {
        outputBox.textContent = '';
    });
    buttonContainer.appendChild(clearButton);

    // Resize-Handle oben rechts (eigene Drag-Logik)
    const resizeHandle = document.createElement('div');
    Object.assign(resizeHandle.style, {
        position: 'absolute',
        top: '0',
        right: '0',
        width: '15px',
        height: '15px',
        cursor: 'nwse-resize',
        backgroundColor: 'rgba(0,0,0,0.2)'
    });
    outputContainer.appendChild(resizeHandle);

    // Drag-Events für "nach oben und rechts" vergrößern
    resizeHandle.addEventListener('mousedown', onMouseDown);

    function onMouseDown(e: MouseEvent) {
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = parseInt(window.getComputedStyle(outputContainer).width, 10);
        const startHeight = parseInt(window.getComputedStyle(outputContainer).height, 10);

        function onMouseMove(ev: MouseEvent) {
            const dx = ev.clientX - startX;
            const dy = startY - ev.clientY; // oben -> Y wird kleiner
            let newWidth = startWidth + dx;
            let newHeight = startHeight + dy;

            // Mindestbreite/-höhe erzwingen
            if (newWidth < initialWidth) newWidth = initialWidth;
            if (newHeight < initialHeight) newHeight = initialHeight;

            outputContainer.style.width = newWidth + 'px';
            outputContainer.style.height = newHeight + 'px';
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    // Box zum DOM hinzufügen
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
