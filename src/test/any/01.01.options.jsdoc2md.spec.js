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
      it( "Function 'getIndexOptions' should exist", () => {
          expect( jsdoc2md.getIndexOptions ).not.to.be( undefined  );
          expect( jsdoc2md.getIndexOptions ).not.to.be( null       );
          expect( jsdoc2md.getIndexOptions ).to.be.a(   "function" );
      });
      it( "Function 'getPlugins' should exist", () => {
          expect( jsdoc2md.getPlugins ).not.to.be( undefined  );
          expect( jsdoc2md.getPlugins ).not.to.be( null       );
          expect( jsdoc2md.getPlugins ).to.be.a(   "function" );
      });
    });
    describe( "Testing function 'getOptions' of module 'options/jsdoc2md'", () => {
      it( "should not be callable without arguments", () => {
          const errmsg      = "Cannot read property 'options' of undefined";
          const errmsg_v_16 = "Cannot read properties of undefined (reading 'options')";
          expect(() => { jsdoc2md.getOptions(); }).to.throwException(( error ) => {
            console.log( error );
            expect( error ).to.be.an( TypeError );
            expect(( error.message === errmsg ) || ( error.message === errmsg_v_16 )).to.be.ok();
          });
      });
      it( "should be callable with arguments 'grunt' and 'task'", () => {
          expect(() => { jsdoc2md.getOptions( env.grunt, env.task ); }).not.to.throwException();
          const options = jsdoc2md.getOptions( env.grunt, env.task );
          expect( options ).not.to.be( null      );
          expect( options ).not.to.be( undefined );
          expect( options ).to.be.an(  "object"  );
      });
    });
    describe( "Testing function 'getIndexOptions' of module 'options/jsdoc2md'", () => {
      it( "should be callable without arguments", () => {
          expect(() => { jsdoc2md.getIndexOptions(); }).not.to.throwException();
      });
      it( "should be callable with argument 'options' {false}", () => {
          expect(() => { jsdoc2md.getIndexOptions( false ); }).not.to.throwException();
          const options = jsdoc2md.getIndexOptions( false );
          expect( options ).not.to.be( null      );
          expect( options ).not.to.be( undefined );
          expect( options === false ).to.be.ok(  );
      });
    });
    describe( "Testing function 'getPlugins' of module 'options/jsdoc2md'", () => {
      it( "should be callable without arguments", () => {
          expect(() => { jsdoc2md.getPlugins(); }).not.to.throwException();
          const plugins = jsdoc2md.getPlugins();
          expect( plugins ).not.to.be( null      );
          expect( plugins ).not.to.be( undefined );
          expect( Array.isArray( plugins )).to.be.ok();
          expect( plugins.length === 2 ).to.be.ok();
      });
      it( "should be callable with argument 'options' { }", () => {
          const options = { };
          expect(() => { jsdoc2md.getPlugins( options ); }).not.to.throwException();
          const plugins = jsdoc2md.getPlugins( options );
          expect( plugins ).not.to.be( null      );
          expect( plugins ).not.to.be( undefined );
          expect( Array.isArray( plugins )).to.be.ok();
          expect( plugins.length === 2 ).to.be.ok();
      });
      it( "should be callable with argument 'options' { plugin: [ 'example' ] }", () => {
          const options = { plugin: [ "example" ]};
          expect(() => { jsdoc2md.getPlugins( options ); }).not.to.throwException();
          const plugins = jsdoc2md.getPlugins( options );
          expect( plugins ).not.to.be( null      );
          expect( plugins ).not.to.be( undefined );
          expect( Array.isArray( plugins )).to.be.ok();
          expect( plugins.length === 3 ).to.be.ok();
      });
    });
  });
})();
