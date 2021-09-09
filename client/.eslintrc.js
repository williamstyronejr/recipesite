module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  plugins: [],
  extends: ['react-app', 'react-app/jest', 'airbnb', 'airbnb-typescript'],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  rules: {
    'import/no-anonymous-default-export': 0,
  },
};
