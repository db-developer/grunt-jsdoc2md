/**
 *  © 2020, db-developer.
 *  Licensed under the MIT license.
 */

// Note: This is used for running tests only!
module.exports = function ( grunt, options ) {
  return {
    target1: {
      // multiple source files to directory with multiple markdown files
      src: "src/lib/**/*.js",
      dest: "src/test/tmp"
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
    },
    target3: {
      dest: "build",
      files: [
          { src: 'src/lib/constants.js' },
          { src: 'src/**/*.js' }
      ]
    }
  };
};
