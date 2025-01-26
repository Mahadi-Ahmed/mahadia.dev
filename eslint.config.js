import eslintPluginAstro from 'eslint-plugin-astro'
import reactPlugin from 'eslint-plugin-react'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx,astro}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      'semi': ['error', 'never'],
      'quotes': ['error', 'single']
    }
  },
  {
    files: ['**/*.tsx'],
    plugins: { react: reactPlugin },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off'
    }
  },
  ...eslintPluginAstro.configs.recommended
]
