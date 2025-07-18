module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended', // Add this line
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
