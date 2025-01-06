

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



