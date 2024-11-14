console.log("Extension gestartet: Interaktive Grenzwert-Definition für Eingabefelder");

type FieldConstraints = {
    type: 'number' | 'string';
    min?: number;
    max?: number;
    required?: boolean;
};

// Map zur Speicherung der Regeln pro Feld
const fieldRules = new Map<HTMLInputElement, FieldConstraints>();

// Funktion zum Überprüfen, ob ein Element sichtbar ist
function isVisible(element: HTMLElement): boolean {
    return element.offsetWidth > 0 && element.offsetHeight > 0;
}

// Funktion zum Erkennen von klassischen Eingabefeldern
function findBasicInputFields(): HTMLInputElement[] {
    return Array.from(
        document.querySelectorAll("input:not([type='hidden']):not([type='checkbox']):not([type='radio']):not([type='button']):not([type='submit'])")
    ).filter((el): el is HTMLInputElement => el instanceof HTMLInputElement && isVisible(el));
}

// Funktion zum Anzeigen und Markieren der erkannten Felder
function displayDetectedFields() {
    const fields = findBasicInputFields();

    fields.forEach((field, index) => {
        // Markiere das Feld mit einem roten Rahmen
        field.style.border = "2px solid red";

        // Nummeriere die Felder mit Labels
        const label = document.createElement('span');
        label.innerText = `Feld ${index + 1}`;
        label.style.position = 'absolute';
        label.style.backgroundColor = 'yellow';
        label.style.color = 'black';
        label.style.fontSize = '12px';
        label.style.padding = '2px';
        label.style.border = '1px solid black';
        label.style.borderRadius = '3px';
        label.style.zIndex = '1000';

        // Positioniere das Label über dem Eingabefeld
        const rect = field.getBoundingClientRect();
        label.style.top = `${window.scrollY + rect.top - 20}px`;
        label.style.left = `${window.scrollX + rect.left}px`;

        // Füge das Label in den DOM ein
        document.body.appendChild(label);

        // Event-Listener für Rechtsklick, um Regeln zu konfigurieren
        field.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            openFieldConfigurator(field);
        });

        // Event-Listener für die Validierung der Eingaben
        field.addEventListener('input', () => validateField(field));
    });

    // Zeige ein Overlay mit der Anzahl der Felder
    updateFieldCountOverlay(fields.length);
}

