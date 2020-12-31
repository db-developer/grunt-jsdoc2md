/**
 *  © 2020, db-developer.
 *  Licensed under the MIT license.
 */

module.exports = function ( grunt, options ) {
  return {
    build: {
      src: [ `${ options.BUILDDIR }/` ]
    },
    coverage: {
      src: [ `${ options.COVERAGEDIR }/`, `${ options.TMPDIR }/` ]
    },
    dist: {
      src: [ `${ options.DISTDIR }/*.tgz` ]
    }
  };
};
