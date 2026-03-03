/**
 *  src/test/any/02.07.tasks.jsdoc2md.tree.spec.js
 *
 *  Tests for module.exports.tree in lib/tasks/jsdoc2md.js
 *
 *  Focus:
 *  - Function exists and is callable
 *  - Returns empty object for empty input
 *  - Builds nested tree structure
 *  - Creates SYMBOL_FILES container at leaf nodes
 *  - Generates correct markdown destination names
 *  - Aggregates multiple files in same directory
 *  - Supports deep directory nesting
 *  - Supports Windows and POSIX path separators
 */

"use strict";

const assert = require("node:assert");
const expect = require("expect.js");

const path = require("node:path");
const proxyquire = require("proxyquire");

( async function() {

  describe("02.07.tasks.jsdoc2md.tree", function () {

    let jsdoc2mdTask;
    const SYMBOL_FILES = Symbol.for("files");

    before(function () {
      jsdoc2mdTask = proxyquire("../../lib/tasks/jsdoc2md.js", {});
    });

    it("should export function", function () {
      assert.ok(jsdoc2mdTask.tree, "'tree' should be defined");
      expect(jsdoc2mdTask.tree).to.be.a("function");
    });

    it("should return empty object if sources is undefined", function () {
      const result = jsdoc2mdTask.tree(undefined);
      expect(result).to.eql({});
    });

    it("should return empty object for empty sources array", function () {
      const result = jsdoc2mdTask.tree([]);
      expect(result).to.eql({});
    });

    it("should build simple one-level tree", function () {
      const sources = ["src/index.js"];
      const result = jsdoc2mdTask.tree(sources);

      expect(result).to.have.property("src");
      expect(result.src[SYMBOL_FILES]).to.be.an("array");
      expect(result.src[SYMBOL_FILES].length).to.be(1);

      const leaf = result.src[SYMBOL_FILES][0];
      expect(leaf.src).to.be("src/index.js");
      expect(leaf.dest).to.be("index.md");
    });

    it("should build nested tree structure", function () {
      const sources = ["src/lib/index.js"];
      const result = jsdoc2mdTask.tree(sources);

      expect(result.src).to.have.property("lib");
      expect(result.src.lib[SYMBOL_FILES]).to.be.an("array");

      const leaf = result.src.lib[SYMBOL_FILES][0];
      expect(leaf.dest).to.be("index.md");
    });

    it("should aggregate multiple files in same directory", function () {
      const sources = [
        "src/lib/a.js",
        "src/lib/b.js"
      ];

      const result = jsdoc2mdTask.tree(sources);

      expect(result.src.lib[SYMBOL_FILES]).to.be.an("array");
      expect(result.src.lib[SYMBOL_FILES].length).to.be(2);

      const dests = result.src.lib[SYMBOL_FILES].map(f => f.dest);
      expect(dests).to.contain("a.md");
      expect(dests).to.contain("b.md");
    });

    it("should support deep directory nesting", function () {
      const sources = ["src/lib/fun/some.js"];
      const result = jsdoc2mdTask.tree(sources);

      expect(result.src.lib.fun[SYMBOL_FILES]).to.be.an("array");

      const leaf = result.src.lib.fun[SYMBOL_FILES][0];
      expect(leaf.dest).to.be("some.md");
    });

    it("should support Windows-style path separators", function () {
      const sources = ["src\\lib\\file.js"];
      const result = jsdoc2mdTask.tree(sources);

      expect(result.src.lib[SYMBOL_FILES]).to.be.an("array");

      const leaf = result.src.lib[SYMBOL_FILES][0];
      expect(leaf.dest).to.be("file.md");
    });

    it("should correctly derive destination name without extension", function () {
      const sources = ["src/lib/component.test.js"];
      const result = jsdoc2mdTask.tree(sources);

      const leaf = result.src.lib[SYMBOL_FILES][0];
      expect(leaf.dest).to.be("component.test.md");
    });

  });

})();