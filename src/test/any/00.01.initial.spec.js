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
    });
  });
})();
