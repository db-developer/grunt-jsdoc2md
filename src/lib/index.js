/**
 *	Package interface of grunt-jsdoc2md<br />
 *  All static members of this module are available for 3rd party access.
 *
 *  @module grunt-jsdoc2md
 *
 *//*
 *  © 2020, slashlib.org.
 *
 *  index.js  is distributed WITHOUT ANY WARRANTY; without even the implied
 *  warranty  of  MERCHANTABILITY  or  FITNESS  FOR  A PARTICULAR  PURPOSE.
 *
 *//* eslint-disable-next-line */
"use strict";

/**
 *  Moduletable
 *  @ignore
 */
const _m = {
  tasks:  require( "./tasks" )
}

/**
 *  Stringtable
 *  @ignore
 */
const _STRINGS = {
  REGISTERMULTITASKJSDOC2MD:  "registerMultiTaskJSDoc2MD"
}

/* eslint-disable */
// Module exports:
/**
 *  Register a multitask for 'jsdoc2md'.
 *
 *  @see    Function [registerMultiTaskJSDoc2MD]{@link tasks/index.md#.registerMultiTaskJSDoc2MD}
 *          published by module tasks for a detailed function description.
 *
 *  @function module:grunt-jsdoc2md.registerMultiTaskJSDoc2MD
 *  @param  {grunt} grunt
 */
Object.defineProperty( module.exports, _STRINGS.REGISTERMULTITASKJSDOC2MD, {
       value:    _m.tasks.registerMultiTaskJSDoc2MD,
       writable: false, enumerable: true, configurable: false });
/* eslint-enable */
