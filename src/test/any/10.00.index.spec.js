/**
 *  © 2020, slashlib.org.
 */
const expect    = require( "expect.js" );

( async function() {
  const constants = require( "./00.00.constants"   );
  const values    = require( "../../lib/constants" );
  const env       = await constants.env;

  describe( "10.00.index.spec.js", () => {
    const index = require( "../../lib/index" );

    describe( "Testing exports of module 'index'", () => {
      it( "Function 'registerMultiTaskJSDoc2MD' should exist", () => {
          expect( index.registerMultiTaskJSDoc2MD ).not.to.be( undefined  );
          expect( index.registerMultiTaskJSDoc2MD ).not.to.be( null       );
          expect( index.registerMultiTaskJSDoc2MD ).to.be.a(   "function" );
      });
    });
    describe( "Testing function 'registerMultiTaskJSDoc2MD' of module 'index'", () => {
      it( "should be callable without arguments", () => {
          expect(() => { index.registerMultiTaskJSDoc2MD( env.grunt ); }).not.to.throwException();
      });
      it( "should be runnable.", () => {
          expect(() => { env.grunt.tasks([ values.TASKNAME_JSDOC2MD ], undefined, () => { }); }).not.to.throwException(( error ) => { console.log( error )});
      });
    });
  });
})();
