/**
 *  © 2024, db-developer.
 *  Licensed under the MIT license.
 */

module.exports = function ( grunt, options ) {
  return {
    pack: {
      options:{
        cmd: "pack",
        args: [ `./${ options.BUILDDIR }`, "--pack-destination", `./${ options.DISTDIR }` ]     
      }
    }
  };
};
