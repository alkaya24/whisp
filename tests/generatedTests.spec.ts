
import { test, expect } from '@playwright/test';

test('Validiere Feld unbekannt für Zahlen zwischen 10 und 100', async ({ page }) => {
    // Gehe zur aktuellen Seite
    await page.goto('file:///Users/ahmadanwar/Downloads/Zugangscode-formular/index.html');

    // Finde das Eingabefeld und teste es
    const field = await page.locator('input[name="passphrase"]');
    await field.fill('10');
    await expect(field).toHaveValue('10');
    await field.fill('100');
    await expect(field).toHaveValue('100');
    await field.fill('invalid');
    await expect(field).not.toHaveValue('invalid');
});

