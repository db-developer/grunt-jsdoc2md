/**
 *  © 2020, db-developer.
 *  Licensed under the MIT license.
 */

module.exports = function ( grunt, options ) {
  return {
    npm_pack:  {
      command: "npm pack ./build"
    }
  }
};
