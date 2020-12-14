/**
 *  © 2020, db-developer.
 *  Licensed under the MIT license.
 */
const path        = require( "path" );

const ESLINT      = "eslint";
const ESLINTFILE  = `.${ ESLINT }rc.js`;
const GRUNTFILE   = "gruntfile.js";

module.exports = function ( grunt, options ) {

  return {
    options: {
      configFile: path.join( options.CONFDIR, ESLINT, ESLINTFILE )
    },
    target: [
      GRUNTFILE,
      `${ options.LIBDIR }/**/*.js`
    ]
  }
};
