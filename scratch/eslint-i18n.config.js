/* eslint-disable no-unused-vars */
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import i18next from 'eslint-plugin-i18next';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      i18next
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      'i18next/no-literal-string': ['error', {
        markupOnly: true,
        ignoreAttribute: ['className', 'type', 'id', 'name', 'value', 'data-testid', 'stroke', 'fill', 'viewBox', 'd', 'href', 'to', 'target', 'rel', 'src', 'alt', 'width', 'height', 'style', 'role', 'aria-label', 'xmlns']
      }]
    },
  },
]);
