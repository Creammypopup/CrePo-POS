module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true }, // Added node: true for tailwind.config.js
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react/prop-types': 'off', // Disabled prop-types rule
    'no-unused-vars': 'warn', // Setting to warn instead of error to be less intrusive
    'react/react-in-jsx-scope': 'off', // Disable for new JSX transform
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  overrides: [
    {
      files: ['tailwind.config.js', 'postcss.config.js'],
      env: {
        node: true,
      },
    },
  ],
}