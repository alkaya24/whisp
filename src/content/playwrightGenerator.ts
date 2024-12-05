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
    // Teste zufällige Zahlen in der Nähe des Minimums
    const nearMin = ${rules.min} + 1;
    await field.fill(nearMin.toString());
    await expect(field).toHaveValue(nearMin.toString());
`;
        }

        if (rules.max !== undefined) {
            testCode += `
    // Teste zufällige Zahlen in der Nähe des Maximums
    const nearMax = ${rules.max} - 1;
    await field.fill(nearMax.toString());
    await expect(field).toHaveValue(nearMax.toString());
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
    const nearMinLength = 'a'.repeat(${rules.min} + 1);
    await field.fill(nearMinLength);
    await expect(field).toHaveValue(nearMinLength);
`;
        }

        if (rules.max !== undefined) {
            testCode += `
    // Teste zufällige Texte in der Nähe der maximalen Länge
    const nearMaxLength = 'a'.repeat(${rules.max} - 1);
    await field.fill(nearMaxLength);
    await expect(field).toHaveValue(nearMaxLength);
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
