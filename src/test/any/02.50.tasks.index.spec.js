/**
 *  © 2020, slashlib.org.
 */
const expect    = require( "expect.js" );

( async function() {
  // const constants = require( "./00.00.constants" );
  // const env       = await constants.env;

  describe( "02.50.tasks.index.spec.js", () => {
    const tasks = require( "../../lib/tasks/index" );

    describe( "Testing exports of module 'tasks'", () => {
      it( "Function 'registerMultiTask' should exist", () => {
          expect( tasks.registerMultiTask ).not.to.be( undefined  );
          expect( tasks.registerMultiTask ).not.to.be( null       );
          expect( tasks.registerMultiTask ).to.be.a(   "function" );
      });
    });
  });
})();
