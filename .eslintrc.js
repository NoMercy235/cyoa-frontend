module.exports = {
  "parserOptions": {
    "ecmaVersion": 7,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
    },
  },
  "env": {
    "browser": true,
    "jest": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
  ],
  "rules": {
    // enable additional rules
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],

    // override default options for rules from base configurations
    "comma-dangle": ["error", "always-multiline"],
    "no-cond-assign": ["error", "always"],

    // disable rules from base configurations
    "no-console": "off",
  },
  "plugins": [
    "react",
  ],
};
