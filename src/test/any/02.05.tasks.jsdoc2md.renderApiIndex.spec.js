/**
 *  src/test/any/02.05.tasks.jsdoc2md.renderApiIndex.spec.js
 *
 *  Tests for module.exports.renderApiIndex in lib/tasks/jsdoc2md.js
 *
 *  Focus:
 *  - Function exists and is callable
 *  - Calls flattenTree and assigns options.data
 *  - Uses default template if none provided
 *  - Reads template file if provided
 *  - Creates destination directory if required
 *  - Calls jsdoc2md.render with correct options
 *  - Writes output file
 *  - Logs success message
 *  - Propagates render errors (fail-fast)
 */

"use strict";

const assert = require("node:assert");
const expect = require("expect.js");

const path = require("node:path");
const proxyquire = require("proxyquire");

( async function() {

  describe("02.05.tasks.jsdoc2md.renderApiIndex", function () {

    let jsdoc2mdTask;
    let grunt;
    let flattenSpy;
    let renderSpy;
    let writeSpy;
    let readSpy;
    let mkdirSpy;
    let logOkSpy;

    beforeEach(function () {

      flattenSpy = async function () {
        return ["flattened"];
      };

      renderSpy = function (options) {
        renderSpy.calls.push(options);
        return Promise.resolve("OUTPUT");
      };
      renderSpy.calls = [];

      writeSpy = function (file, content, options) {
        writeSpy.calls.push({ file, content, options });
        return Promise.resolve();
      };
      writeSpy.calls = [];

      readSpy = function (file) {
        readSpy.calls.push(file);
        return "TEMPLATE_CONTENT";
      };
      readSpy.calls = [];

      mkdirSpy = function (dir) {
        mkdirSpy.calls.push(dir);
      };
      mkdirSpy.calls = [];

      logOkSpy = function (msg) {
        logOkSpy.calls.push(msg);
      };
      logOkSpy.calls = [];

      const gruntMock = {
        file: {
          read: readSpy,
          mkdir: mkdirSpy
        },
        log: {
          ok: logOkSpy
        },
        fail: {
          fatal: function (err) {
            throw err;
          }
        }
      };

      const fsMock = {
        promises: {
          writeFile: writeSpy
        }
      };

      jsdoc2mdTask = proxyquire("../../lib/tasks/jsdoc2md.js", {
        "jsdoc-to-markdown": {
          render: renderSpy
        },
        "node:fs": fsMock
      });

      // override flattenTree directly
      jsdoc2mdTask.flattenTree = flattenSpy;

      grunt = gruntMock;
    });

    it("should export function", function () {
      assert.ok(jsdoc2mdTask.renderApiIndex, "'renderApiIndex' should be defined");
      expect(jsdoc2mdTask.renderApiIndex).to.be.a("function");
    });

    it("should call flattenTree and assign options.data", async function () {
      const options = {
        index: { dest: "out/api.md" }
      };

      await jsdoc2mdTask.renderApiIndex(grunt, {}, {}, options, {});

      expect(renderSpy.calls.length).to.be(1);
      expect(renderSpy.calls[0].data).to.eql(["flattened"]);
    });

    it("should use default template if none provided", async function () {
      const options = {
        index: { dest: "out/api.md" }
      };

      await jsdoc2mdTask.renderApiIndex(grunt, {}, {}, options, {});

      expect(renderSpy.calls[0].template).to.be("{{>api}}");
    });

    it("should read template file if provided", async function () {
      const options = {
        index: {
          dest: "out/api.md",
          template: "tmpl.hbs"
        }
      };

      await jsdoc2mdTask.renderApiIndex(grunt, {}, {}, options, {});

      expect(readSpy.calls.length).to.be(1);
      expect(renderSpy.calls[0].template).to.be("TEMPLATE_CONTENT");
    });

    it("should create destination directory if needed", async function () {
      const options = {
        index: { dest: "out/api.md" }
      };

      await jsdoc2mdTask.renderApiIndex(grunt, {}, {}, options, {});

      expect(mkdirSpy.calls.length).to.be(1);
      expect(mkdirSpy.calls[0]).to.be("out");
    });

    it("should not create directory if basedir is '.'", async function () {
      const options = {
        index: { dest: "api.md" }
      };

      await jsdoc2mdTask.renderApiIndex(grunt, {}, {}, options, {});

      expect(mkdirSpy.calls.length).to.be(0);
    });

    it("should write output file", async function () {
      const options = {
        index: { dest: "out/api.md" }
      };

      await jsdoc2mdTask.renderApiIndex(grunt, {}, {}, options, {});

      expect(writeSpy.calls.length).to.be(1);
      expect(writeSpy.calls[0].file).to.be("out/api.md");
      expect(writeSpy.calls[0].content).to.be("OUTPUT");
    });

    it("should log success message", async function () {
      const options = {
        index: { dest: "out/api.md" }
      };

      await jsdoc2mdTask.renderApiIndex(grunt, {}, {}, options, {});

      expect(logOkSpy.calls.length).to.be(1);
      expect(logOkSpy.calls[0]).to.contain("indexing");
    });

    it("should propagate render errors (fail-fast)", async function () {
      renderSpy = function () {
        return Promise.reject(new Error("render fail"));
      };

      jsdoc2mdTask = proxyquire("../../lib/tasks/jsdoc2md.js", {
        "jsdoc-to-markdown": {
          render: renderSpy
        }
      });

      jsdoc2mdTask.flattenTree = flattenSpy;

      let error;
      try {
        await jsdoc2mdTask.renderApiIndex(grunt, {}, {}, {
          index: { dest: "out/api.md" }
        }, {});
      }
      catch (e) {
        error = e;
      }

      expect(error).to.be.an(Error);
      expect(error.message).to.be("render fail");
    });

  });

})();