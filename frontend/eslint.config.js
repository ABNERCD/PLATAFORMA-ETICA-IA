import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  // Ignorar build
  { ignores: ['dist', 'node_modules'] },

  // Configuración global
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // React
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // Hooks
      ...reactHooks.configs.recommended.rules,

      // Refresh (Vite)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Variables no usadas
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^[A-Z]', // Solo mayúsculas (React components)
          argsIgnorePattern: '^_',
          // Permitir motion, useState, etc. en JSX
          caughtErrors: 'all',
        },
      ],

      // Evitar falsos positivos con motion
      'no-unused-vars': ['off'], // Desactivamos la regla base
    },
  },

  // Regla personalizada: permitir motion
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^(motion|[A-Z]|_)' // ← motion permitido
        }
      ]
    }
  }
];