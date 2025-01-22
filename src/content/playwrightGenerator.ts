import { fieldRules } from './fieldRulesStore';
import { FieldConstraints } from '../types/fieldTypes';

let globalIndex = 0;

// Generiert Playwright-Tests basierend auf den Regeln für ein bestimmtes Eingabefeld
export function generatePlaywrightTests(field: HTMLInputElement) {
    const rules = fieldRules.get(field);
    if (!rules || rules.length === 0) return;

    const fieldId = field.id || field.name || 'unbenanntes Feld';
    let testCode = 'import { test, expect } from \'@playwright/test\';\n\n';

    // Iteriere über alle Regeln und generiere entsprechende Tests
    rules.forEach(rule => {
        const additionalFill = generateAdditionalFill(field);
        switch (rule.type) {
            case 'number':
                testCode += generateNumberTests(fieldId, field, rule, additionalFill, false);
                break;
            case 'string':
                testCode += generateStringTests(fieldId, field, rule, additionalFill, false);
                break;
            case 'validValues':
                testCode += generateValidValuesTests(fieldId, field, rule, additionalFill, false);
                break;
            case 'invalidValues':
                testCode += generateInvalidValuesTests(fieldId, field, rule, additionalFill, false);
                break;
            case 'checkbox':
                testCode += generateCheckboxTests(fieldId, field, rule, additionalFill, false);
                break;
        }
    });

    // Füge den generierten Testcode in die Test-Output-Box ein
    const outputBox = document.getElementById('test-output');
    if (outputBox) {
        outputBox.textContent += `${testCode}\n`;
    }
}

// Generiert eine zufällige 4-stellige Test-ID
function generateTestId() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Generiert den Testcode für ein bestimmtes Feld basierend auf den übergebenen Parametern
function generateTestCode(fieldId: string, field: HTMLInputElement, rule: FieldConstraints, testType: string, values: number[] | string[], invalidValues: number[] | string[], additionalFill: string, comprehensive: boolean) {
    let testCode = '';
    if (!comprehensive) {
        testCode += `\ntest('${fieldId} ${testType} - ID: ${generateTestId()}', async ({ page }) => {\n`;
    }

    testCode += `\n    await page.goto('${window.location.href}');\n    const field${globalIndex} = await page.locator('input[id="${fieldId}"]');\n    const submitButton${globalIndex} = await page.locator('button[id="${rule.submitButtonId}"]');\n`;

    // Positive Tests
    values.forEach(value => {
        testCode += `\n    // Positiver Test\n    await field${globalIndex}.fill('${value}');\n${additionalFill || ''}\n    await submitButton${globalIndex}.click();\n    await expect(page.locator('body')).toContainText('${rule.validMessage}');\n`;
    });

    // Negative Tests
    invalidValues.forEach(invalidValue => {
        testCode += `\n    // Negativer Test\n    await field${globalIndex}.fill('${invalidValue}');\n${additionalFill || ''}\n    await submitButton${globalIndex}.click();\n    await expect(page.locator('body')).toContainText('${rule.invalidMessage}');\n`;
    });

    if (!comprehensive) {
        testCode += '\n});\n';
    }
    globalIndex++;

    return testCode;
}

// Generiert Tests für Zahlenfelder
function generateNumberTests(fieldId: string, field: HTMLInputElement, rule: FieldConstraints, additionalFill: string, comprehensive: boolean) {
    if (!field || !rule.min || !rule.max) {
        console.error('Fehler: Ungültiges Feld oder Regel für Zahlenfeld.');

        return '';
    }
    if (rule.min !== undefined && rule.max !== undefined) {
        return generateTestCode(fieldId, field, rule, 'Zahlenfeld', [rule.min, rule.max, rule.min + 1, rule.max - 1], [rule.min - 1, rule.max + 1], additionalFill, comprehensive);
    }

    return '';
}

// Generiert Tests für Textfelder
function generateStringTests(fieldId: string, field: HTMLInputElement, rule: FieldConstraints, additionalFill: string, comprehensive: boolean) {
    if (!field || !rule.min || !rule.max) {
        console.error('Fehler: Ungültiges Feld oder Regel für Textfeld.');

        return '';
    }
    if (rule.min !== undefined && rule.max !== undefined) {
        return generateTestCode(fieldId, field, rule, 'Textfeld', ['a'.repeat(rule.min), 'a'.repeat(rule.max), 'a'.repeat(rule.min + 1), 'a'.repeat(rule.max - 1)], ['a'.repeat(rule.min - 1), 'a'.repeat(rule.max + 1)], additionalFill, comprehensive);
    }

    return '';
}

// Generiert Tests für gültige Werte
function generateValidValuesTests(fieldId: string, field: HTMLInputElement, rule: FieldConstraints, additionalFill: string, comprehensive: boolean) {
    if (!field || !rule.validValues) {
        console.error('Fehler: Ungültiges Feld oder Regel für gültige Werte.');

        return '';
    }
    if (rule.validValues.length > 0) {
        const dummyValues = ['dummy1', 'dummy2', 'dummy3'];

        return generateTestCode(fieldId, field, rule, 'Gültige Werte', rule.validValues, dummyValues, additionalFill, comprehensive);
    }

    return '';
}

