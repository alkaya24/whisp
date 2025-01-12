import { fieldRules } from './fieldRulesStore';
import { FieldConstraints } from '../types/fieldTypes';

export function generatePlaywrightTests(field: HTMLInputElement) {
    const rules = fieldRules.get(field);
    if (!rules) return;

    const fieldId = field.name || field.id || 'unbenanntes Feld';
    let testCode = '';

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
        }
    });

    const outputBox = document.getElementById('test-output');
    if (outputBox) {
        outputBox.textContent += testCode + '\n';
    }
}

function generateNumberTests(fieldId: string, field: HTMLInputElement, rule: FieldConstraints) {
    let testCode = '';
    if (rule.min !== undefined || rule.max !== undefined) {
        testCode += `
import { test, expect } from '@playwright/test';

test('Validiere Feld ${fieldId} für Zahlen innerhalb des zulässigen Bereichs', async ({ page }) => {
    await page.goto('${window.location.href}');
    const field = await page.locator('input[name="${field.name}"]');
`;
        if (rule.min !== undefined) {
            testCode += `
    // Teste Zahlen in der Nähe des Minimums
    const minNumber = ${rule.min};
    const minNumberAddOne = minNumber+1;
    const minNumberSubtractOne = minNumber-1;
    await field.fill(minNumber.toString());
    await expect(field).toHaveValue(minNumber.toString());
    await field.fill(minNumberAddOne.toString());
    await expect(field).toHaveValue(minNumberAddOne.toString());
    await field.fill(minNumberSubtractOne.toString());
    await expect(field).toHaveValue(minNumberSubtractOne.toString());
`;
        }
        if (rule.max !== undefined) {
            testCode += `
    // Teste Zahlen in der Nähe des Maximums
    const nearMax = ${rule.max};
    const nearMaxAddOne = nearMax + 1;
    const nearMaxSubtractOne = nearMax - 1;
    await field.fill(nearMax.toString());
    await expect(field).toHaveValue(nearMax.toString());
    await field.fill(nearMaxAddOne.toString());
    await expect(field).toHaveValue(nearMaxAddOne.toString());
    await field.fill(nearMaxSubtractOne.toString());
    await expect(field).toHaveValue(nearMaxSubtractOne.toString());
`;
        }
        testCode += `
});
`;
    }
    return testCode;
}

function generateStringTests(fieldId: string, field: HTMLInputElement, rule: FieldConstraints) {
    let testCode = '';
    if (rule.min !== undefined || rule.max !== undefined) {
        testCode += `
import { test, expect } from '@playwright/test';

test('Validiere Feld ${fieldId} für Textlängen innerhalb des zulässigen Bereichs', async ({ page }) => {
    await page.goto('${window.location.href}');
    const field = await page.locator('input[name="${field.name}"]');
`;
        if (rule.min !== undefined) {
            testCode += `
    // Teste zufällige Texte in der Nähe der minimalen Länge
    const minLength = 'a'.repeat(${rule.min});
    const minLengthAddOne = 'a'.repeat(${rule.min} + 1);
    const minLengthSubtractOne = 'a'.repeat(${rule.min} - 1);
    await field.fill(minLength);
    await expect(field).toHaveValue(minLength);
    await field.fill(minLengthAddOne.toString());
    await expect(field).toHaveValue(minLengthAddOne.toString());
    await field.fill(minLengthSubtractOne.toString());
    await expect(field).toHaveValue(minLengthSubtractOne.toString());
`;
        }
        if (rule.max !== undefined) {
            testCode += `
    // Teste zufällige Texte in der Nähe der maximalen Länge
    const maxLength = 'a'.repeat(${rule.max});
    const maxLengthAddOne = 'a'.repeat(${rule.max} + 1);
    const maxLengthSubtractOne = 'a'.repeat(${rule.max} - 1);
    await field.fill(maxLength);
    await expect(field).toHaveValue(maxLength);
    await field.fill(maxLengthAddOne.toString());
    await expect(field).toHaveValue(maxLengthAddOne.toString());
    await field.fill(maxLengthSubtractOne.toString());
    await expect(field).toHaveValue(maxLengthSubtractOne.toString());
`;
        }
        testCode += `
});
`;
    }
    return testCode;
}

function generateValidValuesTests(fieldId: string, field: HTMLInputElement, rule: FieldConstraints) {
    let testCode = '';
    if (rule.validValues && rule.validValues.length > 0) {
        testCode += `
import { test, expect } from '@playwright/test';

test('Validiere Feld ${fieldId} für gültige Werte', async ({ page }) => {
    await page.goto('${window.location.href}');
    const field = await page.locator('input[name="${field.name}"]');
    const submitButton = await page.locator('button[type="submit"]');
`;
        for (const value of rule.validValues) {
            testCode += `
    await field.fill('${value}');
    await submitButton.click();
`;
            if (rule.validMessage) {
                testCode += `
    await expect(page.locator('body')).toContainText('${rule.validMessage}');
`;
            }
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
import { test, expect } from '@playwright/test';

test('Validiere Feld ${fieldId} für ungültige Werte', async ({ page }) => {
    await page.goto('${window.location.href}');
    const field = await page.locator('input[name="${field.name}"]');
    const submitButton = await page.locator('button[type="submit"]');
`;
        for (const value of rule.invalidValues) {
            testCode += `
    await field.fill('${value}');
    await submitButton.click();
`;
            if (rule.invalidMessage) {
                testCode += `
    await expect(page.locator('body')).toContainText('${rule.invalidMessage}');
`;
            }
        }
        testCode += `
});
`;
    }
    return testCode;
}
