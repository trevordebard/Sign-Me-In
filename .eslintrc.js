module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/jsx-filename-extension': 0, // Allows jsx to be used in .js files
    'import/extensions': 'off', // Allows you to import from files with out specifying extension
    'react/react-in-jsx-scope': 'off', // Removes warning if React is not imported at the top of every file
    'no-use-before-define': 'off', // Allows use of functions before they are defined
    'react/jsx-props-no-spreading': 'off', // Allows prop spreading
    'react/prop-types': 'off', // Do not require prop types (this should be re-evaluated later)
    'no-await-in-loop': 'off', // Allow await to be used inside loops
    'no-console': 'off',
  },
};
