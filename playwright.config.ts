import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    timeout: 60000,  // Timeout auf 60 Sekunden
    use: {
        headless: false  // Sichtbarer Modus
    }
};

export default config;
