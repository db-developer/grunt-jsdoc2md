"use strict";

const expect       = require( "expect.js"  );
const proxyquire   = require( "proxyquire" );
const jsdoc2mdTask = require( "../../lib/tasks/jsdoc2md" );

( async function() {
  describe( "02.11.tasks.jsdoc2md.get", function () {

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

    it( "should throw if grunt is null", async function () {
        let error;

        try   { await jsdoc2mdTask.get(null, {}, "file.js", {})}
        catch ( e ) { error = e }

        expect( error ).to.be.a( TypeError );
    });

    it( "should throw if file is missing", async function () {
        const grunt = createGruntMock();

        let error;

        try   { await jsdoc2mdTask.get(grunt, {}, null, {})}
        catch ( e ) { error = e }

        expect( error ).to.be.a( TypeError );
    });

    it( "should test 'filesToDirectory' for file", async function () {
        const grunt = createGruntMock({ file: { isDir: () => true }});

        const jsdoc2mdTask = proxyquire( "../../lib/tasks/jsdoc2md.js", { });
              jsdoc2mdTask.filesToDirectory = () => Promise.resolve( "mocked content" );

        const result = await jsdoc2mdTask.get( grunt, {}, { src: ["file.js"], dest: "out.md" }, {})

        expect( result ).to.be( "mocked content" );
    });

    it( "should test 'filesToDirectory' for directory (0)", async function () {
        const grunt = createGruntMock({ file: { isDir: () => false, mkdir: () => {} }});

        const jsdoc2mdTask = proxyquire( "../../lib/tasks/jsdoc2md.js", { });
              jsdoc2mdTask.filesToDirectory = () => Promise.resolve( "mocked content" );

        const result = await jsdoc2mdTask.get( grunt, {}, { src: ["file.js"], dest: "out/" }, {})

        expect( result ).to.be( "mocked content" );
    });

    it( "should test 'filesToDirectory' for directory (1)", async function () {
        const grunt = createGruntMock({ file: { isDir: () => false, mkdir: () => {} }});

        const jsdoc2mdTask = proxyquire( "../../lib/tasks/jsdoc2md.js", { });
              jsdoc2mdTask.filesToDirectory = () => Promise.resolve( "mocked content" );

        const result = await jsdoc2mdTask.get( grunt, {}, { src: ["file.js"], dest: "out\\" }, {})

        expect( result ).to.be( "mocked content" );
    });

    it( "should test 'filesToFile'", async function () {
        const grunt = createGruntMock({ file: { isDir: () => false, mkdir: () => {} }});

        const jsdoc2mdTask = proxyquire( "../../lib/tasks/jsdoc2md.js", { });
              jsdoc2mdTask.filesToFile = () => Promise.resolve( "mocked content" );

        const result = await jsdoc2mdTask.get( grunt, {}, { src: ["file.js"], dest: "out.md" }, {})

        expect( result ).to.be( "mocked content" );
    });
  });
})();