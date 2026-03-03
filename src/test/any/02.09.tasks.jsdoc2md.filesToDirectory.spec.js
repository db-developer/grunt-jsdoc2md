/**
 *  src/test/any/02.09.tasks.jsdoc2md.filesToDirectory.spec.js
 *
 *  Tests for module.exports.filesToDirectory in lib/tasks/jsdoc2md.js
 *
 *  Focus:
 *  - Function exists and is callable
 *  - Warns and resolves if src is missing
 *  - Builds tree and reduces it
 *  - Calls renderTree with correct parameters
 *  - Calls renderApiIndex when index !== false
 *  - Skips renderApiIndex when index === false
 *  - Propagates renderApiIndex errors
 *  - Returns Promise
 */

"use strict";

const assert = require("node:assert");
const expect = require("expect.js");
const proxyquire = require("proxyquire");
const path = require("node:path");

( async function() {

  describe("02.09.tasks.jsdoc2md.filesToDirectory", function () {

    let jsdoc2mdTask;
    let grunt;
    let renderTreeSpy;
    let renderApiIndexSpy;
    let treeSpy;
    let unwrapLinearRootSpy;
    let warnSpy;

    beforeEach(function () {

      renderTreeSpy = function () {
        renderTreeSpy.calls.push([...arguments]);
        return Promise.resolve();
      };
      renderTreeSpy.calls = [];

      renderApiIndexSpy = function () {
        renderApiIndexSpy.calls.push([...arguments]);
        return Promise.resolve();
      };
      renderApiIndexSpy.calls = [];

      treeSpy = function (sources) {
        treeSpy.calls.push(sources);
        return { stub: true };
      };
      treeSpy.calls = [];

      unwrapLinearRootSpy = function (tree) {
        unwrapLinearRootSpy.calls.push(tree);
        return tree;
      };
      unwrapLinearRootSpy.calls = [];

      warnSpy = function (msg) {
        warnSpy.calls.push(msg);
      };
      warnSpy.calls = [];

      grunt = {
        file: {
          mkdir: function () {}
        },
        log: {
          warn: warnSpy
        }
      };

      jsdoc2mdTask = proxyquire("../../lib/tasks/jsdoc2md.js", {});

      jsdoc2mdTask.renderTree = renderTreeSpy;
      jsdoc2mdTask.renderApiIndex = renderApiIndexSpy;
      jsdoc2mdTask.tree = treeSpy;
      jsdoc2mdTask.unwrapLinearRoot = unwrapLinearRootSpy;
    });

    it( "should export function", function () {
        assert.ok(jsdoc2mdTask.filesToDirectory, "'filesToDirectory' should be defined");
        expect(jsdoc2mdTask.filesToDirectory).to.be.a("function");
    });

    it( "should return Promise", function () {
        const result = jsdoc2mdTask.filesToDirectory(
          grunt,
          {},
          { src: [], dest: "out" },
          {}
        );

        expect(result).to.be.a(Promise);
    });

    it( "should warn and resolve if src is missing", async function () {
        const result = await jsdoc2mdTask.filesToDirectory(
          grunt,
          {},
          { src: null, dest: "out" },
          {}
        );

        expect(warnSpy.calls.length).to.be(1);
        expect(result).to.be(true);
        expect(renderTreeSpy.calls.length).to.be(0);
    });

    it( "should warn and resolve if dsttree is undefined", async function () {
        treeSpy = function () {
          treeSpy.calls.push([...arguments]);
          return undefined;
        };
        treeSpy.calls = [];
        jsdoc2mdTask.tree = treeSpy;

        unwrapLinearRootSpy = function () {
          unwrapLinearRootSpy.calls.push([...arguments]);
          return undefined;
        }
        unwrapLinearRootSpy.calls = [];
        jsdoc2mdTask.unwrapLinearRoot = unwrapLinearRootSpy;

        const file = { src: ["a.js"], dest: "out" };
        const options = { index: false };

        const result = await jsdoc2mdTask.filesToDirectory(grunt, {}, file, options);

        expect(warnSpy.calls.length).to.be(1);
        expect(warnSpy.calls[0]).to.match(/\[jsdoc2md\] filesToDirectory: destination tree — missing destination tree \(srctree="undefined"\)/);

        expect(result).to.be(true);
    });    

    it("should build and reduce tree", async function () {
      await jsdoc2mdTask.filesToDirectory(
        grunt,
        {},
        { src: ["a.js"], dest: "out" },
        { index: false }
      );

      expect(treeSpy.calls.length).to.be(1);
      expect(unwrapLinearRootSpy.calls.length).to.be(1);
    });

    it("should call renderTree with correct parameters", async function () {
      const file = { src: ["a.js"], dest: "out" };
      const options = { index: false };

      await jsdoc2mdTask.filesToDirectory(grunt, {}, file, options);

      expect(renderTreeSpy.calls.length).to.be(1);

      const args = renderTreeSpy.calls[0];

      expect(args[3]).to.be("out");          // destination
      expect(args[4]).to.eql({ stub: true }); // reduced tree
      expect(args[5]).to.eql(["."]);         // treepath when index === false
    });

    it("should call renderApiIndex when index !== false", async function () {
      const file = { src: ["a.js"], dest: "out" };
      const options = {
        index: { dest: "api/index.md" }
      };

      await jsdoc2mdTask.filesToDirectory(grunt, {}, file, options);

      expect(renderTreeSpy.calls.length).to.be(1);
      expect(renderApiIndexSpy.calls.length).to.be(1);
    });

    it("should not call renderApiIndex when index === false", async function () {
      const file = { src: ["a.js"], dest: "out" };
      const options = { index: false };

      await jsdoc2mdTask.filesToDirectory(grunt, {}, file, options);

      expect(renderTreeSpy.calls.length).to.be(1);
      expect(renderApiIndexSpy.calls.length).to.be(0);
    });

    it("should compute relative path correctly when index is enabled", async function () {
      const file = { src: ["a.js"], dest: "docs/out" };
      const options = {
        index: { dest: "docs/api/index.md" }
      };

      await jsdoc2mdTask.filesToDirectory(grunt, {}, file, options);

      const args = renderTreeSpy.calls[0];
      const treepath = args[5];

      const expectedRel = path.relative(
        path.dirname(options.index.dest),
        file.dest
      ).replace(/[\\]/g, "/");

      expect(treepath).to.eql([expectedRel]);
    });

    it("should propagate renderApiIndex errors", async function () {

      renderApiIndexSpy = function () {
        return Promise.reject(new Error("index fail"));
      };

      jsdoc2mdTask.renderApiIndex = renderApiIndexSpy;

      const file = { src: ["a.js"], dest: "out" };
      const options = {
        index: { dest: "api/index.md" }
      };

      let error;

      try {
        await jsdoc2mdTask.filesToDirectory(grunt, {}, file, options);
      }
      catch (e) {
        error = e;
      }

      expect(error).to.be.an(Error);
      expect(error.message).to.be("index fail");
    });

  });

})();