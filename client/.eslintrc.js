module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  plugins: [],
  extends: [
    'react-app',
    'react-app/jest',
    'airbnb',
    'airbnb-typescript',
    'prettier',
  ],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  rules: {
    'import/no-anonymous-default-export': 0,
    'consistent-return': 0,
    'prefer-object-spread': 0,
    'import/prefer-default-export': 0,
  },
};
