/**
 *  © 2020, slashlib.org.
 */
const expect    = require( "expect.js" );

( async function() {
  //const constants = require( "./00.00.constants" );
  //const env       = await constants.env;

  describe( "02.01.tasks.jsdoc2md.spec.js", () => {
    const jsdoc2md = require( "../../lib/tasks/jsdoc2md" );

    describe( "Testing exports of module 'tasks/jsdoc2md'", () => {
      it( "Function 'filesToDirectory' should exist", () => {
          expect( jsdoc2md.filesToDirectory  ).not.to.be( undefined  );
          expect( jsdoc2md.filesToDirectory  ).not.to.be( null       );
          expect( jsdoc2md.filesToDirectory  ).to.be.a(   "function" );
      });
      it( "Function 'filesToFile' should exist", () => {
          expect( jsdoc2md.filesToFile       ).not.to.be( undefined  );
          expect( jsdoc2md.filesToFile       ).not.to.be( null       );
          expect( jsdoc2md.filesToFile       ).to.be.a(   "function" );
      });
      it( "Function 'get' should exist", () => {
          expect( jsdoc2md.get               ).not.to.be( undefined  );
          expect( jsdoc2md.get               ).not.to.be( null       );
          expect( jsdoc2md.get               ).to.be.a(   "function" );
      });
      it( "Function 'unwrapLinearRoot' should exist", () => {
          expect( jsdoc2md.unwrapLinearRoot  ).not.to.be( undefined  );
          expect( jsdoc2md.unwrapLinearRoot  ).not.to.be( null       );
          expect( jsdoc2md.unwrapLinearRoot  ).to.be.a(   "function" );
      });
      it( "Function 'registerMultiTask' should exist", () => {
          expect( jsdoc2md.registerMultiTask ).not.to.be( undefined  );
          expect( jsdoc2md.registerMultiTask ).not.to.be( null       );
          expect( jsdoc2md.registerMultiTask ).to.be.a(   "function" );
      });
      it( "Function 'render' should exist", () => {
          expect( jsdoc2md.render            ).not.to.be( undefined  );
          expect( jsdoc2md.render            ).not.to.be( null       );
          expect( jsdoc2md.render            ).to.be.a(   "function" );
      });
      it( "Function 'renderTree' should exist", () => {
          expect( jsdoc2md.renderTree        ).not.to.be( undefined  );
          expect( jsdoc2md.renderTree        ).not.to.be( null       );
          expect( jsdoc2md.renderTree        ).to.be.a(   "function" );
      });
      it( "Function 'runTask' should exist", () => {
          expect( jsdoc2md.runTask           ).not.to.be( undefined  );
          expect( jsdoc2md.runTask           ).not.to.be( null       );
          expect( jsdoc2md.runTask           ).to.be.a(   "function" );
      });
      it( "Function 'srcMissing' should exist", () => {
          expect( jsdoc2md.srcMissing        ).not.to.be( undefined  );
          expect( jsdoc2md.srcMissing        ).not.to.be( null       );
          expect( jsdoc2md.srcMissing        ).to.be.a(   "function" );
      });
      it( "Function 'tree' should exist", () => {
          expect( jsdoc2md.tree             ).not.to.be( undefined  );
          expect( jsdoc2md.tree             ).not.to.be( null       );
          expect( jsdoc2md.tree             ).to.be.a(   "function" );
      });
    });
  });
})();
