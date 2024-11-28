import { fieldRules } from './fieldRulesStore';

export function validateField(field: HTMLInputElement) {
    const rules = fieldRules.get(field);
    if (!rules) return;

    let valid = true;

    if (rules.type === 'number') {
        const value = parseFloat(field.value);
        if (rules.min !== undefined && value < rules.min) valid = false;
        if (rules.max !== undefined && value > rules.max) valid = false;
    } else if (rules.type === 'string') {
        const value = field.value;
        if (rules.min !== undefined && value.length < rules.min) valid = false;
        if (rules.max !== undefined && value.length > rules.max) valid = false;
    }

    if (!valid) {
        field.style.borderColor = 'red';
    } else {
        field.style.borderColor = 'green';
    }
}
