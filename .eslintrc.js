module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'no-use-before-define': 0,
    'no-underscore-dangle': 0,
    'class-methods-use-this': 0,
    'no-unused-vars': 1,
  },
};
