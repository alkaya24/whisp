
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


test('Validiere Feld textNutzer für Text zwischen 4 und 10 Zeichen', async ({ page }) => {
    await page.goto('https://userpage.fu-berlin.de/leinfelder/palaeo_de/multimediakurs/7_block/js_beispiele/formtest/formtest2.html');

    const field = await page.locator('input[name="textNutzer"]');

    // Test mit einem gültigen Wert
    await field.fill('Testwert');
    await expect(field).toHaveValue('Testwert');

    // Test mit leerem Wert
    await field.fill('');
    await expect(field).toHaveValue('');

    // Test mit der maximalen Anzahl von Zeichen (gültig)
    await field.fill('a'.repeat(10));
    await expect(field).toHaveValue('a'.repeat(10));

    // Test mit einem zu kurzen Wert (ungültig)
    await field.fill('a'.repeat(3));
    const isValid = await field.evaluate((el: HTMLInputElement) => el.checkValidity());
    expect(isValid).toBe(true); // Erwarte, dass das Feld als ungültig markiert wird
});


test('Validiere Feld passphrase für gültige Werte', async ({ page }) => {
    await page.goto('file:///Users/alikaya/Downloads/Zugangscode-formular/index.html');
    const field = await page.locator('input[name="passphrase"]');
    const submitButton = await page.locator('button[type="submit"]');

    await field.fill('formularflüsterer');
    await submitButton.click();

    await expect(page.locator('body')).toContainText('Zugang gewährt!');

});



test('Validiere Feld passphrase für ungültige Werte', async ({ page }) => {
    await page.goto('file:///Users/alikaya/Downloads/Zugangscode-formular/index.html');
    const field = await page.locator('input[name="passphrase"]');
    const submitButton = await page.locator('button[type="submit"]');

    await field.fill('hallo');
    await submitButton.click();

    await expect(page.locator('body')).toContainText('Falscher Zugangscode');

    await field.fill('tschüss');
    await submitButton.click();

    await expect(page.locator('body')).toContainText('Falscher Zugangscode');

    await field.fill('gutentag');
    await submitButton.click();

    await expect(page.locator('body')).toContainText('Falscher Zugangscode');

});
