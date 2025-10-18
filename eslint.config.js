// eslint.config.js
import tsParser from '@typescript-eslint/parser';
import eslintPlugin from '@typescript-eslint/eslint-plugin';
import playwright from 'eslint-plugin-playwright';

export default [
    {
        // Global configuration for all files
        ignores: ['node_modules', 'playwright-report', 'test-results', 'eslint.config.js'],
    },
    {
        files: ['**/*.ts', '**/*.js'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                // 💡 This is the crucial line for path resolution
                project: './tsconfig.json',
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': eslintPlugin,
        },
        rules: {
            // Standard ESLint Rules
            'no-unused-vars': 'error',
            'no-console': 'off',
            'indent': ['error', 2],
            'no-extra-semi': 'error',
            'semi': ['error', 'always'],

            // TypeScript ESLint Rules
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
    {
        // Specific configuration for Playwright test files
        files: ['tests/**/*.spec.ts'],
        plugins: {
            playwright: playwright,
        },
        rules: {
            // Playwright Rules
            'playwright/prefer-to-have-length': 'error',
            'playwright/no-wait-for-timeout': 'warn',
        },
    }
];