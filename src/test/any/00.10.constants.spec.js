/**
 * @file src/test/any/00.10.log.spec.js
 */
/**
 *  © 2020, slashlib.org.
 */
const expect    = require( "expect.js" );

( async function() {

  describe( "00.10.constants.spec.ts", () => {
    const constants = require( "../../lib/constants" );

    describe( "Testing exports of module 'constants'", () => {
      it( "String 'TASKNAME' should exist", () => {
          expect( constants.TASKNAME ).not.to.be( undefined  );
          expect( constants.TASKNAME ).not.to.be( null       );
          expect( constants.TASKNAME ).to.be.a(   "string"   );
          expect( constants.TASKNAME ).to.be(     "jsdoc2md" );
      });
    });

    describe( "Testing exports of module 'constants'", () => {
      it( "String 'TASKDESCRIPTION' should exist", () => {
          expect( constants.TASKDESCRIPTION ).not.to.be( undefined  );
          expect( constants.TASKDESCRIPTION ).not.to.be( null       );
          expect( constants.TASKDESCRIPTION ).to.be.a(   "string"   );
          expect( constants.TASKDESCRIPTION ).to.be( "Create markdown from jsdoc" );
      });
    });
  });
})();
