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
