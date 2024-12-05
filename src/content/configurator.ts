import { generatePlaywrightTests } from "./playwrightGenerator";
import { fieldRules } from './fieldRulesStore';

export function openFieldConfigurator(field: HTMLInputElement) {
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
        <div style="display: flex; justify-content: space-around;">
            <button id="tab-min-max" style="padding: 10px; cursor: pointer;">Min/Max</button>
            <button id="tab-values" style="padding: 10px; cursor: pointer;">Valide/Invalid</button>
        </div>
        <div id="min-max-tab" style="margin-top: 20px;">
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
        </div>
        <div id="values-tab" style="display: none; margin-top: 20px;">
            <label>Valide Werte (durch Komma getrennt):</label>
            <input type="text" id="valid-values" style="width: 100%; padding: 8px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #ccc;"/><br/>
            <input type="text" id="valid-message" placeholder="Erfolgsnachricht" style="width: 100%; padding: 8px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #ccc; display: block;"/><br/>
            <label>Invalide Werte (durch Komma getrennt):</label>
            <input type="text" id="invalid-values" style="width: 100%; padding: 8px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #ccc;"/><br/>
            <input type="text" id="invalid-message" placeholder="Fehlermeldung" style="width: 100%; padding: 8px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #ccc; display: block;"/><br/>
        </div>
        <div style="text-align: center;">
            <button id="save-config" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">Speichern</button>
            <button id="generate-tests" style="padding: 10px 20px; background-color: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">Playwright-Test generieren</button>
            <button id="cancel-config" style="padding: 10px 20px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">Abbrechen</button>
        </div>
    `;

    document.body.appendChild(configDiv);

    const tabMinMax = configDiv.querySelector('#tab-min-max') as HTMLElement;
    const tabValues = configDiv.querySelector('#tab-values') as HTMLElement;
    const minMaxTab = configDiv.querySelector('#min-max-tab') as HTMLElement;
    const valuesTab = configDiv.querySelector('#values-tab') as HTMLElement;
    const validMessageToggle = configDiv.querySelector('#valid-message-toggle') as HTMLInputElement;
    const validMessageInput = configDiv.querySelector('#valid-message') as HTMLInputElement;
    const invalidMessageToggle = configDiv.querySelector('#invalid-message-toggle') as HTMLInputElement;
    const invalidMessageInput = configDiv.querySelector('#invalid-message') as HTMLInputElement;

    tabMinMax.addEventListener('click', () => {
        minMaxTab.style.display = 'block';
        valuesTab.style.display = 'none';
    });

    tabValues.addEventListener('click', () => {
        minMaxTab.style.display = 'none';
        valuesTab.style.display = 'block';
    });



    configDiv.querySelector('#save-config')?.addEventListener('click', () => {
        const fieldType = (configDiv.querySelector('#field-type') as HTMLSelectElement).value;
        const validValues = (configDiv.querySelector('#valid-values') as HTMLInputElement).value.split(',').map(v => v.trim()).filter(v => v);
        const invalidValues = (configDiv.querySelector('#invalid-values') as HTMLInputElement).value.split(',').map(v => v.trim()).filter(v => v);
        const validMessage = validMessageInput.value;
        const invalidMessage = invalidMessageInput.value;

        if (fieldType === 'number') {
            const min = parseFloat((configDiv.querySelector('#min-value') as HTMLInputElement).value);
            const max = parseFloat((configDiv.querySelector('#max-value') as HTMLInputElement).value);
            fieldRules.set(field, { type: 'number', min, max, validValues, invalidValues, validMessage, invalidMessage });
        } else if (fieldType === 'string') {
            const minLength = parseInt((configDiv.querySelector('#min-length') as HTMLInputElement).value, 10);
            const maxLength = parseInt((configDiv.querySelector('#max-length') as HTMLInputElement).value, 10);
            fieldRules.set(field, { type: 'string', min: minLength, max: maxLength, validValues, invalidValues, validMessage, invalidMessage });
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
