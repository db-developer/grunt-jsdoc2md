/**
 *  © 2020, db-developer.
 *  Licensed under the MIT license.
 */

// Note: This is used for running tests only!
module.exports = function ( grunt, options ) {
  return {
    test_and_coverage: {
      src: `./src/test/**/*.spec.js`,                 // test suite to run...
      options: {
        nyc: {
          coverage: {                                 // report nyc coverage results
            dir:          "dist/coverage",            // ... to folder
            reporter:     [ "html", "text-summary" ], // ... using reporters
            check:        true,
            perfile:      true,
            branches:     100,
            functions:    100,
            lines:        100,
            statements:   100
          },
          excludes:       [ "gruntfile.js", ".conf/**/*.js", "src/test/**/*.js" ],
          requires:       [ "grunt-nyc-mocha/scripts/sourcemapsupport" ]
        },
        mocha: {
          color:          true                        // force colored output
        }
      }
    }
  }
};
