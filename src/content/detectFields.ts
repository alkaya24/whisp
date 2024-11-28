import { isVisible } from '../utils/domUtils';

export function findBasicInputFields(): HTMLInputElement[] {
    return Array.from(
        document.querySelectorAll("input:not([type='hidden']):not([type='checkbox']):not([type='radio']):not([type='button']):not([type='submit'])")
    ).filter((el): el is HTMLInputElement => el instanceof HTMLInputElement && isVisible(el));
}
