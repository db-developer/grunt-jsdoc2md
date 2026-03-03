/**
 * @file src/test/any/00.10.log.spec.js
 */
/**
 *  © 2020, slashlib.org.
 */
const expect    = require( "expect.js" );
const log       = require( "../../lib/log" );

( async function() {
  // const constants = require( "./00.00.constants" );
  // const env       = await constants.env;

  describe( "00.11.log.spec.ts", () => {
    describe( "test log without context", () => {
      let value;
      const grunt = { log: { error: function( text ) { value = text }}};
      log.log( grunt, "error", "test", "test", "test message" )
      expect( value ).to.be( "[jsdoc2md] test: test — test message" );
    });

    describe( "test log with context", () => {
      let value;
      const grunt = { log: { error: function( text ) { value = text }}};
      log.log( grunt, "error", "test", "test", "test message", "test context" )
      expect( value ).to.be( "[jsdoc2md] test: test — test message (test context)" );
    });
  });
})();
