/**
 *  © 2021, db-developer.
 *  Licensed under the MIT license.
 */

module.exports = function ( grunt, options ) {
  return {
    always: {
      options: {
        checkoutdated: {
          ignore: {
            packages:  [ "webpack" ]
          },
          columns:     [ "name" , "current", "wanted", "latest" ]
        }
      }
    }
  };
};
