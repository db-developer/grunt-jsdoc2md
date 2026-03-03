/**
 *	lib/tasks/index.js: grunt-jsdoc2md/tasks
 *
 *  @module grunt-jsdoc2md/tasks
 *
 *//*
 *  © 2020, db-developer.
 *
 *  Distributed  WITHOUT  ANY WARRANTY;  without  even the  implied
 *  warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */
"use strict";

const jsdoc2md = require( "./jsdoc2md" );

/**
 *  Register a multitask for 'jsdoc2md'.
 *
 *  @see    Function [registerMultiTask]{@link jsdoc2md.md#.registerMultiTask}
 *          published by module jsdoc2md for a detailed function description.
 *
 *  @function module:grunt-jsdoc2md/tasks.registerMultiTask
 *  @param  {grunt} grunt
 */
module.exports.registerMultiTask = jsdoc2md.registerMultiTask;
