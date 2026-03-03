/**
 *  src/test/any/02.10.tasks.jsdoc2md.filesToFile.spec.js
 *
 *  Tests for module.exports.filesToFile in lib/tasks/jsdoc2md.js
 *
 *  Focus:
 *  - Function exists and is callable
 *  - Warns and resolves if src is missing
 *  - Creates destination directory
 *  - Clones options (no mutation of original)
 *  - Sets options.files correctly
 *  - Calls render with correct parameters
 *  - Returns Promise
 */

"use strict";

const assert = require("node:assert");
const expect = require("expect.js");
const proxyquire = require("proxyquire");
const path = require("node:path");

( async function() {

  describe("02.10.tasks.jsdoc2md.filesToFile", function () {

    let jsdoc2mdTask;
    let grunt;
    let renderSpy;
    let warnSpy;
    let mkdirSpy;

    beforeEach(function () {

      renderSpy = function () {
        renderSpy.calls.push([...arguments]);
        return Promise.resolve("done");
      };
      renderSpy.calls = [];

      warnSpy = function (msg) {
        warnSpy.calls.push(msg);
      };
      warnSpy.calls = [];

      mkdirSpy = function (dir) {
        mkdirSpy.calls.push(dir);
      };
      mkdirSpy.calls = [];

      grunt = {
        file: {
          mkdir: mkdirSpy
        },
        log: {
          warn: warnSpy
        }
      };

      jsdoc2mdTask = proxyquire("../../lib/tasks/jsdoc2md.js", {});
      jsdoc2mdTask.render = renderSpy;
    });

    it("should export function", function () {
      assert.ok(jsdoc2mdTask.filesToFile, "'filesToFile' should be defined");
      expect(jsdoc2mdTask.filesToFile).to.be.a("function");
    });

    it("should return Promise", function () {
      const result = jsdoc2mdTask.filesToFile(
        grunt,
        {},
        { src: ["a.js"], dest: "out/file.md" },
        {}
      );

      expect(result).to.be.a(Promise);
    });

    it("should warn and resolve if src is missing", async function () {
      const result = await jsdoc2mdTask.filesToFile(
        grunt,
        {},
        { src: null, dest: "out/file.md" },
        {}
      );

      expect(warnSpy.calls.length).to.be(1);
      expect(renderSpy.calls.length).to.be(0);
      expect(result).to.be(true);
    });

    it("should create destination directory", async function () {
      const file = { src: ["a.js"], dest: "out/file.md" };

      await jsdoc2mdTask.filesToFile(grunt, {}, file, {});

      expect(mkdirSpy.calls.length).to.be(1);
      expect(mkdirSpy.calls[0]).to.be(path.dirname(file.dest));
    });

    it("should clone options and not mutate original object", async function () {
      const file = { src: ["a.js"], dest: "out/file.md" };
      const options = { foo: "bar" };

      await jsdoc2mdTask.filesToFile(grunt, {}, file, options);

      expect(options).to.eql({ foo: "bar" });
      expect(renderSpy.calls.length).to.be(1);

      const passedOptions = renderSpy.calls[0][2];
      expect(passedOptions).to.not.be(options);
    });

    it("should set options.files correctly", async function () {
      const file = { src: ["a.js", "b.js"], dest: "out/file.md" };
      const options = { foo: "bar" };

      await jsdoc2mdTask.filesToFile(grunt, {}, file, options);

      const passedOptions = renderSpy.calls[0][2];

      expect(passedOptions.files).to.eql(["a.js", "b.js"]);
    });

    it("should call render with correct parameters", async function () {
      const file = { src: ["a.js"], dest: "out/file.md" };
      const options = { foo: "bar" };

      await jsdoc2mdTask.filesToFile(grunt, { name: "task" }, file, options);

      expect(renderSpy.calls.length).to.be(1);

      const args = renderSpy.calls[0];

      expect(args[0]).to.be(grunt);
      expect(args[1]).to.have.property("name", "task");
      expect(args[3]).to.eql({ file: file.dest });
    });

  });

})();