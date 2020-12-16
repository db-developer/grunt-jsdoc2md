/**
 *  © 2020, slashlib.org.
 */
const expect    = require( "expect.js" );

( async function() {
  const constants = require( "./00.00.constants" );
  const env       = await constants.env;

  describe( "02.09.tasks.index.spec.js", () => {
    const tasks = require( "../../lib/tasks/index" );

    describe( "Testing exports of module 'tasks'", () => {
      it( "Function 'runTaskJSDoc2MD' should exist", () => {
          expect( tasks.runTaskJSDoc2MD ).not.to.be( undefined  );
          expect( tasks.runTaskJSDoc2MD ).not.to.be( null       );
          expect( tasks.runTaskJSDoc2MD ).to.be.a(   "function" );
      });
    });
  });
})();
