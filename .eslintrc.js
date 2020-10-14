module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: [
    'vue',
  ],
  rules: {
    'no-unused-vars': ['warn'],
    'no-param-reassign': ['warn'],
    'no-new': ['warn'],
    'no-undef': ['warn'],
    'no-underscore-dangle': ['off'],
    'class-methods-use-this': ['off'],
    'no-unused-expressions': ['warn'],
    'no-console': ['off'],
  },
};
