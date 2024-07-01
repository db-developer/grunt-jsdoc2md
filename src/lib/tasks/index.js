/**
 *	index.js: grunt-jsdoc2md/tasks
 *
 *  @module grunt-jsdoc2md/tasks
 *
 *//*
 *  © 2020, slashlib.org.
 *
 *  index.js  is distributed WITHOUT ANY WARRANTY; without even the implied
 *  warranty  of  MERCHANTABILITY  or  FITNESS  FOR  A PARTICULAR  PURPOSE.
 *
 */
"use strict";

/**
 *  Moduletyble
 *  @ignore
 */
const _m = {
  jsdoc2md: require( "./jsdoc2md" )
};

/**
*  Stringtable
 *  @ignore
 */
const _STRINGS = {
  REGISTERMULTITASKJSDOC2MD:  "registerMultiTaskJSDoc2MD"
};

// Module exports:
/**
 *  Register a multitask for 'jsdoc2md'.
 *
 *  @see    Function [registerMultiTaskJSDoc2MD]{@link jsdoc2md.md#.registerMultiTaskJSDoc2MD}
 *          published by module jsdoc2md for a detailed function description.
 *
 *  @function module:grunt-jsdoc2md/tasks.registerMultiTaskJSDoc2MD
 *  @param  {grunt} grunt
 */
Object.defineProperty( module.exports, _STRINGS.REGISTERMULTITASKJSDOC2MD, {
  value:    _m.jsdoc2md.registerMultiTaskJSDoc2MD,
  writable: false, enumerable: true, configurable: false });
