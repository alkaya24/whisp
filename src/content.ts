console.log("Hallo Martin");

const div = document.createElement('div');
div.style.position = 'fixed';
div.style.top = '10px';
div.style.left = '10px';
div.style.backgroundColor = 'lightblue';
div.style.padding = '10px';
div.style.zIndex = '1000';
div.textContent = 'Hallo Martin';
document.body.appendChild(div);

function countVisibleFormFieldTypes() {
    let fieldCounts = { input: 0, textarea: 0, select: 0, checkbox: 0, radio: 0 };

    function isVisible(element: HTMLElement): boolean {
        return element.offsetWidth > 0 && element.offsetHeight > 0;
    }

    fieldCounts.input += Array.from(document.querySelectorAll("input:not([type='hidden']):not([type='checkbox']):not([type='radio'])"))
        .filter((el) => isVisible(el as HTMLElement)).length;
    fieldCounts.textarea += Array.from(document.querySelectorAll("textarea"))
        .filter((el) => isVisible(el as HTMLElement)).length;
    fieldCounts.select += Array.from(document.querySelectorAll("select"))
        .filter((el) => isVisible(el as HTMLElement)).length;
    fieldCounts.checkbox += Array.from(document.querySelectorAll("input[type='checkbox']"))
        .filter((el) => isVisible(el as HTMLElement)).length;
    fieldCounts.radio += Array.from(document.querySelectorAll("input[type='radio']"))
        .filter((el) => isVisible(el as HTMLElement)).length;

    displayOverlay(`
        Sichtbare Eingabefelder: ${fieldCounts.input}
        Sichtbare Textbereiche: ${fieldCounts.textarea}
        Sichtbare Dropdowns: ${fieldCounts.select}
        Sichtbare Checkboxen: ${fieldCounts.checkbox}
        Sichtbare Radiobuttons: ${fieldCounts.radio}
    `);
}

function displayOverlay(message: string) {
    const overlay = document.createElement('div');
    overlay.innerText = message;
    overlay.style.position = 'fixed';
    overlay.style.bottom = '10px';
    overlay.style.right = '10px';
    overlay.style.padding = '10px';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.color = 'white';
    overlay.style.borderRadius = '5px';
    overlay.style.zIndex = '10000';
    overlay.style.fontSize = '14px';
    document.body.appendChild(overlay);
}

window.addEventListener('load', countVisibleFormFieldTypes);