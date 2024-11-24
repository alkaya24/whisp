console.log("Extension gestartet: Interaktive Grenzwert-Definition für Eingabefelder");

type FieldConstraints = {
    type: 'number' | 'string';
    min?: number;
    max?: number;
    required?: boolean;
};


const fieldRules = new Map<HTMLInputElement, FieldConstraints>();


function isVisible(element: HTMLElement): boolean {
    return element.offsetWidth > 0 && element.offsetHeight > 0;
}


function findBasicInputFields(): HTMLInputElement[] {
    return Array.from(
        document.querySelectorAll("input:not([type='hidden']):not([type='checkbox']):not([type='radio']):not([type='button']):not([type='submit'])")
    ).filter((el): el is HTMLInputElement => el instanceof HTMLInputElement && isVisible(el));
}


function displayDetectedFields() {
    const fields = findBasicInputFields();

    fields.forEach((field, index) => {
        
        field.style.border = "2px solid red";

        
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

        
        const rect = field.getBoundingClientRect();
        label.style.top = `${window.scrollY + rect.top - 20}px`;
        label.style.left = `${window.scrollX + rect.left}px`;

        
        document.body.appendChild(label);

        
        field.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            openFieldConfigurator(field);
        });

       
        field.addEventListener('input', () => validateField(field));
    });

    
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
    configDiv.style.border = '1px solid #ddd';
    configDiv.style.borderRadius = '15px';
    configDiv.style.padding = '20px';
    configDiv.style.zIndex = '10001';
    configDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    configDiv.style.maxWidth = '400px';
    configDiv.style.width = '100%';
    configDiv.style.fontFamily = 'Arial, sans-serif';
    configDiv.style.color = '#333';

    configDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; color: #4CAF50;">Feld-Konfiguration</h3>
        <label>Feldtyp:</label>
        <select id="field-type" style="width: 100%; padding: 8px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #ccc;">
            <option value="number">Zahl</option>
            <option value="string">Text</option>
        </select><br/><br/>
        <div id="number-config">
            <label>Min:</label><input type="number" id="min-value" style="width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 5px; border: 1px solid #ccc;"/><br/>
            <label>Max:</label><input type="number" id="max-value" style="width: 100%; padding: 8px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #ccc;"/><br/>
        </div>
        <div id="string-config" style="display: none;">
            <label>Min. Länge:</label><input type="number" id="min-length" style="width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 5px; border: 1px solid #ccc;"/><br/>
            <label>Max. Länge:</label><input type="number" id="max-length" style="width: 100%; padding: 8px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #ccc;"/><br/>
        </div>
        <div style="text-align: center;">
            <button id="save-config" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">Speichern</button>
            <button id="generate-tests" style="padding: 10px 20px; background-color: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">Playwright-Test generieren</button>
            <button id="cancel-config" style="padding: 10px 20px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">Abbrechen</button>
        </div>
    `;

    document.body.appendChild(configDiv);

    const fieldType = configDiv.querySelector('#field-type') as HTMLSelectElement;
    const numberConfig = configDiv.querySelector('#number-config') as HTMLElement;
    const stringConfig = configDiv.querySelector('#string-config') as HTMLElement;

   
    fieldType.addEventListener('change', () => {
        if (fieldType.value === 'number') {
            numberConfig.style.display = 'block';
            stringConfig.style.display = 'none';
        } else {
            numberConfig.style.display = 'none';
            stringConfig.style.display = 'block';
        }
    });

   
    configDiv.querySelector('#save-config')?.addEventListener('click', () => {
        if (fieldType.value === 'number') {
            const min = parseFloat((configDiv.querySelector('#min-value') as HTMLInputElement).value);
            const max = parseFloat((configDiv.querySelector('#max-value') as HTMLInputElement).value);
            fieldRules.set(field, { type: 'number', min, max });
        } else if (fieldType.value === 'string') {
            const minLength = parseInt((configDiv.querySelector('#min-length') as HTMLInputElement).value, 10);
            const maxLength = parseInt((configDiv.querySelector('#max-length') as HTMLInputElement).value, 10);
            fieldRules.set(field, { type: 'string', min: minLength, max: maxLength });
        }

        document.body.removeChild(configDiv);
    });

    
    configDiv.querySelector('#generate-tests')?.addEventListener('click', () => {
        generatePlaywrightTests(field);
    });

   
    configDiv.querySelector('#cancel-config')?.addEventListener('click', () => {
        document.body.removeChild(configDiv);
    });
}

// Funktion zum Validieren der Eingabefelder
function validateField(field: HTMLInputElement) {
    const rules = fieldRules.get(field);
    if (!rules) return;

    let valid = true;

    if (rules.type === 'number') {
        const value = parseFloat(field.value);
        if (rules.min !== undefined && value < rules.min) valid = false;
        if (rules.max !== undefined && value > rules.max) valid = false;
    } else if (rules.type === 'string') {
        const value = field.value;
        if (rules.min !== undefined && value.length < rules.min) valid = false;
        if (rules.max !== undefined && value.length > rules.max) valid = false;
    }

    if (!valid) {
        field.style.borderColor = 'red';
    } else {
        field.style.borderColor = '';
    }
}

// Funktion zum Generieren von Playwright-Test-Code
function generatePlaywrightTests(field: HTMLInputElement) {
    const rules = fieldRules.get(field);
    if (!rules) return;

    const fieldId = field.name || field.id || 'unbenanntes Feld';
    let testCode = '';

    if (rules.type === 'number') {
        testCode = `
import { test, expect } from '@playwright/test';

test('Validiere Feld ${fieldId} für Zahlen zwischen ${rules.min || 0} und ${rules.max || Infinity}', async ({ page }) => {
    await page.goto('${window.location.href}');
    
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

test('Validiere Feld ${fieldId} für Text zwischen ${rules.min || 0} und ${rules.max || Infinity} Zeichen', async ({ page }) => {
    await page.goto('${window.location.href}');
    
    const field = await page.locator('input[name="${field.name}"]');
    await field.fill('Testwert');
    await expect(field).toHaveValue('Testwert');
    await field.fill('');
    await expect(field).not.toHaveValue('');
    await field.fill('a'.repeat(${rules.max || Infinity}));
    await expect(field).toHaveValue('a'.repeat(${rules.max || Infinity}));
    await field.fill('a'.repeat(${(rules.min || 0) - 1}));
    await expect(field).not.toHaveValue('a'.repeat(${(rules.min || 0) - 1}));
});
        `;
    }

    const outputBox = document.getElementById('test-output');
    if (outputBox) {
        outputBox.textContent += testCode + '\n';
    }
}

function addTestOutputBox() {
    const outputContainer = document.createElement('div');
    outputContainer.id = 'test-output-container';
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
    outputBox.style.height = '200px';
    outputBox.style.overflowY = 'auto';
    outputBox.style.whiteSpace = 'pre-wrap';
    outputBox.style.marginBottom = '10px';
    outputContainer.appendChild(outputBox);

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
