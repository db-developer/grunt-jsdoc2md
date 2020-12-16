/**
 *  © 2020, db-developer.
 *  Licensed under the MIT license.
 */

module.exports = function ( grunt, options ) {
  return {
    all: {
      options: {
        mode:   0777,
        create: [
          options.BUILDDIR,
          options.DISTDIR,
          options.TMPDIR
        ]
      }
    }
  }
};
