const js       = require( "@eslint/js" );
const globals  = require( "globals" );

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser
      },
      parserOptions: {
        ecmaVersion:  2023,
        sourceType:   "module"
      },
    },
    plugins: { },
    rules: { },
    ignores: [
      "/node_modules/*",
      "/src/test/*"
    ]
  }
];