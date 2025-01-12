export type FieldConstraints = {
    type: 'number' | 'string' | 'validValues' | 'invalidValues';
    min?: number;
    max?: number;
    required?: boolean;
    validValues?: string[];
    invalidValues?: string[];
    validMessage?: string;
    invalidMessage?: string;
    submitButtonId?: string;
};
