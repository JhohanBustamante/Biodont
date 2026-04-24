const js = require('@eslint/js');
const pluginN = require('eslint-plugin-n');

module.exports = [
  js.configs.recommended,
  {
    plugins: { n: pluginN },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      // Node.js
      'n/no-missing-require': 'error',
      'n/no-extraneous-require': 'error',
      'n/no-process-exit': 'warn',

      // Errores reales
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-console': ['warn', { allow: ['error', 'warn'] }],

      // Consistencia
      'eqeqeq': ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'warn',
    },
  },
  {
    ignores: ['node_modules/**', 'prisma/migrations/**'],
  },
];
