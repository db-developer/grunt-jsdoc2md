/**
 *  © 2020, slashlib.org.
 */
const expect    = require( "expect.js" );

( async function() {
  const constants = require( "./00.00.constants" );
  const env       = await constants.env;

  describe( "02.01.tasks.jsdoc2md.spec.js", () => {
    const jsdoc2md = require( "../../lib/tasks/jsdoc2md" );

    describe( "Testing exports of module 'tasks/jsdoc2md'", () => {
      it( "Function 'filesToDirectory' should exist", () => {
          expect( jsdoc2md.filesToDirectory ).not.to.be( undefined  );
          expect( jsdoc2md.filesToDirectory ).not.to.be( null       );
          expect( jsdoc2md.filesToDirectory ).to.be.a(   "function" );
      });
      it( "Function 'filesToFile' should exist", () => {
          expect( jsdoc2md.filesToFile      ).not.to.be( undefined  );
          expect( jsdoc2md.filesToFile      ).not.to.be( null       );
          expect( jsdoc2md.filesToFile      ).to.be.a(   "function" );
      });
      it( "Function 'get' should exist", () => {
          expect( jsdoc2md.get              ).not.to.be( undefined  );
          expect( jsdoc2md.get              ).not.to.be( null       );
          expect( jsdoc2md.get              ).to.be.a(   "function" );
      });
      it( "Function 'reduce' should exist", () => {
          expect( jsdoc2md.reduce           ).not.to.be( undefined  );
          expect( jsdoc2md.reduce           ).not.to.be( null       );
          expect( jsdoc2md.reduce           ).to.be.a(   "function" );
      });
      it( "Function 'render' should exist", () => {
          expect( jsdoc2md.render           ).not.to.be( undefined  );
          expect( jsdoc2md.render           ).not.to.be( null       );
          expect( jsdoc2md.render           ).to.be.a(   "function" );
      });
      it( "Function 'renderTree' should exist", () => {
          expect( jsdoc2md.renderTree       ).not.to.be( undefined  );
          expect( jsdoc2md.renderTree       ).not.to.be( null       );
          expect( jsdoc2md.renderTree       ).to.be.a(   "function" );
      });
      it( "Function 'runTaskJSDoc2MD' should exist", () => {
          expect( jsdoc2md.runTaskJSDoc2MD  ).not.to.be( undefined  );
          expect( jsdoc2md.runTaskJSDoc2MD  ).not.to.be( null       );
          expect( jsdoc2md.runTaskJSDoc2MD  ).to.be.a(   "function" );
      });
      it( "Function 'srcExists' should exist", () => {
          expect( jsdoc2md.srcExists        ).not.to.be( undefined  );
          expect( jsdoc2md.srcExists        ).not.to.be( null       );
          expect( jsdoc2md.srcExists        ).to.be.a(   "function" );
      });
      it( "Function 'tree' should exist", () => {
          expect( jsdoc2md.tree             ).not.to.be( undefined  );
          expect( jsdoc2md.tree             ).not.to.be( null       );
          expect( jsdoc2md.tree             ).to.be.a(   "function" );
      });
    });
/*
    describe( "Testing function 'getTemplate' of module 'tasks/jsdoc2md'", () => {
      it( "should be callable without arguments", () => {
          expect(() => { jsdoc2md.getTemplate(); }).not.to.throwException();
          const result = jsdoc2md.getTemplate();
          expect( JSON.stringify( result ) === JSON.stringify({})).to.be.ok();
      });
    });
*/
  });
})();
