/**
 *  © 2020, db-developer.
 *  Licensed under the MIT license.
 */

// Note: This is used for running tests only!
module.exports = function ( grunt, options ) {
  return {
    target0: {
      // multiple source files to directory with multiple markdown files
      src: "src/lib/**/*.js",
      dest: "docs/api/",
      options: {
        index:  {
          dest:     "docs/api.index.md",
          template: undefined
        }
      }
    },
    target1: {
      // multiple source files to directory with multiple markdown files
      src: "src/lib/**/*.js",
      dest: "src/test/tmp/",
      options: {
        index:  {
          dest:     "src/test/tmp/target1/api.md",
          template: undefined
        }
      }
    },
    target2: {
      options: {
        index:  {
          dest:     "src/test/tmp/target2/api.md",
          template: "src/test/templates/api.hbs" // test if templating works
        }
      },
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
      options: {
        index:  false // test if setting index to false works
      },
      files: [
        // single source file to single markdown file
        { src: 'src/lib/tasks/jsdoc2md.js',   dest: 'src/test/tmp/api/tofile/6/jsdoc2md.md'       },
        // missing source file ... producing no output but a warning message
        { src: 'src/does.not.exist.js',       dest: 'src/test/tmp/api/tofile/7/missing.src.md'    },
        // multiple source files to single (aggregated) markdown file
        { src: 'src/lib/**/*.js',             dest: 'src/test/tmp/api/tofile/8/aggregated.api.md' },
        // multiple source files to directory creating multiple markdown files
        { src: 'src/lib/**/*.js',             dest: 'src/test/tmp/api/tofile/9/' },
        // multiple source files to directory creating multiple markdown files
        { src: 'src/test/templates/**/*.js',  dest: 'src/test/tmp/api/tofile/10/' }
      ]
    },
    target4: { // test settings without options
      files: [
        // single source file to single markdown file
        { src: 'src/lib/tasks/jsdoc2md.js',   dest: 'src/test/tmp/api/tofile/11/jsdoc2md.md'       },
        // missing source file ... producing no output but a warning message
        { src: 'src/does.not.exist.js',       dest: 'src/test/tmp/api/tofile/12/missing.src.md'    },
        // multiple source files to single (aggregated) markdown file
        { src: 'src/lib/**/*.js',             dest: 'src/test/tmp/api/tofile/13/aggregated.api.md' },
        // multiple source files to directory creating multiple markdown files
        { src: 'src/lib/**/*.js',             dest: 'src/test/tmp/api/tofile/14/' },
        // multiple source files to directory creating multiple markdown files
        { src: 'src/test/templates/**/*.js',  dest: 'src/test/tmp/api/tofile/15/' }
      ]
    },
    target5: {
      dest: "build",
      files: [
        { src: 'src/lib/constants.js' },
        { src: 'src/**/*.js' }
      ]
    }
  };
};
