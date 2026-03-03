/**
 *  src/test/any/02.02.tasks.jsdoc2md.renderTree.spec.js
 *
 *  Tests for module.exports.renderTree in lib/tasks/jsdoc2md.js
 *
 *  Focus:
 *  - Function exists and is callable
 *  - Handles missing tree gracefully
 *  - Warns on invalid SYMBOL_FILES container
 *  - Skips malformed filesets (invalid src / dest)
 *  - Renders valid filesets sequentially
 *  - Recurses into subtrees
 *  - Computes depth, path and file properties correctly
 *  - Returns a Promise
 */

"use strict";

const assert = require("node:assert");
const expect = require("expect.js");

const path = require("node:path");

const gruntMockModule = require("./__mocks__/grunt");
const proxyquire = require("proxyquire");

( async function() {

  describe("02.03.tasks.jsdoc2md.renderTree", function () {

    let grunt, jsdoc2mdTask, renderCalls;
    const SYMBOL_FILES = Symbol.for( "files" );
    const logSpy = [];

    before(function () {
      const fakeLog = function( grunt, level, scope, message, detail, context) {
        logSpy.push({ level, scope, message, detail, context });
      };

      jsdoc2mdTask = proxyquire("../../lib/tasks/jsdoc2md.js", {
        "../log": { log: fakeLog }
      });
    });

    beforeEach(function () {
      gruntMockModule.resetState();
      grunt = gruntMockModule.apply();
      logSpy.length = 0;
      renderCalls = [];

      jsdoc2mdTask.render = function ( grunt, task, opts, fileset ) {
        renderCalls.push({ opts: structuredClone( opts ), fileset });
        return Promise.resolve();
      };
    });

    afterEach(function () {
      gruntMockModule.restore();
    });

    it( "should export function", function () {
        assert.ok(jsdoc2mdTask.renderTree, "'renderTree' should be defined");
        expect(jsdoc2mdTask.renderTree).to.be.a("function");
    });

    it( "should return a Promise when called with minimal arguments", function () {
        const result = jsdoc2mdTask.renderTree(grunt, {}, {}, "dest", null, []);
        expect(result).to.be.a(Promise);
    });

    it( "should handle missing tree without throwing", async function () {
        await jsdoc2mdTask.renderTree(grunt, {}, {}, "dest", null, []);
        expect(renderCalls.length).to.be(0);
    });

    it( "should warn if SYMBOL_FILES is not an array", async function () {
        const tree = {
          [SYMBOL_FILES]: {}
        };

        await jsdoc2mdTask.renderTree(grunt, {}, {}, "dest", tree, []);

        expect(logSpy.length).to.be(1);
        expect(logSpy[0].level).to.be("warn");
    });

    it( "should skip fileset with invalid src", async function () {
        const tree = {
          [SYMBOL_FILES]: [
            { dest: "a.md" }
          ]
        };

        await jsdoc2mdTask.renderTree(grunt, {}, {}, "dest", tree, []);

        expect(renderCalls.length).to.be(0);
        expect(logSpy.length).to.be(1);
    });

    it( "should skip fileset with invalid dest", async function () {
        const tree = {
          [SYMBOL_FILES]: [
            { src: "a.js" }
          ]
        };

        await jsdoc2mdTask.renderTree(grunt, {}, {}, "dest", tree, []);

        expect(renderCalls.length).to.be(0);
        expect(logSpy.length).to.be(1);
    });

    it( "should render valid fileset and compute metadata", async function () {
        const tree = {
          [SYMBOL_FILES]: [
            { src: "a.js", dest: "a.md" }
          ]
        };

        const options = { foo: "bar" };

        await jsdoc2mdTask.renderTree(grunt, {}, options, "dest", tree, ["api"]);

        expect(renderCalls.length).to.be(1);

        const call = renderCalls[0];
        expect(call.fileset.depth).to.be(1);
        expect(call.fileset.path).to.be("api");
        expect(call.fileset.file).to.contain(path.join("dest", "a.md"));

        expect(call.opts.files).to.eql(["a.js"]);
        expect(call.opts.foo).to.be("bar");
    });

    it( "should process multiple filesets sequentially", async function () {
        const order = [];

        jsdoc2mdTask.render = function (grunt, task, opts, fileset) {
          return new Promise((resolve) => {
            order.push(fileset.src);
            resolve();
          });
        };

        const tree = {
          [SYMBOL_FILES]: [
            { src: "a.js", dest: "a.md" },
            { src: "b.js", dest: "b.md" }
          ]
        };

        await jsdoc2mdTask.renderTree(grunt, {}, {}, "dest", tree, []);

        expect(order).to.eql(["a.js", "b.js"]);
    });

    it( "should recurse into subtrees", async function () {
        const tree = {
          sub: {
            [SYMBOL_FILES]: [
              { src: "a.js", dest: "a.md" }
            ]
          }
        };

        await jsdoc2mdTask.renderTree(grunt, {}, {}, "dest", tree, []);

        expect(renderCalls.length).to.be(1);
        expect(renderCalls[0].fileset.depth).to.be(1);
        expect(renderCalls[0].fileset.path).to.be("sub");
    });
  });
})();
