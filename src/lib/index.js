/**
 *	index.js: grunt-jsdoc2md
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
 *  Module initializer
 *  @ignore
 */
const _m = {
  const:        require( "./constants"  ),
  tasks:        require( "./tasks"      )
}

/**
 *  @ignore
 */
const _STRINGS = {
  REGISTERMULTITASKJSDOC2MD:  "registerMultiTaskJSDoc2MD"
}

/**
 *  Registers the 'jsonfile' multitask.
 *
 *  @param  {grunt} grunt
 */
function registerMultiTaskJSDoc2MD( grunt ) {
  grunt.registerMultiTask( _m.const.TASKNAME_JSDOC2MD, _m.const.TASKDESCRIPTION_JSDOC2MD,
    /* istanbul ignore next */ function () {
      const task = this;
      const done = task.async();
      _m.tasks.runTaskJSDoc2MD( grunt, task )
              .then((       ) => { done(); },
                    ( error ) => { grunt.log.error( error ); done( false ); });
  });
}

/* eslint-disable */
// Module exports:
Object.defineProperty( module.exports, _STRINGS.REGISTERMULTITASKJSDOC2MD, {
       value:    registerMultiTaskJSDoc2MD,
       writable: false, enumerable: true, configurable: false });
/* eslint-enable */
