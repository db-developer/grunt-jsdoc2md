/**
 * tasks/tasks.js: grunt tasks
 *
 * @module tasks
 *
 *//*
 *  © 2020, db-developer.
 *
 *  Distributed  WITHOUT  ANY WARRANTY;  without  even the  implied
 *  warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */
"use strict";

const lib = require( "../lib" );

module.exports = function( grunt ) {
  lib.registerMultiTask( grunt );
};
