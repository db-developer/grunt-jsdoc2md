/**
 *	index.js: grunt-jsdoc2md/options
 *
 *  @module grunt-jsdoc2md/options
 *
 *//*
 *  © 2020, slashlib.org.
 *
 *  tasks/index.js  is  distributed  WITHOUT ANY WARRANTY;  without even the
 *  implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 *//* eslint-disable-next-line */
"use strict";

/**
 *  Moduletable
 *  @ignore
 */
const _m = {
  jsdoc2md:    require( "./jsdoc2md" )
};

/**
 *  Stringtable
 *  @ignore
 */
const _STRINGS = {
  GET:        "get"
};

/* eslint-disable */
// Module exports:
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
Object.defineProperty( module.exports, _STRINGS.GET,  {
       value:    _m.jsdoc2md.getOptions,
       writable: false, enumerable: true, configurable: false });
/* eslint-enable */
