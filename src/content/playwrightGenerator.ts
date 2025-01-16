import { fieldRules } from './fieldRulesStore';
import { FieldConstraints } from '../types/fieldTypes';

let globalIndex = 0;

export function generatePlaywrightTests(field: HTMLInputElement) {
    const rules = fieldRules.get(field);
    if (!rules || rules.length === 0) return;

    const fieldId = field.id || field.name || 'unbenanntes Feld';
    let testCode = `import { test, expect } from '@playwright/test';\n\n`;

    rules.forEach(rule => {
        switch (rule.type) {
            case 'number':
                testCode += generateNumberTests(fieldId, field, rule);
                break;
            case 'string':
                testCode += generateStringTests(fieldId, field, rule);
                break;
            case 'validValues':
                testCode += generateValidValuesTests(fieldId, field, rule);
                break;
            case 'invalidValues':
                testCode += generateInvalidValuesTests(fieldId, field, rule);
                break;
            case 'checkbox':
                testCode += generateCheckboxTests(fieldId, field, rule);
                break;
        }
    });

    const outputBox = document.getElementById('test-output');
    if (outputBox) {
        outputBox.textContent += testCode + '\n';
    }
}

function generateTestCode(fieldId: string, field: HTMLInputElement, rule: FieldConstraints, testType: string, values: number[] | string[], invalidValues: number[] | string[], additionalFill?: string) {
    let testCode = '';
    if (!additionalFill) {
        testCode += `\ntest('${testType} ${fieldId}', async ({ page }) => {\n`;
    }

    testCode += `\n    await page.goto('${window.location.href}');\n    const field${globalIndex} = await page.locator('input[id="${fieldId}"]');\n    const submitButton${globalIndex} = await page.locator('button[id="${rule.submitButtonId}"]');\n`;

    // Positive Tests
    values.forEach(value => {
        testCode += `\n    await field${globalIndex}.fill('${value}');\n${additionalFill || ''}\n    await submitButton${globalIndex}.click();\n    await expect(page.locator('body')).toContainText('${rule.validMessage}');\n`;
    });

    // Negative Tests
    invalidValues.forEach(invalidValue => {
        testCode += `\n    await field${globalIndex}.fill('${invalidValue}');\n${additionalFill || ''}\n    await submitButton${globalIndex}.click();\n    await expect(page.locator('body')).toContainText('${rule.invalidMessage}');\n`;
    });

    if (!additionalFill) {
        testCode += `\n});\n`;
    }
    globalIndex++;
    return testCode;
}

function generateNumberTests(fieldId: string, field: HTMLInputElement, rule: FieldConstraints, additionalFill?: string) {
    if (rule.min !== undefined && rule.max !== undefined) {
        return generateTestCode(fieldId, field, rule, 'Zahlenfeld', [rule.min, rule.max, rule.min + 1, rule.max - 1], [rule.min - 1, rule.max + 1], additionalFill);
    }
    return '';
}

function generateStringTests(fieldId: string, field: HTMLInputElement, rule: FieldConstraints, additionalFill?: string) {
    if (rule.min !== undefined && rule.max !== undefined) {
        return generateTestCode(fieldId, field, rule, 'Textfeld', ['a'.repeat(rule.min), 'a'.repeat(rule.max), 'a'.repeat(rule.min + 1), 'a'.repeat(rule.max - 1)], ['a'.repeat(rule.min - 1), 'a'.repeat(rule.max + 1)], additionalFill);
    }
    return '';
}

function generateValidValuesTests(fieldId: string, field: HTMLInputElement, rule: FieldConstraints, additionalFill?: string) {
    if (rule.validValues && rule.validValues.length > 0) {
        const dummyValues = ['dummy1', 'dummy2', 'dummy3'];
        return generateTestCode(fieldId, field, rule, 'Gültige Werte', rule.validValues, dummyValues, additionalFill);
    }
    return '';
}

function generateInvalidValuesTests(fieldId: string, field: HTMLInputElement, rule: FieldConstraints, additionalFill?: string) {
    if (rule.invalidValues && rule.invalidValues.length > 0) {
        const dummyValues = ['dummy1', 'dummy2', 'dummy3'];
        return generateTestCode(fieldId, field, rule, 'Ungültige Werte', rule.invalidValues, dummyValues, additionalFill);
    }
    return '';
}

function generateCheckboxTests(fieldId: string, field: HTMLInputElement, rule: FieldConstraints, additionalFill?: string) {
    let testCode = '';
    if (!additionalFill) {
        testCode += `
test('Checkbox ${fieldId}', async ({ page }) => {
`
    }

    testCode += `
    await page.goto('${window.location.href}');
    const checkbox${globalIndex} = await page.locator('input[id="${fieldId}"]');
    const submitButton${globalIndex} = await page.locator('button[id="${rule.submitButtonId}"]');

    // Positiver Test
    await checkbox${globalIndex}.check();
${additionalFill || ''}
    await submitButton${globalIndex}.click();
    await expect(page.locator('body')).toContainText('${rule.validMessage}');

    // Negativer Test
    await checkbox${globalIndex}.uncheck();
${additionalFill || ''}
    await submitButton${globalIndex}.click();
    await expect(page.locator('body')).toContainText('${rule.required ? rule.invalidMessage : rule.validMessage}');
`;
    if (!additionalFill) {
        testCode += `
});
`;
    }
    globalIndex++;
    return testCode;
}

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
            if (rule.invalidValues && rule.invalidValues.length > 0) return "dummy1";
        case 'checkbox':
            return 'true';
        default:
            return 'valid';
    }
}

export function generateComprehensiveTest() {
    let testCode = `import { test, expect } from '@playwright/test';\n\n`;
    testCode += `
    test('Gesamttest', async ({ page }) => {
`;
    if (fieldRules.size === 0) return;

    fieldRules.forEach((rules, field) => {
        const fieldId = field.id || field.name || 'unbenanntes Feld';

        rules.forEach(rule => {
            // Fülle alle anderen Felder mit validen Werten
            let additionalFill = '';
            fieldRules.forEach((otherRules, otherField) => {
                if (otherField !== field) {
                    if (otherRules[0].type === 'checkbox') {
                        additionalFill += `    await page.check('input[id="${otherField.id}"]');\n`;
                    } else {
                        const validValue = generateValidValue(otherRules[0]); // Nimm die erste Regel an
                        additionalFill += `    await page.fill('input[id="${otherField.id}"]', '${validValue}');\n`;
                    }
                }
            });

            // Generiere Tests für das aktuelle Feld
            switch (rule.type) {
                case 'number':
                    testCode += generateNumberTests(fieldId, field, rule, additionalFill);
                    break;
                case 'string':
                    testCode += generateStringTests(fieldId, field, rule, additionalFill);
                    break;
                case 'validValues':
                    testCode += generateValidValuesTests(fieldId, field, rule, additionalFill);
                    break;
                case 'invalidValues':
                    testCode += generateInvalidValuesTests(fieldId, field, rule, additionalFill);
                    break;
                case 'checkbox':
                    testCode += generateCheckboxTests(fieldId, field, rule, additionalFill);
                    break;
            }
        });
    });

    testCode += `
});
`;

    const outputBox = document.getElementById('test-output');
    if (outputBox) {
        outputBox.textContent += testCode + '\n';
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'generateTests') {
        let testCode = generateComprehensiveTest();
        sendResponse({ testCode });
    }
});