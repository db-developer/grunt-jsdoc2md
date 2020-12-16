/**
 *  © 2020, slashlib.org.
 */
const expect    = require( "expect.js" );

( async function() {
  const constants = require( "./00.00.constants" );
  const env       = await constants.env;

  describe( "01.09.options.index.spec.js", () => {
    const options = require( "../../lib/options" );

    describe( "Testing exports of module 'options'", () => {
      it( "Function 'getOptions' should exist", () => {
          expect( options.getOptions ).not.to.be( undefined  );
          expect( options.getOptions ).not.to.be( null       );
          expect( options.getOptions ).to.be.a(   "function" );
      });
    });
  });
})();
