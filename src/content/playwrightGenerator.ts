import { fieldRules } from './fieldRulesStore';

export function generatePlaywrightTests(field: HTMLInputElement) {
    const rules = fieldRules.get(field);
    if (!rules) return;

    const fieldId = field.name || field.id || 'unbenanntes Feld';
    let testCode = '';

    if ((rules.min !== undefined || rules.max !== undefined) && rules.type === 'number') {
        testCode += `
import { test, expect } from '@playwright/test';

test('Validiere Feld ${fieldId} für Zahlen innerhalb des zulässigen Bereichs', async ({ page }) => {
    await page.goto('${window.location.href}');
    
    const field = await page.locator('input[name="${field.name}"]');
`;

        if (rules.min !== undefined) {
            testCode += `
    // Teste Zahlen in der Nähe des Minimums
    const minNumber = ${rules.min};
    const minNumberAddOne = minNumber+1;
    const minNumberSubtractOne = minNumber-1
    
    await field.fill(minNumber.toString());
    await expect(field).toHaveValue(minNumber.toString());
    
    await field.fill(minNumberAddOne.toString());
    await expect(field).toHaveValue(minNumberAddOne.toString());
    
    await field.fill(minNumberSubtractOne.toString());
    await expect(field).toHaveValue(minNumberSubtractOne.toString());
`;
        }

        if (rules.max !== undefined) {
            testCode += `
    // Teste Zahlen in der Nähe des Maximums
    const nearMax = ${rules.max};
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

    if ((rules.min !== undefined || rules.max !== undefined) && rules.type === 'string') {
        testCode += `
import { test, expect } from '@playwright/test';

test('Validiere Feld ${fieldId} für Textlängen innerhalb des zulässigen Bereichs', async ({ page }) => {
    await page.goto('${window.location.href}');
    
    const field = await page.locator('input[name="${field.name}"]');
`;

        if (rules.min !== undefined) {
            testCode += `
    // Teste zufällige Texte in der Nähe der minimalen Länge
    const minLength = 'a'.repeat(${rules.min});
    const minLengthAddOne = 'a'.repeat(${rules.min} + 1);
    const minLengthSubtractOne = 'a'.repeat(${rules.min} - 1);
    
    await field.fill(minLength);
    await expect(field).toHaveValue(minLength);
    
    await field.fill(minLengthAddOne.toString());
    await expect(field).toHaveValue(minLengthAddOne.toString());
    
    await field.fill(minLengthSubtractOne.toString());
    await expect(field).toHaveValue(minLengthSubtractOne.toString());
`;
        }

        if (rules.max !== undefined) {
            testCode += `
    // Teste zufällige Texte in der Nähe der maximalen Länge
    const maxLength = 'a'.repeat(${rules.max});
    const maxLengthAddOne = 'a'.repeat(${rules.max} + 1);
    const maxLengthSubtractOne = 'a'.repeat(${rules.max} - 1);
    
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

    if (rules.validValues && rules.validValues.length > 0) {
        testCode += `
import { test, expect } from '@playwright/test';

test('Validiere Feld ${fieldId} für gültige Werte', async ({ page }) => {
    await page.goto('${window.location.href}');
    const field = await page.locator('input[name="${field.name}"]');
    const submitButton = await page.locator('button[type="submit"]');
`;
        for (const value of rules.validValues) {
            testCode += `
    await field.fill('${value}');
    await submitButton.click();
`;
            if (rules.validMessage) {
                testCode += `
    await expect(page.locator('body')).toContainText('${rules.validMessage}');
`;
            }
        }
        testCode += `
});
        `;
    }

    if (rules.invalidValues && rules.invalidValues.length > 0) {
        testCode += `
import { test, expect } from '@playwright/test';

test('Validiere Feld ${fieldId} für ungültige Werte', async ({ page }) => {
    await page.goto('${window.location.href}');
    const field = await page.locator('input[name="${field.name}"]');
    const submitButton = await page.locator('button[type="submit"]');
`;
        for (const value of rules.invalidValues) {
            testCode += `
    await field.fill('${value}');
    await submitButton.click();
`;
            if (rules.invalidMessage) {
                testCode += `
    await expect(page.locator('body')).toContainText('${rules.invalidMessage}');
`;
            }
        }
        testCode += `
});
        `;
    }


    const outputBox = document.getElementById('test-output');
    if (outputBox) {
        outputBox.textContent += testCode + '\n';
    }
}
