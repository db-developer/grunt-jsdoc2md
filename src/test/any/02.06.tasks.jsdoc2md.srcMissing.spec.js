/**
 *  src/test/any/02.06.tasks.jsdoc2md.srcMissing.spec.js
 *
 *  Tests for module.exports.srcMissing in lib/tasks/jsdoc2md.js
 *
 *  Focus:
 *  - Function exists and is callable
 *  - Returns true if file.src is null
 *  - Returns true if file.src is undefined
 *  - Returns true if file.src is an empty array
 *  - Returns false if file.src is a non-empty array
 *  - Returns false for non-array truthy values (contract behavior)
 */

"use strict";

const assert = require("node:assert");
const expect = require("expect.js");

const proxyquire = require("proxyquire");

( async function() {

  describe("02.06.tasks.jsdoc2md.srcMissing", function () {

    let jsdoc2mdTask;

    before(function () {
      jsdoc2mdTask = proxyquire("../../lib/tasks/jsdoc2md.js", {});
    });

    it("should export function", function () {
      assert.ok(jsdoc2mdTask.srcMissing, "'srcMissing' should be defined");
      expect(jsdoc2mdTask.srcMissing).to.be.a("function");
    });

    it("should return true if file.src is null", function () {
      const result = jsdoc2mdTask.srcMissing({}, { src: null });
      expect(result).to.be(true);
    });

    it("should return true if file.src is undefined", function () {
      const result = jsdoc2mdTask.srcMissing({}, { });
      expect(result).to.be(true);
    });

    it("should return true if file.src is an empty array", function () {
      const result = jsdoc2mdTask.srcMissing({}, { src: [] });
      expect(result).to.be(true);
    });

    it("should return false if file.src is a non-empty array", function () {
      const result = jsdoc2mdTask.srcMissing({}, { src: ["a.js"] });
      expect(result).to.be(false);
    });

    it("should return false if file.src is not an array but truthy", function () {
      const result = jsdoc2mdTask.srcMissing({}, { src: "a.js" });
      expect(result).to.be(false);
    });

    it("should return false if file.src is an object", function () {
      const result = jsdoc2mdTask.srcMissing({}, { src: {} });
      expect(result).to.be(false);
    });

  });

})();