// Funktion zur Aktualisierung des Overlays unten rechts
function updateFieldCountOverlay(count: number) {
    let overlay = document.getElementById('field-count-overlay') as HTMLElement;

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'field-count-overlay';
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

// Funktion zum Öffnen des Konfigurationsfensters
function openFieldConfigurator(field: HTMLInputElement) {
    const configDiv = document.createElement('div');
    configDiv.style.position = 'fixed';
    configDiv.style.top = '20%';
    configDiv.style.left = '50%';
    configDiv.style.transform = 'translate(-50%, -50%)';
    configDiv.style.backgroundColor = 'white';
    configDiv.style.border = '1px solid black';
    configDiv.style.borderRadius = '10px';
    configDiv.style.padding = '20px';
    configDiv.style.zIndex = '10001';
    configDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

    configDiv.innerHTML = `
        <h3>Feld-Konfiguration</h3>
        <label>Feldtyp:</label>
        <select id="field-type">
            <option value="number">Zahl</option>
            <option value="string">Text</option>
        </select><br/><br/>
        <div id="number-config">
            <label>Min:</label><input type="number" id="min-value"/><br/>
            <label>Max:</label><input type="number" id="max-value"/><br/>
        </div>
        <button id="save-config">Speichern</button>
        <button id="generate-tests">Playwright-Test generieren</button>
        <button id="cancel-config">Abbrechen</button>
    `;

    document.body.appendChild(configDiv);

    const fieldType = configDiv.querySelector('#field-type') as HTMLSelectElement;

    // Speichern der Konfiguration
    configDiv.querySelector('#save-config')?.addEventListener('click', () => {
        if (fieldType.value === 'number') {
            const min = parseFloat((configDiv.querySelector('#min-value') as HTMLInputElement).value);
            const max = parseFloat((configDiv.querySelector('#max-value') as HTMLInputElement).value);
            fieldRules.set(field, { type: 'number', min, max });
        }

        document.body.removeChild(configDiv);
    });

    // Generiere Playwright-Test
    configDiv.querySelector('#generate-tests')?.addEventListener('click', () => {
        generatePlaywrightTests(field);
    });

    // Abbrechen der Konfiguration
    configDiv.querySelector('#cancel-config')?.addEventListener('click', () => {
        document.body.removeChild(configDiv);
    });
}

// Funktion zur Validierung eines Feldes basierend auf den Regeln
function validateField(field: HTMLInputElement) {
    const rules = fieldRules.get(field);
    if (rules?.type === 'number') {
        const value = parseFloat(field.value);
        if (value < (rules.min || 0) || value > (rules.max || Infinity)) {
            field.style.backgroundColor = 'lightcoral';
        } else {
            field.style.backgroundColor = '';
        }
    }
}

// Funktion zum Generieren von Playwright-Tests
function generatePlaywrightTests(field: HTMLInputElement) {
    const rules = fieldRules.get(field);
    if (!rules) {
        alert('Keine Regeln für dieses Feld definiert.');
        return;
    }

    const fieldId = field.dataset.whispId || 'unbekannt';
    const pageURL = window.location.href; // Die aktuelle Seite wird ausgelesen
    let testCode = '';

    if (rules.type === 'number') {
        testCode = `
import { test, expect } from '@playwright/test';

test('Validiere Feld ${fieldId} für Zahlen zwischen ${rules.min || 0} und ${rules.max || Infinity}', async ({ page }) => {
    // Gehe zur aktuellen Seite
    await page.goto('${pageURL}');
    
    // Finde das Eingabefeld und teste es
    const field = await page.locator('input[name="${field.name}"]');
    await field.fill('${rules.min || 0}');
    await expect(field).toHaveValue('${rules.min || 0}');
    await field.fill('${rules.max || Infinity}');
    await expect(field).toHaveValue('${rules.max || Infinity}');
    await field.fill('invalid');
    await expect(field).not.toHaveValue('invalid');
});
        `;
    } else if (rules.type === 'string') {
        testCode = `
import { test, expect } from '@playwright/test';

test('Validiere Feld ${fieldId} für nicht-leeren Text', async ({ page }) => {
    // Gehe zur aktuellen Seite
    await page.goto('${pageURL}');
    
    // Finde das Eingabefeld und teste es
    const field = await page.locator('input[name="${field.name}"]');
    await field.fill('Testwert');
    await expect(field).toHaveValue('Testwert');
    await field.fill('');
    await expect(field).not.toHaveValue('');
});
        `;
    }

    const outputBox = document.getElementById('test-output');
    if (outputBox) {
        outputBox.textContent += testCode + '\n';
    }
}


// Test-Output-Box hinzufügen
function addTestOutputBox() {
    const outputContainer = document.createElement('div');
    outputContainer.id = 'test-output-container';
    outputContainer.style.position = 'fixed';
    outputContainer.style.bottom = '10px';
    outputContainer.style.left = '10px';
    outputContainer.style.width = '300px';
    outputContainer.style.height = '250px';
    outputContainer.style.backgroundColor = 'white';
    outputContainer.style.border = '1px solid black';
    outputContainer.style.padding = '10px';
    outputContainer.style.overflowY = 'auto';
    outputContainer.style.zIndex = '10001';
    outputContainer.style.fontFamily = 'monospace';

    // Box für generierte Tests
    const outputBox = document.createElement('div');
    outputBox.id = 'test-output';
    outputBox.style.height = '200px';
    outputBox.style.overflowY = 'auto';
    outputBox.style.whiteSpace = 'pre-wrap'; // Zeilenumbrüche erhalten
    outputBox.style.marginBottom = '10px';
    outputContainer.appendChild(outputBox);

    // Kopier-Button
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

// Initialisiere die Extension
window.addEventListener('load', () => {
    displayDetectedFields();
    addTestOutputBox();
});
