/**
 *  © 2020, db-developer.
 *  Licensed under the MIT license.
 */

module.exports = function ( grunt, options ) {
  return {
    options: {
      templates: {
        pkgjson:  "package.json",
      }
    },
    build: {
      template:   "pkgjson",
      dest:       `${ options.BUILDDIR }/package.json`,
      merge: {
        "peerDependencies": undefined,
        "devDependencies":  undefined
      }
    }
  }
};
