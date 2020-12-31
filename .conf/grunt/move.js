/**
 *  © 2020, db-developer.
 *  Licensed under the MIT license.
 */
const path      = require( "path" );

const TGZSUFFIX = "*.tgz";

module.exports  = function ( grunt, options ) {
  const PKGSDIR = path.join( "..", "..", "_packages_" );

  return {
    distribute: {
      src:  TGZSUFFIX,
      dest: `${ options.DISTDIR }/`
    }
  };
};
