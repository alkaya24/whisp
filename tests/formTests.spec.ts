import { test, expect, chromium } from '@playwright/test';
import path from 'path';

test('Chrome Extension Test', async ({ page }) => {

    const pathToExtension = path.join(__dirname, '../dist');

    const userDataDir = '/tmp/test-user-data-dir';
    const browser = await chromium.launchPersistentContext(userDataDir, {
        headless: false,
        args: [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
        ],
    });

    await page.goto('https://example.com');

    // Teste, ob die Erweiterung korrekt funktioniert
    const title = await page.title();
    expect(title).toBe('Example Domain');

    await browser.close();
});
