/**
 *  © 2020, db-developer.
 *  Licensed under the MIT license.
 */

module.exports = function ( grunt, options ) {
  return {
    options: {
      EOF:  true,
      templates: {
        pkgjson:  "package.json"
      }
    },
    build: {
      template:   "pkgjson",
      dest:       `${ options.BUILDDIR }/package.json`,
      merge: {
        "main":             "tasks/tasks.js",
        "scripts":          undefined,
        "peerDependencies": undefined,
        "devDependencies":  undefined
      }
    }
  }
};
