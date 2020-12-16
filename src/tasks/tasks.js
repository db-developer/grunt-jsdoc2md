/**
 *  © 2019, db-developer.
 *  Licensed under the MIT license.
 */
"use strict";

const lib = require( "../lib" );

module.exports = function( grunt ) {
  lib.registerMultiTaskJSDoc2MD( grunt );
};
