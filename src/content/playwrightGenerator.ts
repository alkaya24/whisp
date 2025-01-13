import { fieldRules } from './fieldRulesStore';
import { FieldConstraints } from '../types/fieldTypes';

export function generatePlaywrightTests(field: HTMLInputElement) {
    const rules = fieldRules.get(field);
    if (!rules) return;

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

function generateNumberTests(fieldId: string, field: HTMLInputElement, rule: FieldConstraints) {
    let testCode = '';
    if (rule.min !== undefined && rule.max !== undefined) {
        testCode += `
test('Zahlenfeld ${fieldId}', async ({ page }) => {
    await page.goto('${window.location.href}');
    const field = await page.locator('input[id="${fieldId}"]');
    const submitButton = await page.locator('button[id="${rule.submitButtonId}"]');`
        // const submitButton = await page.locator('${rule.submitButtonId}'); // Optionales Feature, um den richtigen Selector zu finden

        testCode += `
        
    // Positive Tests
    await field.fill('${rule.min}');
    await submitButton.click();
    await expect(page.locator('body')).toContainText('${rule.validMessage}');

    await field.fill('${rule.max}');
    await submitButton.click();
    await expect(page.locator('body')).toContainText('${rule.validMessage}');

    await field.fill('${rule.min + 1}');
    await submitButton.click();
    await expect(page.locator('body')).toContainText('${rule.validMessage}');

    await field.fill('${rule.max - 1}');
    await submitButton.click();
    await expect(page.locator('body')).toContainText('${rule.validMessage}');

    // Negative Tests
    await field.fill('${rule.min - 1}');
    await submitButton.click();
    await expect(page.locator('body')).toContainText('${rule.invalidMessage}');

    await field.fill('${rule.max + 1}');
    await submitButton.click();
    await expect(page.locator('body')).toContainText('${rule.invalidMessage}');
});
`;
    }
    return testCode;
}

function generateStringTests(fieldId: string, field: HTMLInputElement, rule: FieldConstraints) {
    let testCode = '';
    if (rule.min !== undefined && rule.max !== undefined) {
        testCode += `
test('Textfeld ${fieldId}', async ({ page }) => {
    await page.goto('${window.location.href}');
    const field = await page.locator('input[id="${fieldId}"]');
    const submitButton = await page.locator('button[id="${rule.submitButtonId}"]');

    // Positive Tests
    await field.fill('a'.repeat(${rule.min}));
    await submitButton.click();
    await expect(page.locator('body')).toContainText('${rule.validMessage}');

    await field.fill('a'.repeat(${rule.max}));
    await submitButton.click();
    await expect(page.locator('body')).toContainText('${rule.validMessage}');

    await field.fill('a'.repeat(${rule.min + 1}));
    await submitButton.click();
    await expect(page.locator('body')).toContainText('${rule.validMessage}');

    await field.fill('a'.repeat(${rule.max - 1}));
    await submitButton.click();
    await expect(page.locator('body')).toContainText('${rule.validMessage}');

    // Negative Tests
    await field.fill('a'.repeat(${rule.min - 1}));
    await submitButton.click();
    await expect(page.locator('body')).toContainText('${rule.invalidMessage}');

    await field.fill('a'.repeat(${rule.max + 1}));
    await submitButton.click();
    await expect(page.locator('body')).toContainText('${rule.invalidMessage}');
});
`;
    }
    return testCode;
}

function generateValidValuesTests(fieldId: string, field: HTMLInputElement, rule: FieldConstraints) {
    let testCode = '';
    if (rule.validValues && rule.validValues.length > 0) {
        testCode += `
test('Gültige Werte ${fieldId}', async ({ page }) => {
    await page.goto('${window.location.href}');
    const field = await page.locator('input[id="${fieldId}"]');
    const submitButton = await page.locator('button[id="${rule.submitButtonId}"]');
`;
        // Positive Tests
        for (const value of rule.validValues) {
            testCode += `
    // Positive Tests
    await field.fill('${value}');
    await submitButton.click();
    await expect(page.locator('body')).toContainText('${rule.validMessage}');
`;
        }
        // Negative Tests mit Dummy-Werten
        const dummyValues = ['dummy1', 'dummy2', 'dummy3'];
        for (const value of dummyValues) {
            testCode += `
    // Negative Tests
    await field.fill('${value}');
    await submitButton.click();
    await expect(page.locator('body')).toContainText('${rule.invalidMessage}');
`;
        }
        testCode += `
});
`;
    }
    return testCode;
}

function generateInvalidValuesTests(fieldId: string, field: HTMLInputElement, rule: FieldConstraints) {
    let testCode = '';
    if (rule.invalidValues && rule.invalidValues.length > 0) {
        testCode += `
test('Ungültige Werte ${fieldId}', async ({ page }) => {
    await page.goto('${window.location.href}');
    const field = await page.locator('input[id="${fieldId}"]');
    const submitButton = await page.locator('button[id="${rule.submitButtonId}"]');
`;
        // Positive Tests
        for (const value of rule.invalidValues) {
            testCode += `
    // Positive Tests
    await field.fill('${value}');
    await submitButton.click();
    await expect(page.locator('body')).toContainText('${rule.validMessage}');
`;
        }
        // Negative Tests mit Dummy-Werten
        const dummyValues = ['dummy1', 'dummy2', 'dummy3'];
        for (const value of dummyValues) {
            testCode += `
    // Negative Tests
    await field.fill('${value}');
    await submitButton.click();
    await expect(page.locator('body')).toContainText('${rule.invalidMessage}');
`;
        }
        testCode += `
});
`;
    }
    return testCode;
}

function generateCheckboxTests(fieldId: string, field: HTMLInputElement, rule: FieldConstraints) {
    let testCode = '';
    testCode += `
test('Checkbox ${fieldId}', async ({ page }) => {
    await page.goto('${window.location.href}');
    const checkbox = await page.locator('input[id="${fieldId}"]');
    const submitButton = await page.locator('button[id="${rule.submitButtonId}"]');

    // Positiver Test
    await checkbox.check();
    await submitButton.click();
    await expect(page.locator('body')).toContainText('${rule.validMessage}');

    // Negativer Test
    await checkbox.uncheck();
    await submitButton.click();
    await expect(page.locator('body')).toContainText('${rule.required ? rule.invalidMessage : rule.validMessage}');
});
`;
    return testCode;
}