/**
 *  © 2020, slashlib.org.
 *
 *  Initial tests - to be run in advance to any other test.
 *
 */ // use nodes default assertions
const assert = require( "assert" );

( async function() {
  const constants = require( "./00.00.constants" );
  const env       = await constants.env;

  describe( "00.01.initial.spec.ts", () => {
    describe( "Testing for prerequisites.", () => {
      it( "Check for availability of assertion library 'expect.js'", () => {
          assert.doesNotThrow(() => {
             const test = require( "expect.js" );
          }, undefined, "Missing assertion framework 'expect.js'" );
      });
      it( "Check for availability of jsdoc to markdown library 'jsdoc-to-markdown'", () => {
          assert.doesNotThrow(() => {
             const test = require( "jsdoc-to-markdown" );
          }, undefined, "Missing jsdoc to markdown framework 'jsdoc-to-markdown'" );
      });
      it( "Check for availability of library 'dmd-grunt-jsdoc2md'", () => {
          assert.doesNotThrow(() => {
             const test = require( "dmd-grunt-jsdoc2md" );
          }, undefined, "Missing library 'dmd-grunt-jsdoc2md'" );
      });
      it( "Check for availability of library 'dmd-readable'", () => {
          assert.doesNotThrow(() => {
             const test = require( "dmd-readable" );
          }, undefined, "Missing library 'dmd-readable'" );
      });
      it( "Check for availability of library 'handlebars'", () => {
          assert.doesNotThrow(() => {
             const test = require( "handlebars" );
          }, undefined, "Missing library 'handlebars'" );
      });
    });
  });
})();
