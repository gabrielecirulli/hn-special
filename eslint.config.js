const js = require("@eslint/js");
const globals = require("globals");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...globals.webextensions,
        _: "readonly",
        HNSpecial: "readonly",
      },
    },
    rules: {
      "no-console": 0,
      "no-unused-vars": ["warn", { vars: "all", args: "all" }],
      "no-undef": ["warn"],
      "no-proto": ["error"],
      "prefer-spread": ["warn"],
    },
  },
];
