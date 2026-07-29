import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';

export default defineConfig(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.astro/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },

  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],

    extends: [js.configs.recommended, tseslint.configs.recommended, tseslint.configs.stylistic],
  },

  ...eslintPluginAstro.configs.recommended,

  {
    files: ['**/*.astro'],

    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
);
