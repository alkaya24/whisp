import { fieldRules } from './fieldRulesStore';

export function validateField(field: HTMLInputElement) {
    const rules = fieldRules.get(field);
    if (!rules) return;

    let valid = true;

    rules.forEach(rule => {
        if (rule.type === 'number') {
            const value = parseFloat(field.value);
            if (rule.min !== undefined && value < rule.min) valid = false;
            if (rule.max !== undefined && value > rule.max) valid = false;
        } else if (rule.type === 'string') {
            const value = field.value;
            if (rule.min !== undefined && value.length < rule.min) valid = false;
            if (rule.max !== undefined && value.length > rule.max) valid = false;
        }
    });

    if (!valid) {
        field.style.borderColor = 'red';
    } else {
        field.style.borderColor = 'green';
    }
}
