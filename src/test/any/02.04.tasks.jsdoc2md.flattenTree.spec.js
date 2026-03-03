/**
 *  src/test/any/02.04.tasks.jsdoc2md.flattenTree.spec.js
 *
 *  Tests for module.exports.flattenTree in lib/tasks/jsdoc2md.js
 *
 *  Focus:
 *  - Function exists and is callable
 *  - Returns the same Promise chain
 *  - Handles missing tree gracefully
 *  - Skips filesets without data
 *  - Resolves and aggregates array outputs
 *  - Resolves and aggregates single outputs
 *  - Processes multiple filesets sequentially
 *  - Recurses into subtrees
 *  - Preserves fail-fast behavior (Promise rejection)
 */

"use strict";

const assert = require("node:assert");
const expect = require("expect.js");

const proxyquire = require("proxyquire");

( async function() {

  describe("02.04.tasks.jsdoc2md.flattenTree", function () {

    let jsdoc2mdTask;
    const SYMBOL_FILES = Symbol.for("files");

    before(function () {
      jsdoc2mdTask = proxyquire("../../lib/tasks/jsdoc2md.js", {});
    });

    it("should export function", function () {
      assert.ok(jsdoc2mdTask.flattenTree, "'flattenTree' should be defined");
      expect(jsdoc2mdTask.flattenTree).to.be.a("function");
    });

    it( "should return a Promise that resolves to the initial value if tree is empty", async function () {
        const initial = Promise.resolve([]);
        const result = jsdoc2mdTask.flattenTree({}, {}, {}, initial);
        expect(result).to.be.a(Promise);

        const resolved = await result;
        expect(resolved).to.eql([]);
    });

    it( "should not modify the accumulator when tree is empty", async function () {
        const seed = [];
        const initial = Promise.resolve(seed);

        const result = jsdoc2mdTask.flattenTree({}, {}, {}, initial);
        const resolved = await result;

        expect(resolved).to.equal(seed); // Referenzgleichheit des Arrays
    });    

    it( "should handle missing tree without modifying data", async function () {
        const initial = Promise.resolve(["existing"]);

        let error;
        try { await jsdoc2mdTask.flattenTree({}, {}, null, initial)}
        catch( e ) { error = e; }

        expect( error ).to.be.a( TypeError );
    });

    it( "should skip filesets without data property", async function () {
        const tree = {
          [SYMBOL_FILES]: [{}]
        };

        const result = await jsdoc2mdTask.flattenTree({}, {}, tree, Promise.resolve([]));
        expect(result).to.eql([]);
    });

    it( "should append array output from fileset.data", async function () {
        const tree = {
          [SYMBOL_FILES]: [{ data: Promise.resolve([{ a: 1 }, { b: 2 }])}]
        };

        const result = await jsdoc2mdTask.flattenTree({}, {}, tree, Promise.resolve([]));
        expect(result).to.eql([{ a: 1 }, { b: 2 }]);
    });

    it( "should append single object output from fileset.data", async function () {
        const tree = {
          [SYMBOL_FILES]: [{ data: Promise.resolve({ a: 1 })}]
        };

        const result = await jsdoc2mdTask.flattenTree({}, {}, tree, Promise.resolve([]));
        expect(result).to.eql([{ a: 1 }]);
    });

    it( "should process multiple filesets sequentially", async function () {
        const order = [];

        const tree = {
          [SYMBOL_FILES]: [
            {
              data: new Promise((resolve) => {
                order.push("first");
                resolve(["a"]);
              })
            },
            {
              data: new Promise((resolve) => {
                order.push("second");
                resolve(["b"]);
              })
            }
          ]
        };

        const result = await jsdoc2mdTask.flattenTree({}, {}, tree, Promise.resolve([]));

        expect(order).to.eql(["first", "second"]);
        expect(result).to.eql(["a", "b"]);
    });

    it( "should recurse into subtrees", async function () {
        const tree = {
          sub: {
            [SYMBOL_FILES]: [{ data: Promise.resolve(["a"])}]
          }
        };

        const result = await jsdoc2mdTask.flattenTree({}, {}, tree, Promise.resolve([]));
        expect(result).to.eql(["a"]);
    });

    it( "should aggregate data across multiple levels", async function () {
        const tree = {
          [SYMBOL_FILES]: [
            { data: Promise.resolve(["root"]) }
          ],
          sub: {
            [SYMBOL_FILES]: [
              { data: Promise.resolve(["child"]) }
            ]
          }
        };

        const result = await jsdoc2mdTask.flattenTree({}, {}, tree, Promise.resolve([]));
        expect(result).to.eql(["root", "child"]);
    });

    it( "should preserve fail-fast behavior on rejection", async function () {
        const tree = {
          [SYMBOL_FILES]: [
            {
              data: Promise.reject(new Error("fail"))
            },
            {
              data: Promise.resolve(["should not run"])
            }
          ]
        };

        let error;
        try {
          await jsdoc2mdTask.flattenTree({}, {}, tree, Promise.resolve([]));
        }
        catch (e) {
          error = e;
        }

        expect(error).to.be.an(Error);
        expect(error.message).to.be("fail");
    });
  });
})();