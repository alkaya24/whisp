import { isVisible } from '../utils/domUtils';

// Findet alle grundlegenden Eingabefelder, die sichtbar sind und keine bestimmten Typen haben
export function findBasicInputFields(): HTMLInputElement[] {
    return Array.from(
        document.querySelectorAll('input:not([type=\'hidden\']):not([type=\'radio\']):not([type=\'button\']):not([type=\'submit\'])'),
    ).filter((el): el is HTMLInputElement => el instanceof HTMLInputElement && isVisible(el));
}

// Findet alle sichtbaren Checkboxen auf der Seite
export function findCheckboxes(): HTMLInputElement[] {
    return Array.from(
        document.querySelectorAll('input[type=\'checkbox\']'),
    ).filter((el): el is HTMLInputElement => el instanceof HTMLInputElement && isVisible(el));
}

// Fügt Labels zu den Checkboxen hinzu und zählt sie
export function labelAndCountCheckboxes(checkboxes: HTMLInputElement[]) {
    const fragment = document.createDocumentFragment();
    checkboxes.forEach((checkbox, index) => {
        // Markiere Checkboxen mit einem Rahmen
        checkbox.style.border = '2px solid orange';
        // Erstelle ein Label für die Checkbox
        const label = document.createElement('span');
        label.innerText = `Checkbox ${index + 1}`;
        label.classList.add('content-ui-element');
        label.style.position = 'absolute';
        label.style.backgroundColor = 'yellow';
        label.style.color = 'black';
        label.style.fontSize = '12px';
        label.style.padding = '2px';
        label.style.border = '1px solid black';
        label.style.borderRadius = '3px';
        label.style.zIndex = '1000';
        label.style.display = 'none';

        // Positioniere das Label in der Nähe der Checkbox
        const rect = checkbox.getBoundingClientRect();
        label.style.top = `${window.scrollY + rect.top - 20}px`;
        label.style.left = `${window.scrollX + rect.left}px`;

        fragment.appendChild(label);
    });

    document.body.appendChild(fragment);

    // Aktualisiere das Overlay für die Checkbox-Zählung
    updateCheckboxCountOverlay(checkboxes.length);
}

// Aktualisiert das Overlay, das die Anzahl der erkannten Checkboxen anzeigt
function updateCheckboxCountOverlay(count: number) {
    let overlay = document.getElementById('checkbox-count-overlay') as HTMLElement;

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'checkbox-count-overlay';
        overlay.classList.add('content-ui-element');
        overlay.style.position = 'fixed';
        overlay.style.bottom = '70px';
        overlay.style.right = '10px';
        overlay.style.backgroundColor = 'rgba(255, 165, 0, 0.8)';
        overlay.style.color = 'white';
        overlay.style.padding = '10px';
        overlay.style.borderRadius = '5px';
        overlay.style.zIndex = '10000';
        overlay.style.fontSize = '14px';
        overlay.style.display = 'none';
        document.body.appendChild(overlay);
    }

    overlay.innerText = `Erkannte Checkboxen: ${count}`;
}