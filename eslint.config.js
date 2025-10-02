// eslint.config.js (ESM module)
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_', // ignore variables starting with _
      }],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['warn', {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-use-before-define': ['error', {
        enums: false,
        typedefs: false,
        ignoreTypeReferences: true,
      }],
    },
  }
];
