/**
 *	options/jsdoc2md.js: grunt-jsdoc2md
 *
 *  @module grunt-jsdoc2md/options/jsdoc2md
 *
 *//*
 *  © 2020, slashlib.org.
 *
 *  tasks/jsdoc2md.js  is distributed WITHOUT ANY WARRANTY; without even the
 *  implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 *//* eslint-disable-next-line */
"use strict";

/**
 *  Mapping of strings
 *  @ignore
 */
const _STRINGS =  {
  GETOPTIONS:       "getOptions"
};

/**
 *  Returns the plugins default option settings.
 *
 *  @export
 *  @returns {Object} The plugins default option settings.
 */
function getOptions() {
  return { };
}

/* eslint-disable */
// Module exports:
Object.defineProperty( module.exports, _STRINGS.GETOPTIONS,   {
       value:    getOptions,
       writable: false, enumerable: true, configurable: false });
/* eslint-enable */
