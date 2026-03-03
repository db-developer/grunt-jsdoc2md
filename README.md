[![npm version](https://img.shields.io/npm/v/grunt-jsdoc2md?color=blue)](https://www.npmjs.com/package/grunt-jsdoc2md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![jsdoc](https://img.shields.io/static/v1?label=jsdoc&message=%20api%20&color=blue)](https://jsdoc.app/)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.svg)](https://gruntjs.com/)
[![dependencies](https://img.shields.io/librariesio/release/npm/grunt-jsdoc2md)](https://libraries.io/)
![Build & Test](https://github.com/db-developer/grunt-jsdoc2md/actions/workflows/ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/db-developer/grunt-jsdoc2md/branch/master/graph/badge.svg)](https://codecov.io/gh/db-developer/grunt-jsdoc2md)


[BOTTOM](#purpose) [AI](AI.md) [CHANGELOG](CHANGELOG.md) [LICENSE](LICENSE)

# grunt-jsdoc2md

Generate structured Markdown API documentation from JSDoc using
**jsdoc-to-markdown**,\
with deterministic tree rendering and optional automatic API index
generation.

------------------------------------------------------------------------

## content

-   Usage (see further down this page)
    -   [Getting started guide](#getting-started)
    -   [Usage and examples](#usage)
    -   [Rendering modes](#rendering-modes)
    -   [API index generation](#api-index-generation)
    -   [Deterministic rendering
        semantics](#deterministic-rendering-semantics)
    -   Maybe look at the [projects config](.conf/grunt/jsdoc2md.js)?
-   Developers
    -   [Testing grunt-jsdoc2md](docs/grunt.md#testing)
    -   [Code coverage of tests for
        grunt-jsdoc2md](docs/grunt.md#code-coverage)
    -   [Build grunt-jsdoc2md from scratch](docs/grunt.md#building)
    -   [NPM integration of
        grunt-jsdoc2md](docs/grunt.md#npm_integration)
    -   [Frameworks used for testing, building,
        etc.](docs/frameworks.md)
    -   [API of package grunt-jsdoc2md](docs/api.index.md) (self
        generated with grunt-jsdoc2md)

[Changelog](CHANGELOG.md)\
[Details on AI assistance during development](AI.md)

------------------------------------------------------------------------

## Overview

`grunt-jsdoc2md` is a Grunt multitask that transforms one or more
JSDoc-annotated JavaScript source files into Markdown documentation.

The plugin adds structural capabilities on top of `jsdoc-to-markdown`:

-   Deterministic depth-first tree rendering
-   Automatic directory structure generation
-   Optional aggregated API index generation
-   Sequential fail-fast execution semantics
-   Integrated `dmd-readable` defaults

------------------------------------------------------------------------

## Requirements

-   Node.js \>= 20
-   Grunt \>= 1.x

------------------------------------------------------------------------

## Installation

``` bash
npm install grunt-jsdoc2md --save-dev
```

Load the plugin in your `Gruntfile.js`:

``` js
grunt.loadNpmTasks("grunt-jsdoc2md");
```

Run the task:

``` bash
grunt jsdoc2md
```

------------------------------------------------------------------------

## getting started

This guide assumes familiarity with npm and Grunt.

Minimal configuration example:

``` js
module.exports = function (grunt) {
  grunt.initConfig({
    jsdoc2md: {
      api: {
        src: "src/**/*.js",
        dest: "docs/api/"
      }
    }
  });

  grunt.loadNpmTasks("grunt-jsdoc2md");
};
```

Running `grunt jsdoc2md` generates Markdown documentation in
`docs/api/`.

------------------------------------------------------------------------

## usage

The plugin supports two execution modes depending on `dest`.

``` js
module.exports = function (grunt) {
  return {
    options: {
      // All jsdoc-to-markdown options are supported.
    },

    directoryExample: {
      src: "src/lib/**/*.js",
      dest: "docs/api/",
      options: {
        index: {
          dest: "docs/api.md"
          // template: "partials/api.hbs"
        }
      }
    },

    fileExample: {
      src: "src/lib/**/*.js",
      dest: "docs/aggregated-api.md"
    }
  };
};
```

------------------------------------------------------------------------

## Rendering modes

### Directory Mode

If `dest`:

-   already exists and is a directory, or
-   ends with `/` or `\`

each source file is rendered into a corresponding Markdown file.

A directory tree is constructed from the source paths.

Example:

    src/lib/index.js
    src/lib/utils/helper.js

Produces:

    docs/api/index.md
    docs/api/utils/helper.md

Rendering is:

-   Depth-first
-   Strictly sequential per node
-   Deterministic in output order

Optional index generation is supported.

------------------------------------------------------------------------

### File Mode

If `dest` is a file path, all source files are rendered into a single
aggregated Markdown file.

No directory tree is created.

------------------------------------------------------------------------

## API index generation

If `options.index !== false`, an aggregated API index file is generated.

``` js
options: {
  index: {
    dest: "docs/api.md",
    template: "partials/api.hbs" // optional
  }
}
```

Behavior:

-   All rendered fileset data is aggregated
-   A template is applied
-   Default template: `{{>api}}`
-   Rendering is deterministic
-   Fail-fast on error

If `options.index === false`, no index file is created.

------------------------------------------------------------------------

## Deterministic rendering semantics

The plugin enforces:

-   Sequential file rendering within each node
-   Depth-first tree traversal
-   Stable aggregation order
-   Fail-fast behavior on errors

This ensures reproducible documentation output across environments.

------------------------------------------------------------------------

## Error handling

-   Missing `src` → warning
-   Rendering failure → task failure
-   Index generation failure → task failure

No partial recovery is attempted.

------------------------------------------------------------------------

## Notes

Handlebars may cache compiled templates during development. If template
changes are not reflected, clear your system temp directory.

[TOP](#grunt-jsdoc2md) [AI](AI.md) [CHANGELOG](CHANGELOG.md) [LICENSE](LICENSE)