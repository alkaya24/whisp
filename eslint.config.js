import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import sonarjsPlugin from 'eslint-plugin-sonarjs';

export default [
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js'],
        languageOptions: {
            parser: parser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                project: ['./tsconfig.json'],
            },
        },
        plugins: {
            '@typescript-eslint': typescriptPlugin,
            sonarjs: sonarjsPlugin,
        },
        rules: {
            '@typescript-eslint/init-declarations': 'off',
            '@typescript-eslint/explicit-member-accessibility': 'error',
            '@typescript-eslint/explicit-function-return-type': 'warn',
            '@typescript-eslint/no-shadow': ['error'],
            'quotes': ['error', 'single'], // Verwende die Basisregel quotes
            'semi': ['error'], // Verwende die Basisregel semi
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/ban-ts-comment': [
                'error',
                {
                    'ts-expect-error': 'allow-with-description',
                },
            ],
            '@typescript-eslint/switch-exhaustiveness-check': 'error',
            '@typescript-eslint/no-floating-promises': 'off',
            'arrow-parens': ['error', 'as-needed'],
            'arrow-body-style': ['error', 'as-needed'],
            'no-empty': ['error', { allowEmptyCatch: true }],
            'padding-line-between-statements': [
                'error',
                { blankLine: 'always', prev: '*', next: 'return' },
            ],
            'brace-style': ['error', '1tbs', { allowSingleLine: true }],
            'prefer-template': ['error'],
            'max-len': ['error', { code: 257, ignoreComments: true }],
            'no-console': 'warn',
            'comma-dangle': [
                'error',
                {
                    arrays: 'always-multiline',
                    objects: 'always-multiline',
                    imports: 'always-multiline',
                    exports: 'always-multiline',
                    functions: 'always-multiline',
                },
            ],
            'object-shorthand': ['error', 'always'],
            eqeqeq: ['error', 'always'],
            'no-multiple-empty-lines': ['error', { max: 1 }],
            complexity: ['error', { max: 15 }],
            'max-depth': ['error', 4],
            'max-nested-callbacks': ['error', 3],
            'max-params': ['error', 10],
            yoda: 'error',
            'no-param-reassign': 'error',
            'no-const-assign': 'error',
            'no-trailing-spaces': 'error',
            'no-unneeded-ternary': 'error',
            'multiline-ternary': ['error', 'always-multiline'],
            'operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before' } }],
        },
    },
];
