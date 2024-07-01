const js       = require( "@eslint/js" );
const globals  = require( "globals" );

const BROWSER_FIX = Object.assign({ }, globals.browser, {
  AudioWorkletGlobalScope: globals.browser[ 'AudioWorkletGlobalScope ' ]
});

delete BROWSER_FIX[ 'AudioWorkletGlobalScope ' ];

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.es6,
        ...globals.node,
        ...BROWSER_FIX
      },
      parserOptions: {
        ecmaVersion:  2018,
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