// Generiert Tests für ungültige Werte
function generateInvalidValuesTests(fieldId: string, field: HTMLInputElement, rule: FieldConstraints, additionalFill: string, comprehensive: boolean) {
    if (!field || !rule.invalidValues) {
        console.error('Fehler: Ungültiges Feld oder Regel für ungültige Werte.');

        return '';
    }
    if (rule.invalidValues.length > 0) {
        const dummyValues = ['dummy1', 'dummy2', 'dummy3'];

        return generateTestCode(fieldId, field, rule, 'Ungültige Werte', rule.invalidValues, dummyValues, additionalFill, comprehensive);
    }

    return '';
}

// Generiert Tests für Checkboxen
function generateCheckboxTests(fieldId: string, field: HTMLInputElement, rule: FieldConstraints, additionalFill: string, comprehensive: boolean) {
    if (!field || rule.required === undefined) {
        console.error('Fehler: Ungültiges Feld oder fehlende Regel für Checkbox.');

        return '';
    }
    let testCode = '';
    if (!comprehensive) {
        testCode += `\ntest('Checkbox ${fieldId}', async ({ page }) => {\n`;
    }

    testCode += `\n    await page.goto('${window.location.href}');\n    const checkbox${globalIndex} = await page.locator('input[id="${fieldId}"]');\n    const submitButton${globalIndex} = await page.locator('button[id="${rule.submitButtonId}"]');\n`;

    // Positiver Test
    testCode += `\n    // Positiver Test\n    await checkbox${globalIndex}.check();\n${additionalFill || ''}`;
    testCode += `\n    await submitButton${globalIndex}.click();\n    await expect(page.locator('body')).toContainText('${rule.validMessage}');`;

    // Negativer Test
    testCode += `\n    // Negativer Test\n    await checkbox${globalIndex}.uncheck();\n${additionalFill || ''}`;
    testCode += `\n    await submitButton${globalIndex}.click();\n    await expect(page.locator('body')).toContainText('${rule.required ? rule.invalidMessage : rule.validMessage}');`;

    if (!comprehensive) {
        testCode += '\n});\n';
    }
    globalIndex++;

    return testCode;
}

// Generiert einen gültigen Wert basierend auf der Regel
function generateValidValue(rule: FieldConstraints): string {
    switch (rule.type) {
        case 'number':
            if (rule.min !== undefined) return (rule.min + 1).toString();

            return '1';
        case 'string':
            if (rule.min !== undefined) return 'a'.repeat(rule.min);

            return 'valid';
        case 'validValues':
            if (rule.validValues && rule.validValues.length > 0) return rule.validValues[0];

            return 'valid';
        case 'invalidValues':
            if (rule.invalidValues && rule.invalidValues.length > 0) return 'dummy1';
        case 'checkbox':
            return 'true';
        default:
            return 'valid';
    }
}

// Generiert zusätzliche Füllwerte für andere Felder
function generateAdditionalFill(currentField: HTMLInputElement): string {
    let additionalFill = '';
    fieldRules.forEach((rules, field) => {
        if (field !== currentField) {
            if (rules[0].type === 'checkbox') {
                additionalFill += `    await page.check('input[id="${field.id}"]');\n`;
            } else {
                const validValue = generateValidValue(rules[0]); // Nimm die erste Regel an
                additionalFill += `    await page.fill('input[id="${field.id}"]', '${validValue}');\n`;
            }
        }
    });

    return additionalFill;
}

// Generiert einen umfassenden Test für alle Felder
export function generateComprehensiveTest() {
    let testCode = 'import { test, expect } from \'@playwright/test\';\n\n';
    testCode += `
    test('Gesamttest - ID: ${generateTestId()}', async ({ page }) => {
`;
    if (fieldRules.size === 0) return;

    fieldRules.forEach((rules, field) => {
        const fieldId = field.id || field.name || 'unbenanntes Feld';

        rules.forEach(rule => {
            const additionalFill = generateAdditionalFill(field);
            switch (rule.type) {
                case 'number':
                    testCode += generateNumberTests(fieldId, field, rule, additionalFill, true);
                    break;
                case 'string':
                    testCode += generateStringTests(fieldId, field, rule, additionalFill, true);
                    break;
                case 'validValues':
                    testCode += generateValidValuesTests(fieldId, field, rule, additionalFill, true);
                    break;
                case 'invalidValues':
                    testCode += generateInvalidValuesTests(fieldId, field, rule, additionalFill, true);
                    break;
                case 'checkbox':
                    testCode += generateCheckboxTests(fieldId, field, rule, additionalFill, true);
                    break;
            }
        });
    });

    testCode += `
});
`;

    const outputBox = document.getElementById('test-output');
    if (outputBox) {
        outputBox.textContent += `${testCode}\n`;
    }
}

// Listener für Nachrichten von der Chrome-Erweiterung
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'generateTests') {
        let testCode = generateComprehensiveTest();
        sendResponse({ testCode });
    }
});