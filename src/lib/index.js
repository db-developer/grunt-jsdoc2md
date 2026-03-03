/**
 *  lib/index.js: grunt-jsdoc2md
 * 
 *	Package interface of grunt-jsdoc2md<br />
 *  All static members of this module are available for 3rd party access.
 *
 *  @module grunt-jsdoc2md
 *
 *//*
 *  © 2020, db-developer.
 *
 *  Distributed  WITHOUT  ANY WARRANTY;  without  even the  implied
 *  warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */
"use strict";

const tasks = require( "./tasks" );

/**
 *  Register a multitask for 'jsdoc2md'.
 *
 *  @see    Function [registerMultiTask]{@link tasks/index.md#.registerMultiTask}
 *          published by module tasks for a detailed function description.
 *
 *  @function module:grunt-jsdoc2md.registerMultiTask
 *  @param  {grunt} grunt
 */
module.exports.registerMultiTask = tasks.registerMultiTask;
