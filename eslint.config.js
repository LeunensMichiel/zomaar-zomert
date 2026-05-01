// @ts-check

import eslint from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import { defineConfig } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: [
      'yarn.lock',
      '.env*',
      '.next/',
      '.husky/',
      '.DS_Store',
      '.vscode',
      'eslint.config.js',
      'lint-staged.config.js',
      'next.config.js',
      'next.sitemap.js',
      'next-env.d.ts',
      'postcss.config.mjs',
    ],
  },
  {
    extends: [
      eslint.configs.recommended,
      tseslint.configs.strictTypeChecked,
      reactHooks.configs.flat['recommended-latest'],
      eslintPluginPrettierRecommended,
    ],
    plugins: {
      '@next/next': nextPlugin,
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true, allowBoolean: true },
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
]);
