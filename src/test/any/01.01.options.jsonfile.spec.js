/**
 *  © 2020, slashlib.org.
 */
const expect    = require( "expect.js" );

( async function() {
  const constants = require( "./00.00.constants" );
  const env       = await constants.env;

  describe( "01.01.options.jsdoc2md.spec.js", () => {
    const jsdoc2md = require( "../../lib/options/jsdoc2md" );

    describe( "Testing exports of module 'options/jsdoc2md'", () => {
      it( "Function 'getOptions' should exist", () => {
          expect( jsdoc2md.getOptions ).not.to.be( undefined  );
          expect( jsdoc2md.getOptions ).not.to.be( null       );
          expect( jsdoc2md.getOptions ).to.be.a(   "function" );
      });
    });
    describe( "Testing function 'getOptions' of module 'options/jsdoc2md'", () => {
      it( "should be callable without arguments", () => {
          expect(() => { jsdoc2md.getOptions(); }).not.to.throwException(( error ) => {
            expect( error ).to.be.an( Error );
          });
      });
      it( "should be callable with arguments 'grunt' and 'task'", () => {
          expect(() => { jsdoc2md.getOptions( env.grunt, env.task ); }).not.to.throwException();
          // console.log( jsdoc2md.getOptions( env.grunt, env.task ));
          expect( JSON.stringify( jsdoc2md.getOptions( env.grunt, env.task )) === JSON.stringify({ })).to.be.ok();
      });
    });
  });
})();
