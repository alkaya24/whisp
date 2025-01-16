import { generatePlaywrightTests } from "./playwrightGenerator";
import { fieldRules } from './fieldRulesStore';
import { FieldConstraints } from '../types/fieldTypes';

let rulesContainer: HTMLDivElement;

function saveFieldRulesToLocalStorage() {
    const rules = Array.from(fieldRules.entries()).reduce((acc, [field, constraintsArray]) => {
        const key = field.name || field.id;
        if (key) {
            acc[key] = constraintsArray;
        }
        return acc;
    }, {} as Record<string, FieldConstraints[]>);
    localStorage.setItem('fieldRules', JSON.stringify(rules));
}

export function loadFieldRulesFromLocalStorage() {
    const rules = localStorage.getItem('fieldRules');
    if (rules) {
        const parsedRules = JSON.parse(rules);
        Object.entries(parsedRules).forEach(([key, constraintsArray]) => {
            const field = document.querySelector(`input[name="${key}"], input[id="${key}"]`) as HTMLInputElement;
            if (field) {
                fieldRules.set(field, constraintsArray as FieldConstraints[]);
            }
        });
    }
}

function displayFieldRules(field: HTMLInputElement) {
    rulesContainer = document.createElement('div');
    rulesContainer.style.border = '1px solid #e0e0e0';
    rulesContainer.style.borderRadius = '8px';
    rulesContainer.style.padding = '15px';
    rulesContainer.style.marginTop = '20px';
    rulesContainer.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    rulesContainer.style.backgroundColor = '#fafafa';

    const rules = fieldRules.get(field) as FieldConstraints[];
    if (rules) {
        for (let index = 0; index < rules.length; index++) {
            const rule: FieldConstraints = rules[index];

            const ruleDiv = document.createElement('div');
            ruleDiv.style.display = 'flex';
            ruleDiv.style.justifyContent = 'space-between';
            ruleDiv.style.alignItems = 'center';
            ruleDiv.style.marginBottom = '12px';
            ruleDiv.style.padding = '10px';
            ruleDiv.style.border = '1px solid #ddd';
            ruleDiv.style.borderRadius = '5px';
            ruleDiv.style.backgroundColor = '#fff';
            ruleDiv.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';

            const ruleText = document.createElement('div');
            ruleText.textContent = `Regel ${index + 1} | Feldtyp: ${rule.type}`;
            ruleText.style.color = '#333';
            ruleText.style.fontSize = '14px';
            ruleText.style.fontWeight = '500';

            if (rule.type === 'number' || rule.type === 'string') {
                ruleText.textContent += ` | Min: ${rule.min} | Max: ${rule.max}`;
            }
            if (rule.type === 'validValues') {
                ruleText.textContent += ` | Gültige Werte: ${rule.validValues?.join(', ') || 'Keine'}`;
            }
            if (rule.type === 'invalidValues') {
                ruleText.textContent += ` | Ungültige Werte: ${rule.invalidValues?.join(', ') || 'Keine'}`;
            }
            if (rule.type === 'checkbox') {
                ruleText.textContent += ` | Erforderlich: ${rule.required ? 'Ja' : 'Nein'}`;
            }
            ruleText.textContent += ` | Erfolgsnachricht: ${rule.validMessage} | Fehlernachricht: ${rule.invalidMessage}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'x';
            deleteButton.style.background = '#f44336';
            deleteButton.style.border = 'none';
            deleteButton.style.borderRadius = '50%';
            deleteButton.style.width = '32px';
            deleteButton.style.height = '32px';
            deleteButton.style.color = 'white';
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.display = 'flex';
            deleteButton.style.justifyContent = 'center';
            deleteButton.style.alignItems = 'center';
            deleteButton.style.fontSize = '16px';
            deleteButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            deleteButton.addEventListener('mouseover', () => {
                deleteButton.style.backgroundColor = '#d32f2f';
            });
            deleteButton.addEventListener('mouseout', () => {
                deleteButton.style.backgroundColor = '#f44336';
            });

            deleteButton.addEventListener('click', () => {
                rules.splice(index, 1);
                saveFieldRulesToLocalStorage();
                rulesContainer.removeChild(ruleDiv);
            });

            ruleDiv.appendChild(ruleText);
            ruleDiv.appendChild(deleteButton);
            rulesContainer.appendChild(ruleDiv);
        }
    }

    return rulesContainer;
}

function findSubmitButton() {
    const selectors = ['button[type="submit"]', 'input[type="submit"]', 'button[id="submit"]', 'button[id="submit-button"]', 'button.submit', 'input.submit'];
    for (const selector of selectors) {
        const button = document.querySelector(selector); //TODO: Nach form selector suchen
        if (button) {
            return button.id || 'nicht definiert';
            // return selector; Optionales Feature, um den richtigen Selector zu finden
        }
    }
    return 'nicht definiert';
}

let configDiv: HTMLDivElement;
let initialized = false;

export function initializeConfigDiv() {
    if (!initialized) { return; }
    configDiv = document.createElement('div');
    configDiv.classList.add('field-configurator', 'content-ui-element');
    configDiv.style.position = 'absolute';
    configDiv.style.top = '50%';
    configDiv.style.left = '50%';
    configDiv.style.transform = 'translate(-50%, -50%)';
    configDiv.style.backgroundColor = 'white';
    configDiv.style.border = '1px solid #ddd';
    configDiv.style.borderRadius = '15px';
    configDiv.style.padding = '20px';
    configDiv.style.zIndex = '10001';
    configDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    configDiv.style.maxWidth = '500px';
    configDiv.style.width = '100%';
    configDiv.style.fontFamily = 'Arial, sans-serif';
    configDiv.style.color = '#333';
    configDiv.style.display = 'none';

    configDiv.innerHTML = `
        <h3 id="config-title" style="text-align: center; margin-bottom: 20px; color: #4CAF50;"></h3>
        <div style="display: flex; justify-content: space-around; margin-bottom: 20px;">
            <button id="tab-create-test" style="padding: 10px; cursor: pointer;">Test erstellen</button>
            <button id="tab-saved-tests" style="padding: 10px; cursor: pointer;">Gespeicherte Tests</button>
        </div>
        <div id="create-test-tab" style="margin-top: 20px;">
            <div style="margin-bottom: 20px; display: flex; align-items: center;">
                <label style="margin-right: 10px;">Submit-Button ID: </label>
                <input type="text" id="submit-button-id" style="width: 200px; padding: 5px;"/>
            </div>
            <label>Testtyp:</label>
            <select id="field-type" style="width: 100%; padding: 8px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #ccc;">
                <option value="number">Zahlenbereich</option>
                <option value="string">Textlänge</option>
                <option value="validValues">Gültige Eingaben</option>
                <option value="invalidValues">Ungültige Eingaben</option>
                <option value="checkbox">Checkbox</option>
            </select><br/><br/>
            <div id="number-string-config">
                <label>Minimum:</label><input type="number" id="min-value" style="width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 5px; border: 1px solid #ccc;"/><br/>
                <label>Maximum:</label><input type="number" id="max-value" style="width: 100%; padding: 8px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #ccc;"/><br/>
            </div>
            <div id="valid-values-config" style="display: none;">
                <label>Gültige Werte:</label><input type="text" id="valid-values" style="width: 100%; padding: 8px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #ccc;"/><br/>
            </div>
            <div id="invalid-values-config" style="display: none;">
                <label>Ungültige Werte:</label><input type="text" id="invalid-values" style="width: 100%; padding: 8px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #ccc;"/><br/>
            </div>
            <div id="checkbox-config" style="display: none; align-items: center; margin-bottom: 15px;">
                <label style="margin-right: 2px;">Erforderlich:</label><input type="checkbox" id="required-checkbox" checked/>
            </div>
            <div id="valid-message-config" style="display: block;">
                <label>Erfolgsnachricht:</label><input type="text" id="valid-message" placeholder="Erfolgsnachricht" style="width: 100%; padding: 8px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #ccc;"/><br/>
            </div>
            <div id="invalid-message-config" style="display: block;">
                <label>Fehlernachricht:</label><input type="text" id="invalid-message" placeholder="Fehlernachricht" style="width: 100%; padding: 8px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #ccc;"/><br/>
            </div>
            <div style="text-align: center;">
                <button id="save-config" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">Speichern</button>
            </div>
        </div>
        <div id="saved-tests-tab" style="display: none; margin-top: 20px;">
            <h4 style="text-align: center;">Gespeicherte Tests</h4>
            <div id="rules-container"></div>
        </div>
        
    `;

    document.body.appendChild(configDiv);
}

export function openFieldConfigurator(field: HTMLInputElement) {
    // Überprüfen, ob bereits ein Konfigurator geöffnet ist
    // if (configDiv.style.display === 'block') {
    //     console.log('Ein Konfigurator ist bereits geöffnet. Schließe den bestehenden Konfigurator.');
    //     configDiv.style.display = 'none';
    // }
    if (!initialized) {
        initialized = true;
    }
    initializeConfigDiv();

    // Aktualisiere die Felddaten im Konfigurator
    const submitButtonId = findSubmitButton();
    const configTitle = configDiv.querySelector('#config-title') as HTMLElement;
    configTitle.textContent = `Feld-Konfiguration für ${field.id || field.name}`;
    const submitButtonInput = configDiv.querySelector('#submit-button-id') as HTMLInputElement;
    submitButtonInput.value = submitButtonId;

    // Zeige den Konfigurator an
    configDiv.style.display = 'block';
    const buttonContainer = createButtonContainer();
    configDiv.appendChild(buttonContainer);

    // Weitere Logik für die Konfiguration
    const tabCreateTest = configDiv.querySelector('#tab-create-test') as HTMLElement;
    const tabSavedTests = configDiv.querySelector('#tab-saved-tests') as HTMLElement;
    const createTestTab = configDiv.querySelector('#create-test-tab') as HTMLElement;
    const savedTestsTab = configDiv.querySelector('#saved-tests-tab') as HTMLElement;
    const testTypeSelect = configDiv.querySelector('#field-type') as HTMLSelectElement;
    const numberStringConfig = configDiv.querySelector('#number-string-config') as HTMLElement;
    const validValuesConfig = configDiv.querySelector('#valid-values-config') as HTMLElement;
    const invalidValuesConfig = configDiv.querySelector('#invalid-values-config') as HTMLElement;
    const checkboxConfig = configDiv.querySelector('#checkbox-config') as HTMLElement;
    const validMessageConfig = configDiv.querySelector('#valid-message-config') as HTMLElement;
    const invalidMessageConfig = configDiv.querySelector('#invalid-message-config') as HTMLElement;

    tabCreateTest.addEventListener('click', () => {
        if (configDiv.contains(rulesContainer)) {
            configDiv.removeChild(rulesContainer);
        }
        createTestTab.style.display = 'block';
        savedTestsTab.style.display = 'none';
    });

    tabSavedTests.addEventListener('click', () => {
        if (configDiv.contains(rulesContainer)) {
            configDiv.removeChild(rulesContainer);
        }
        loadFieldRulesFromLocalStorage();
        rulesContainer = displayFieldRules(field);
        createTestTab.style.display = 'none';
        savedTestsTab.style.display = 'block';
        configDiv.insertBefore(rulesContainer, buttonContainer);
    });

    function createButtonContainer(): HTMLDivElement {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.textAlign = 'center';
        const generateTestsButton = document.createElement('button');
        generateTestsButton.id = 'generate-tests';
        generateTestsButton.style.padding = '10px 20px';
        generateTestsButton.style.backgroundColor = '#2196F3';
        generateTestsButton.style.color = 'white';
        generateTestsButton.style.border = 'none';
        generateTestsButton.style.borderRadius = '5px';
        generateTestsButton.style.cursor = 'pointer';
        generateTestsButton.innerText = 'Tests für dieses Feld generieren';

        const cancelButton = document.createElement('button');
        cancelButton.id = 'cancel-config';
        cancelButton.style.padding = '10px 20px';
        cancelButton.style.backgroundColor = '#f44336';
        cancelButton.style.color = 'white';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '5px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.innerText = 'Abbrechen';

        buttonContainer.appendChild(generateTestsButton);
        buttonContainer.appendChild(cancelButton);
        return buttonContainer;
    }

    testTypeSelect.addEventListener('change', () => {
        const selectedType = testTypeSelect.value;
        if (selectedType === 'number' || selectedType === 'string') {
            numberStringConfig.style.display = 'block';
            validValuesConfig.style.display = 'none';
            invalidValuesConfig.style.display = 'none';
            checkboxConfig.style.display = 'none';
            validMessageConfig.style.display = 'block';
            invalidMessageConfig.style.display = 'block';
        } else if (selectedType === 'validValues') {
            numberStringConfig.style.display = 'none';
            validValuesConfig.style.display = 'block';
            invalidValuesConfig.style.display = 'none';
            checkboxConfig.style.display = 'none';
            validMessageConfig.style.display = 'block';
            invalidMessageConfig.style.display = 'block';
        } else if (selectedType === 'invalidValues') {
            numberStringConfig.style.display = 'none';
            validValuesConfig.style.display = 'none';
            invalidValuesConfig.style.display = 'block';
            checkboxConfig.style.display = 'none';
            validMessageConfig.style.display = 'block';
            invalidMessageConfig.style.display = 'block';
        } else if (selectedType === 'checkbox') {
            numberStringConfig.style.display = 'none';
            validValuesConfig.style.display = 'none';
            invalidValuesConfig.style.display = 'none';
            checkboxConfig.style.display = 'flex';
            validMessageConfig.style.display = 'block';
            invalidMessageConfig.style.display = 'block';
        }
    });

    configDiv.querySelector('#required-checkbox')?.addEventListener('change', (event) => {
        const isChecked = (event.target as HTMLInputElement).checked;
        invalidMessageConfig.style.display = isChecked ? 'block' : 'none';
    });

    configDiv.querySelector('#save-config')?.addEventListener('click', () => {
        const fieldType = (configDiv.querySelector('#field-type') as HTMLSelectElement).value;
        const validValues = (configDiv.querySelector('#valid-values') as HTMLInputElement).value.split(',').map(v => v.trim()).filter(v => v);
        const invalidValues = (configDiv.querySelector('#invalid-values') as HTMLInputElement).value.split(',').map(v => v.trim()).filter(v => v);
        const validMessage = (configDiv.querySelector('#valid-message') as HTMLInputElement).value;
        const invalidMessage = (configDiv.querySelector('#invalid-message') as HTMLInputElement).value;
        const submitButtonId = (configDiv.querySelector('#submit-button-id') as HTMLInputElement).value;
        const required = (configDiv.querySelector('#required-checkbox') as HTMLInputElement).checked;

        let constraints: FieldConstraints | undefined;

        if (fieldType === 'number') {
            const min = parseFloat((configDiv.querySelector('#min-value') as HTMLInputElement).value.trim());
            const max = parseFloat((configDiv.querySelector('#max-value') as HTMLInputElement).value.trim());
            constraints = { type: 'number', min, max, validValues, invalidValues, validMessage, invalidMessage, submitButtonId };
        } else if (fieldType === 'string') {
            const minLength = parseFloat((configDiv.querySelector('#min-value') as HTMLInputElement).value.trim());
            const maxLength = parseFloat((configDiv.querySelector('#max-value') as HTMLInputElement).value.trim());
            constraints = { type: 'string', min: minLength, max: maxLength, validValues, invalidValues, validMessage, invalidMessage, submitButtonId };
        } else if (fieldType === 'validValues') {
            constraints = { type: 'validValues', validValues, validMessage, invalidMessage, submitButtonId };
        } else if (fieldType === 'invalidValues') {
            constraints = { type: 'invalidValues', invalidValues, validMessage, invalidMessage, submitButtonId };
        } else if (fieldType === 'checkbox') {
            constraints = { type: 'checkbox', required, validMessage, invalidMessage, submitButtonId };
        }

        if (constraints) {
            const fieldKey = field.id || field.name;
            if (!fieldKey) {
                console.error('Feld hat keine ID oder Name, Regel kann nicht gespeichert werden.');
                return;
            }

            let existingRules = fieldRules.get(field);
            if (!existingRules) {
                existingRules = [];
                fieldRules.set(field, existingRules);
            }
            console.log('fieldRules.get(field):', fieldRules.get(field));
            existingRules.push(constraints);
        }

        saveFieldRulesToLocalStorage();
    });

    configDiv.querySelector('#generate-tests')?.addEventListener('click', () => {
        generatePlaywrightTests(field);
    });

    configDiv.querySelector('#cancel-config')?.addEventListener('click', () => {
        if (configDiv.contains(rulesContainer)) {
            configDiv.removeChild(rulesContainer);
        }
        configDiv.style.display = 'none';
    });
}
