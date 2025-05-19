import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
      sourceType: 'module',
      parser: typescriptEslintParser,
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
    },
    rules: {
      ...typescriptEslintPlugin.configs.recommended.rules,
      indent: ['error', 2, { SwitchCase: 1, offsetTernaryExpressions: true }],
      'linebreak-style': ['error', 'unix'],
      quotes: [2, 'single', { avoidEscape: true }],
      'object-curly-spacing': ['error', 'always'],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
];

/*
module.exports = {
  // env: {
  //   node: true,
  // },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  // overrides: [
  //   {
  //     files: ['.eslintrc.js'],
  //     parserOptions: {
  //       sourceType: 'script',
  //     },
  //   },
  // ],
  // parser: '@typescript-eslint/parser',
  // parserOptions: {
  //   ecmaVersion: 'latest',
  //   sourceType: 'module',
  // },
  // plugins: ['@typescript-eslint'],
  rules: {
    indent: ['error', 2, { SwitchCase: 1, offsetTernaryExpressions: true }],
    'linebreak-style': ['error', 'unix'],
    quotes: [2, 'single', { avoidEscape: true }],
    'object-curly-spacing': ['error', 'always'],
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
  },
};

 */
