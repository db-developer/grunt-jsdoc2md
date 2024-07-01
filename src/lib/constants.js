/**
 *	constants.js:  grunt-jsdoc2md
 *
 *  @module grunt-jsdoc2md/constants
 *
 *//*
 *  © 2020, slashlib.org.
 *
 *  constants.js  is  distributed  WITHOUT  ANY WARRANTY;  without even  the
 *  implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 */
"use strict";

/**
 *  Module initializer
 *  @ignore
 */
const _STRINGS = {
  PROPERTY_TASKNAME_JSDOC2MD:   "TASKNAME_JSDOC2MD",
  PROPERTY_TASKDESC_JSDOC2MD:   "TASKDESCRIPTION_JSDOC2MD",
  TASKNAME_JSDOC2MD:            "jsdoc2md",
  TASKDESCRIPTION_JSDOC2MD:     "create markdown from jsdoc"
};

// Module exports:
Object.defineProperty( module.exports, _STRINGS.PROPERTY_TASKNAME_JSDOC2MD, {
  value:    _STRINGS.TASKNAME_JSDOC2MD,
  writable: false, enumerable: true, configurable: false });
Object.defineProperty( module.exports, _STRINGS.PROPERTY_TASKDESC_JSDOC2MD, {
  value:    _STRINGS.TASKDESCRIPTION_JSDOC2MD,
  writable: false, enumerable: true, configurable: false });
