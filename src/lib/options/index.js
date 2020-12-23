/**
 *	options/index.js: grunt-jsdoc2md
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
 *  Module initializer
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
Object.defineProperty( module.exports, _STRINGS.GET,  {
       value:    _m.jsdoc2md.getOptions,
       writable: false, enumerable: true, configurable: false });
/* eslint-enable */
