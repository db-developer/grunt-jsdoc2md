/**
 *  src/test/any/02.02.tasks.jsdoc2md.render.spec.js
 *
 *  Tests for module.exports.render in lib/tasks/jsdoc2md.js
 *
 *  Focus:
 *  - Function exists and is callable
 *  - Handles normal fileset
 *  - Handles undefined, null, and invalid options/fileset
 *  - Logs and fail.fatal behavior
 *  - Interacts correctly with grunt.file and grunt.log
 */
"use strict";

const assert = require("node:assert");
const expect = require("expect.js");

// Mock direkt vor Modulimport
const fakeJsdoc2md = {
  getTemplateData: async () => [{ meta: {} }],
  render: async () => "rendered content"
};

const path   = require("node:path");
const fs     = require("node:fs");

const gruntMockModule = require("./__mocks__/grunt");

// Modul-Laden mit gemocktem _m
const proxyquire = require("proxyquire");
const jsdoc2mdTask = proxyquire("../../lib/tasks/jsdoc2md.js", {
  "../log": require("../../lib/log"),
  "../options": require("../../lib/options"),
  "jsdoc-to-markdown": fakeJsdoc2md,
  "node:fs": fs,
  "node:path": path
});

( async function() {

  describe("02.02.tasks.jsdoc2md.render", function () {

    let grunt;

    beforeEach(function () {
      gruntMockModule.resetState();
      grunt = gruntMockModule.apply();
    });

    afterEach(function () {
      gruntMockModule.restore();
    });

    it( "02.02.tasks.jsdoc2md.render.shouldExportFunction", function () {
        assert.ok(jsdoc2mdTask.render, "'render' should be defined");
        expect(jsdoc2mdTask.render).to.be.a("function");
    });

    it( "02.02.tasks.jsdoc2md.render.validFileset", async function () {
        const fileset = { file: "test.md", dest: "test.md", path: "rel/path" };
        const options = { files: ["src/file.js"], template: "{{>api}}" };
        const fakeTask = {};

        await jsdoc2mdTask.render(grunt, fakeTask, options, fileset);

        expect(gruntMockModule.state.logs.ok.length).to.be.greaterThan(0);
        expect(gruntMockModule.state.logs.ok[0]).to.match(/writing/);

        // Datei schreiben simulieren oder löschen, falls Mock fs echte Datei erstellt
        if (fs.existsSync(fileset.file)) fs.rmSync(fileset.file, { force: true });
    });

    it( "02.02.tasks.jsdoc2md.render.invalidFileset", async function () {
        const fakeTask = {};
        const badValues = [undefined, null, "Bullshit"];

        for (const val of badValues) {
          await assert.rejects(
            async () => jsdoc2mdTask.render(grunt, fakeTask, { files: [] }, val),
            /./,
            `Should reject for fileset=${val}`
          );
        }
    });

    it( "02.02.tasks.jsdoc2md.render.undefinedOptions", async function () {
        const errorJsdoc = {
          getTemplateData: async () => [{ meta: {} }],
          render: async () => "rendered"
        };

        const jsdoc2md = proxyquire( "../../lib/tasks/jsdoc2md.js", {
          "jsdoc-to-markdown": errorJsdoc,
          "node:fs": fs,
          "node:path": path
        });

        const fileset  = { file: "test2.md", dest: "test2.md", path: "rel/path2" };
        const fakeTask = {};

        await assert.rejects(
          async () => jsdoc2md.render( grunt, fakeTask, undefined, fileset ),
          TypeError
        );
    });
  });
})();
