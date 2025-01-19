

# **whisp - Chrome-Extension für Eingabefeld-Validierung und Playwright-Tests**

## **Projektübersicht**

`whisp` ist eine Chrome-Extension, die Eingabefelder auf Webseiten erkennt und es ermöglicht, Validierungsregeln zu definieren. Auf Basis dieser Regeln generiert die Extension automatisch Playwright-Tests, um die Einhaltung der Regeln zu überprüfen.

---

## **Features**
- **Eingabefelder erkennen**: Identifiziert alle sichtbaren Eingabefelder auf der aktuellen Webseite.
- **Regeln definieren**: Benutzer können Grenzwerte für Zahlen oder Texte für jedes Feld festlegen.
- **Playwright-Tests generieren**: Automatisch generierter Testcode für Playwright, der überprüft, ob die Regeln eingehalten werden.
- **Extension aktivieren/deaktivieren**: Ein einfaches Popup, um die Extension zu steuern.
- **Kompatibilität**: Unterstützt Chrome-Browser und Chromium-basierte Browser.

---

## **Systemanforderungen**
- Node.js v16 oder höher
- npm oder yarn
- Chrome oder ein Chromium-basierter Browser
- Playwright installiert

---

## **Projektstruktur**
```
├── dist/                # Kompilierte Dateien der Extension
├── src/                 # Quellcode der Extension
│   ├── background.ts    # Hintergrundskript
│   ├── content.ts       # Content-Skript für die Logik auf Webseiten
│   ├── popup.ts         # Logik für das Popup-Fenster der Extension
│   ├── manifest.json    # Manifest-Datei für die Chrome-Extension
│   └── icons/           # Icons für die Extension
├── tests/               # Playwright-Tests
│   └── generatedTests.spec.ts  # Automatisch generierte Tests
├── webpack.config.js    # Konfigurationsdatei für Webpack
├── package.json         # Projektabhängigkeiten und Skripte
└── README.md            # Projektdokumentation
```

---

## **Installation**

### 1. **Repository klonen**
```bash
git clone https://github.com/<your-username>/whisp.git
cd whisp
```

### 2. **Abhängigkeiten installieren**
```bash
npm install
```

### 3. **Projekt kompilieren**
Kompiliere den TypeScript-Code und kopiere die benötigten Dateien in den `dist`-Ordner:
```bash
npx webpack --config webpack.config.js
```

---

## **Verwendung**

### 1. **Extension in Chrome laden**
1. Öffne Chrome und navigiere zu `chrome://extensions`.
2. Aktiviere den **Entwicklermodus** (oben rechts).
3. Klicke auf **Entpackte Erweiterung laden**.
4. Wähle den `dist`-Ordner deines Projekts aus.

### 2. **Extension testen**
- Lade eine Webseite, die Eingabefelder enthält.
- Rechtsklicke auf ein Eingabefeld, um Regeln festzulegen.
- Klicke auf **Playwright-Test generieren**, um den Testcode in der Test-Output-Box anzuzeigen.
- Kopiere den Code und füge ihn in die Datei `tests/generatedTests.spec.ts` ein.

### 3. **Playwright-Test ausführen**
```bash
npx playwright test tests/generatedTests.spec.ts
```

---

## **Entwicklung**

### **Skripte**
- **Kompilieren:**  
  ```bash
  npx webpack --config webpack.config.js
  ```
- **Playwright-Tests ausführen:**  
  ```bash
  npx playwright test
  ```

### **Häufige Probleme**
- **Extension wird nicht geladen:**  
  Sicher stellen, dass der `dist`-Ordner korrekt kompiliert wurde.
- **Playwright-Tests schlagen fehl:**  
  Prüfen, dass die Extension aktiv ist und die richtige Seite getestet wird.


### CI/CD Pipeline

Dieses Projekt verwendet GitHub Actions für die CI/CD-Pipeline. Die Pipeline ist so konfiguriert, dass sie automatisch bei jedem Push in das Repository ausgeführt wird.

### **Pipeline-Schritte**
1. **Code-Qualitätsprüfung**: Führt `npm run lint` aus, um sicherzustellen, dass der Code den Standards entspricht.
2. **Build-Prozess**: Baut das Projekt mit Webpack, um sicherzustellen, dass der Code fehlerfrei kompiliert.
3. **Tests**: Führt alle definierten Unit-Tests und Integrationstests mit `npm test` aus.

### **Trigger**
- **Automatisch**: Wird bei jedem Push in den Branch `main` oder bei Pull-Requests ausgeführt.
- **Manuell**: Kann über die GitHub Actions-Seite mit `workflow_dispatch` gestartet werden.

Die Logs und Ergebnisse jedes Pipeline-Runs können unter [GitHub Actions](https://github.com/dein-benutzername/dein-repo/actions) eingesehen werden.




## Statische Codeanalyse mit ESLint

In diesem Projekt wird **ESLint** verwendet, um die Codequalität sicherzustellen und potenzielle Fehler zu finden.

### Befehle

- **Codeanalyse ausführen**:
  ```bash
  npx eslint "src/**/*.{ts,js}" "tests/**/*.{ts,js}"
  ```

- **Automatische Korrektur (so weit wie möglich)**:
  ```bash
  npx eslint "src/**/*.{ts,js}" "tests/**/*.{ts,js}" --fix
  ```

### Anpassungen

- **Regeln anpassen**: Änderungen können in der Datei `eslint.config.js` vorgenommen werden. Beispiel:
  ```javascript
  rules: {
    "max-len": ["error", { "code": 200 }], // Maximale Zeilenlänge auf 200 erhöhen
    "no-console": "warn", // Konsolenausgaben als Warnung markieren
  }
  ```

- **ESLint Version aktualisieren**:
  ```bash
  npm install eslint@latest @typescript-eslint/parser@latest @typescript-eslint/eslint-plugin@latest --save-dev
  ```


