# grunt-jsdoc2md

Generate markdown api documentation from jsdoc.  

[![npm version](https://img.shields.io/npm/v/grunt-jsdoc2md?color=blue)](https://www.npmjs.com/package/grunt-jsdoc2md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![jsdoc](https://img.shields.io/static/v1?label=jsdoc&message=%20api%20&color=blue)](https://jsdoc.app/)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.svg)](https://gruntjs.com/)
[![codecov](https://codecov.io/gh/db-developer/grunt-jsdoc2md/branch/master/graph/badge.svg)](https://codecov.io/gh/db-developer/grunt-jsdoc2md)
[![Build Status](https://travis-ci.com/db-developer/grunt-jsdoc2md.svg?branch=master)](https://travis-ci.com/db-developer/grunt-jsdoc2md)
[![dependencies](https://david-dm.org/db-developer/grunt-jsdoc2md.svg)](https://david-dm.org/)

## content ##

* Usage (see further down this page)
  * [Getting started guide](#getting-started)
  * [Usage and examples](#usage)
  * Maybe look at the [projects config](.conf/grunt/jsdoc2md.js)?

* Developers
  * [Testing grunt-jsdoc2md](docs/grunt.md#testing)
  * [Code coverage of tests for grunt-jsdoc2md](docs/grunt.md#code-coverage)
  * [Build grunt-jsdoc2md from scratch](docs/grunt.md#building)
  * [NPM integration of grunt-jsdoc2md](docs/grunt.md#npm_integration)
  * [Frameworks used for testing, building, etc.](docs/frameworks.md)
  * [API of package grunt-jsdoc2md](docs/api.md) (self generated with grunt-jsdoc2md)

## getting started ##

This guide assumes, that you are familiar with the use of [npm](https://npmjs.com "Homepage of npm") and [grunt](https://gruntjs.com "Homepage of grunt").  
The plugin can be installed by the following command:

<code>npm install grunt-jsdoc2mds --save-dev</code>

Once installed, the plugin may be loaded from within your gruntfile.  

Setup the task configuration as described below (see usage) and run the task:  

<code>grunt jsdoc2md</code>

Of cause, the task can be integrated into any complex build process.

## usage ##

Basically this module does the same as [grunt-jsdoc-to-markdown](https://www.npmjs.com/package/grunt-jsdoc-to-markdown) ... with additions:

1. Internal use of dmd plugin [dmd-readable](https://www.npmjs.com/package/dmd-readable) to make things more ... readable :-)
2. In case multiple markdown files are created into a directory tree, an index file is created, to link the outputfiles together.

```javascript
// from jsdoc2md.js for use with load-grunt-config

module.exports = function ( grunt, options ) {
  return {
    options: {
      // options to use with every target
      // basically all options, which are accepted by
      // 'jsdoc-to-markdown', can be added here.
    },
    target1: {
      // multiple source files to directory with multiple markdown files
      src: "src/lib/**/*.js",         // glob which will resolve to multiple sourcefiles
      dest: "docs/api/",              // destination 'directory' (defined by ending slash)
                                      // ... this is where the markdown files will be created.
      options: {                      // options to use with 'target0'
        index:  {                     // create an index file
          dest:     "docs/api.md"     // name it 'api.md' and place it in the docs directory.
          // template: "partials/api.hbs"   // use the named template to create the index file.
        }
      }
    },
    target2: {
      files: [
        // single source file to single markdown file
        { src: 'src/lib/tasks/jsdoc2md.js',   dest: 'src/test/tmp/api/tofile/1/jsdoc2md.md'       },
        // missing source file ... producing no output but a warning message
        { src: 'src/does.not.exist.js',       dest: 'src/test/tmp/api/tofile/2/missing.src.md'    },
        // multiple source files to single (aggregated) markdown file
        { src: 'src/lib/**/*.js',             dest: 'src/test/tmp/api/tofile/3/aggregated.api.md' },
        // multiple source files to directory creating multiple markdown files
        { src: 'src/lib/**/*.js',             dest: 'src/test/tmp/api/tofile/4/' },
        // multiple source files to directory creating multiple markdown files
        { src: 'src/test/templates/**/*.js',  dest: 'src/test/tmp/api/tofile/5/' }
      ]
    }
  };
};
```
