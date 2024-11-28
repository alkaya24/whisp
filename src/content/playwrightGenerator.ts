import { fieldRules } from './fieldRulesStore';

export function generatePlaywrightTests(field: HTMLInputElement) {
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
