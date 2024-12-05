export type FieldConstraints = {
    type: 'number' | 'string';
    min?: number;
    max?: number;
    required?: boolean;
    validValues?: string[];
    invalidValues?: string[];
    validMessage?: string;
    invalidMessage?: string;
};
