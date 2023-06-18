module.exports = {
  root: false,
  env: {
    node: false,
    browser: false,
    es6: false,
  },
  plugins: ['prettier'],
  extends: ['plugin:vue/essential', 'plugin:vue/recommended', '@vue/prettier'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
