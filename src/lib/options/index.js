/**
 *	lib/options/index.js: grunt-jsdoc2md/options
 *
 *  @module grunt-jsdoc2md/options
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
 *  Get task/target options
 *
 *  @see    Function [getOptions]{@link jsdoc2md.md#~getOptions}
 *          published by module jsdoc2md for a detailed function description.
 *
 *  @function module:grunt-jsdoc2md/options.get
 *  @param    {grunt}       grunt       - Grunt module
 *  @param    {grunt.task}  task        - The task which currently is run
 *  @returns  {Object}      a superposition of default options and those read
 *                          from grunts configuration.
 */
module.exports.get = jsdoc2md.getOptions;
