import { test, expect } from '@playwright/test';

test('Gesamttest - ID: 3874', async ({ page }) => {

    await page.goto('file:///Users/alikaya/develop/repos/uni/whisp/fileexample/scratch.html');
    const field0 = await page.locator('input[id="text-field"]');
    const submitButton0 = await page.locator('button[id="submit-button"]');

    // Positive test
    await field0.fill('aaaaa');
    await page.fill('input[id="email-field"]', 'dummy1');
    await page.fill('input[id="password-field"]', 'formularflüsterer');
    await page.fill('input[id="number-field"]', '101');
    await page.check('input[id="checkbox-1"]');

    await submitButton0.click();
    await expect(page.locator('body')).toContainText('Formular erfolgreich gesendet');

    // Positive test
    await field0.fill('aaaaaaaaaa');
    await page.fill('input[id="email-field"]', 'dummy1');
    await page.fill('input[id="password-field"]', 'formularflüsterer');
    await page.fill('input[id="number-field"]', '101');
    await page.check('input[id="checkbox-1"]');

    await submitButton0.click();
    await expect(page.locator('body')).toContainText('Formular erfolgreich gesendet');

    // Positive test
    await field0.fill('aaaaaa');
    await page.fill('input[id="email-field"]', 'dummy1');
    await page.fill('input[id="password-field"]', 'formularflüsterer');
    await page.fill('input[id="number-field"]', '101');
    await page.check('input[id="checkbox-1"]');

    await submitButton0.click();
    await expect(page.locator('body')).toContainText('Formular erfolgreich gesendet');

    // Positive test
    await field0.fill('aaaaaaaaa');
    await page.fill('input[id="email-field"]', 'dummy1');
    await page.fill('input[id="password-field"]', 'formularflüsterer');
    await page.fill('input[id="number-field"]', '101');
    await page.check('input[id="checkbox-1"]');

    await submitButton0.click();
    await expect(page.locator('body')).toContainText('Formular erfolgreich gesendet');

    // Negative test
    await field0.fill('aaaa');
    await page.fill('input[id="email-field"]', 'dummy1');
    await page.fill('input[id="password-field"]', 'formularflüsterer');
    await page.fill('input[id="number-field"]', '101');
    await page.check('input[id="checkbox-1"]');

    await submitButton0.click();
    await expect(page.locator('body')).toContainText('Zeichenlänge muss zwischen 5-10 sein');

    // Negative test
    await field0.fill('aaaaaaaaaaa');
    await page.fill('input[id="email-field"]', 'dummy1');
    await page.fill('input[id="password-field"]', 'formularflüsterer');
    await page.fill('input[id="number-field"]', '101');
    await page.check('input[id="checkbox-1"]');

    await submitButton0.click();
    await expect(page.locator('body')).toContainText('Zeichenlänge muss zwischen 5-10 sein');

    await page.goto('file:///Users/alikaya/develop/repos/uni/whisp/fileexample/scratch.html');
    const field1 = await page.locator('input[id="email-field"]');
    const submitButton1 = await page.locator('button[id="submit-button"]');

    // Positive test
    await field1.fill('Boesermann@gmx.de');
    await page.fill('input[id="text-field"]', 'aaaaa');
    await page.fill('input[id="password-field"]', 'formularflüsterer');
    await page.fill('input[id="number-field"]', '101');
    await page.check('input[id="checkbox-1"]');

    await submitButton1.click();
    await expect(page.locator('body')).toContainText('Email nicht erlaubt');

    // Negative test
    await field1.fill('dummy1');
    await page.fill('input[id="text-field"]', 'aaaaa');
    await page.fill('input[id="password-field"]', 'formularflüsterer');
    await page.fill('input[id="number-field"]', '101');
    await page.check('input[id="checkbox-1"]');

    await submitButton1.click();
    await expect(page.locator('body')).toContainText('Formular erfolgreich gesendet');

    // Negative test
    await field1.fill('dummy2');
    await page.fill('input[id="text-field"]', 'aaaaa');
    await page.fill('input[id="password-field"]', 'formularflüsterer');
    await page.fill('input[id="number-field"]', '101');
    await page.check('input[id="checkbox-1"]');

    await submitButton1.click();
    await expect(page.locator('body')).toContainText('Formular erfolgreich gesendet');

    // Negative test
    await field1.fill('dummy3');
    await page.fill('input[id="text-field"]', 'aaaaa');
    await page.fill('input[id="password-field"]', 'formularflüsterer');
    await page.fill('input[id="number-field"]', '101');
    await page.check('input[id="checkbox-1"]');

    await submitButton1.click();
    await expect(page.locator('body')).toContainText('Formular erfolgreich gesendet');

    await page.goto('file:///Users/alikaya/develop/repos/uni/whisp/fileexample/scratch.html');
    const field2 = await page.locator('input[id="password-field"]');
    const submitButton2 = await page.locator('button[id="submit-button"]');

    // Positive test
    await field2.fill('formularflüsterer');
    await page.fill('input[id="text-field"]', 'aaaaa');
    await page.fill('input[id="email-field"]', 'dummy1');
    await page.fill('input[id="number-field"]', '101');
    await page.check('input[id="checkbox-1"]');

    await submitButton2.click();
    await expect(page.locator('body')).toContainText('Formular erfolgreich gesendet');

    // Negative test
    await field2.fill('dummy1');
    await page.fill('input[id="text-field"]', 'aaaaa');
    await page.fill('input[id="email-field"]', 'dummy1');
    await page.fill('input[id="number-field"]', '101');
    await page.check('input[id="checkbox-1"]');

    await submitButton2.click();
    await expect(page.locator('body')).toContainText('Falsches Passwort');

    // Negative test
    await field2.fill('dummy2');
    await page.fill('input[id="text-field"]', 'aaaaa');
    await page.fill('input[id="email-field"]', 'dummy1');
    await page.fill('input[id="number-field"]', '101');
    await page.check('input[id="checkbox-1"]');

    await submitButton2.click();
    await expect(page.locator('body')).toContainText('Falsches Passwort');

    // Negative test
    await field2.fill('dummy3');
    await page.fill('input[id="text-field"]', 'aaaaa');
    await page.fill('input[id="email-field"]', 'dummy1');
    await page.fill('input[id="number-field"]', '101');
    await page.check('input[id="checkbox-1"]');

    await submitButton2.click();
    await expect(page.locator('body')).toContainText('Falsches Passwort');

    await page.goto('file:///Users/alikaya/develop/repos/uni/whisp/fileexample/scratch.html');
    const field3 = await page.locator('input[id="number-field"]');
    const submitButton3 = await page.locator('button[id="submit-button"]');

    // Positive test
    await field3.fill('100');
    await page.fill('input[id="text-field"]', 'aaaaa');
    await page.fill('input[id="email-field"]', 'dummy1');
    await page.fill('input[id="password-field"]', 'formularflüsterer');
    await page.check('input[id="checkbox-1"]');

    await submitButton3.click();
    await expect(page.locator('body')).toContainText('Formular erfolgreich gesendet');

    // Positive test
    await field3.fill('130');
    await page.fill('input[id="text-field"]', 'aaaaa');
    await page.fill('input[id="email-field"]', 'dummy1');
    await page.fill('input[id="password-field"]', 'formularflüsterer');
    await page.check('input[id="checkbox-1"]');

    await submitButton3.click();
    await expect(page.locator('body')).toContainText('Formular erfolgreich gesendet');

    // Positive test
    await field3.fill('101');
    await page.fill('input[id="text-field"]', 'aaaaa');
    await page.fill('input[id="email-field"]', 'dummy1');
    await page.fill('input[id="password-field"]', 'formularflüsterer');
    await page.check('input[id="checkbox-1"]');

    await submitButton3.click();
    await expect(page.locator('body')).toContainText('Formular erfolgreich gesendet');

    // Positive test
    await field3.fill('129');
    await page.fill('input[id="text-field"]', 'aaaaa');
    await page.fill('input[id="email-field"]', 'dummy1');
    await page.fill('input[id="password-field"]', 'formularflüsterer');
    await page.check('input[id="checkbox-1"]');

    await submitButton3.click();
    await expect(page.locator('body')).toContainText('Formular erfolgreich gesendet');

    // Negative test
    await field3.fill('99');
    await page.fill('input[id="text-field"]', 'aaaaa');
    await page.fill('input[id="email-field"]', 'dummy1');
    await page.fill('input[id="password-field"]', 'formularflüsterer');
    await page.check('input[id="checkbox-1"]');

    await submitButton3.click();
    await expect(page.locator('body')).toContainText('Zahl muss zwischen 100 und 130 liegen');

    // Negative test
    await field3.fill('131');
    await page.fill('input[id="text-field"]', 'aaaaa');
    await page.fill('input[id="email-field"]', 'dummy1');
    await page.fill('input[id="password-field"]', 'formularflüsterer');
    await page.check('input[id="checkbox-1"]');

    await submitButton3.click();
    await expect(page.locator('body')).toContainText('Zahl muss zwischen 100 und 130 liegen');

    await page.goto('file:///Users/alikaya/develop/repos/uni/whisp/fileexample/scratch.html');
    const checkbox4 = await page.locator('input[id="checkbox-1"]');
    const submitButton4 = await page.locator('button[id="submit-button"]');

    await checkbox4.check();
    await page.fill('input[id="text-field"]', 'aaaaa');
    await page.fill('input[id="email-field"]', 'dummy1');
    await page.fill('input[id="password-field"]', 'formularflüsterer');
    await page.fill('input[id="number-field"]', '101');

    await submitButton4.click();
    await expect(page.locator('body')).toContainText('Formular erfolgreich gesendet');
    await checkbox4.uncheck();
    await page.fill('input[id="text-field"]', 'aaaaa');
    await page.fill('input[id="email-field"]', 'dummy1');
    await page.fill('input[id="password-field"]', 'formularflüsterer');
    await page.fill('input[id="number-field"]', '101');

    await submitButton4.click();
    await expect(page.locator('body')).toContainText('checkbox-1 muss aktiviert sein');
});
