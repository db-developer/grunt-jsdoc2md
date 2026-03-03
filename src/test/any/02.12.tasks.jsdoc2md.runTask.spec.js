"use strict";

const expect       = require( "expect.js"  );
const proxyquire   = require( "proxyquire" );
const jsdoc2mdTask = require( "../../lib/tasks/jsdoc2md" );

( async function() {
  const constants = require( "./00.00.constants" );
  const env       = await constants.env;

  describe( "02.12.tasks.jsdoc2md.runTask", function () {

    function createGruntMock(overrides = {}) {
      return Object.assign({
        file: {
          exists: () => true,
          read: () => "content",
          isDir: () => false
        },
        log: {
          warn: () => {}
        }
      }, overrides );
    }

    it( "should throw if grunt is undefined", async function () {
        let error;

        try   { await jsdoc2mdTask.runTask()}
        catch ( e ) { error = e }

        expect( error ).to.be.a( TypeError );
    });

    it( "should throw if task is undefined", async function () {
        let error;

        try   { await jsdoc2mdTask.runTask( env.grunt, undefined )}
        catch ( e ) { error = e }

        expect( error ).to.be.a( TypeError );
    });

    it( "should throw if task is undefined", async function () {
        const jsdoc2mdTask = proxyquire( "../../lib/tasks/jsdoc2md.js", {});
              jsdoc2mdTask.get = () => { return Promise.resolve( "mocked content" )};

        const result = await jsdoc2mdTask.runTask( env.grunt, env.task );
        expect(result).to.eql(["mocked content"]);
    });

  });
})();