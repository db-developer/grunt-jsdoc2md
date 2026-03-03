/**
 *  src/test/any/02.08.tasks.jsdoc2md.unwrapLinearRoot.spec.js
 *
 *  Tests for module.exports.unwrapLinearRoot in lib/tasks/jsdoc2md.js
 *
 *  Focus:
 *  - Function exists and is callable
 *  - Returns tree unchanged if SYMBOL_FILES exists at root
 *  - Returns empty object if tree has no keys
 *  - Returns tree unchanged if multiple keys exist
 *  - Recursively reduces single-branch trees
 *  - Stops reduction once SYMBOL_FILES is found
 */

"use strict";

const assert = require("node:assert");
const expect = require("expect.js");

const proxyquire = require("proxyquire");

( async function() {

  describe( "02.08.tasks.jsdoc2md.unwrapLinearRoot", function () {

    let jsdoc2mdTask;
    const SYMBOL_FILES = Symbol.for("files");

    before(function () {
      jsdoc2mdTask = proxyquire("../../lib/tasks/jsdoc2md.js", {});
    });

    it( "should export function", function () {
        assert.ok(jsdoc2mdTask.unwrapLinearRoot, "'unwrapLinearRoot' should be defined");
        expect(jsdoc2mdTask.unwrapLinearRoot).to.be.a("function");
    });

    it( "should return undefined if dsttree is undefined", function () {
        const result = jsdoc2mdTask.unwrapLinearRoot(undefined);
        expect(result).to.be(undefined);
    });

    it( "should return null if dsttree is null", function () {
        const result = jsdoc2mdTask.unwrapLinearRoot(null);
        expect(result).to.be(null);
    });    

    it( "should return tree unchanged if SYMBOL_FILES exists at root", function () {
        const tree = {
          [SYMBOL_FILES]: [{ src: "a.js", dest: "a.md" }]
        };

        const result = jsdoc2mdTask.unwrapLinearRoot(tree);

        expect(result).to.be(tree);
    });

    it( "should return empty object if tree has no keys", function () {
        const tree = {};

        const result = jsdoc2mdTask.unwrapLinearRoot(tree);

        expect(result).to.eql({});
    });

    it( "should return tree unchanged if multiple keys exist", function () {
        const tree = {
          a: {},
          b: {}
        };

        const result = jsdoc2mdTask.unwrapLinearRoot(tree);

        expect(result).to.be(tree);
    });

    it( "should recursively unwrapLinearRoot single-branch tree", function () {
        const tree = {
          src: {
            lib: {
              [SYMBOL_FILES]: [{ src: "a.js", dest: "a.md" }]
            }
          }
        };

        const result = jsdoc2mdTask.unwrapLinearRoot(tree);

        expect(result[SYMBOL_FILES]).to.be.an("array");
        expect(result[SYMBOL_FILES][0].dest).to.be("a.md");
    });

    it( "should unwrapLinearRoot multiple nested single branches", function () {
        const tree = {
          a: {
            b: {
              c: {
                [SYMBOL_FILES]: [{ src: "x.js", dest: "x.md" }]
              }
            }
          }
        };

        const result = jsdoc2mdTask.unwrapLinearRoot(tree);

        expect(result[SYMBOL_FILES]).to.be.an("array");
        expect(result[SYMBOL_FILES][0].dest).to.be("x.md");
    });

    it( "should stop reduction if branch contains multiple keys", function () {
        const tree = {
          a: {
            b: {
              c: {},
              d: {}
            },
            e: {
              f: {}
            }
          }
        };

        const result = jsdoc2mdTask.unwrapLinearRoot(tree);

        expect( result ).to.be( tree.a );
    });

    it( "should stop reduction once SYMBOL_FILES is encountered", function () {
        const tree = {
          a: {
            [SYMBOL_FILES]: [{ src: "a.js", dest: "a.md" }],
            extra: {}
          }
        };

        const result = jsdoc2mdTask.unwrapLinearRoot(tree);

        expect(result).to.be(tree.a);
    });

  });
})();