/**
 *  © 2020, db-developer.
 *  Licensed under the MIT license.
 */
const GRUNTFILE   = "gruntfile.js";

module.exports = function ( grunt, options ) {
 
  return {
    options: {
      overrideConfigFile: ".eslintrc.js"
    },
    target: [
      GRUNTFILE,
      `${ options.LIBDIR }/**/*.js`
    ]
  }
}
