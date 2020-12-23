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
const _STRINGS = {
  GETINDEXOPTIONS:  "getIndexOptions",
  GETOPTIONS:       "getOptions",
  GETPLUGINS:       "getPlugins",
  TYPE_OBJECT:      "object"
};

/**
 *  Index options will be used if documentation
 *  is written to multiple files and a resulting
 *  index should be created to link them.
 *
 *  Index creation can be prevented by setting
 *  the 'index' property (which defaults to an
 *  object) to false.
 *
 *  @ignore
 */
const _INDEXOPTIONS = {
  dest:     "api.md",
  template: undefined
};

/**
 *  dmd plugins used by grunt plugin
 *  @ignore
 */
const _PLUGINS = [ "dmd-readable", "dmd-grunt-jsdoc2md" ];

/**
 *  Returns options for generating api indexes which apply only, if a number
 *  of markdowns have been generated for sourcefiles and a central index is
 *  required for linking them together.
 *
 *  @param    {Object}  options read from grunts task+target configuration.
 *  @returns  {Object}  a superposition of default values for index options
 *                      and index options read for grunt (which always win).
 */
function getIndexOptions( options ) {
  let retval = undefined;
  if ( options === false ) { return false; }
  else retval = JSON.parse( JSON.stringify( _INDEXOPTIONS ));

  if ( typeof( options ) === _STRINGS.TYPE_OBJECT ) {
       return Object.assign( retval, options );
  }
  else return retval;
}

/**
 *  Returns the dmd plugins to be used by the grunt plugin.
 *
 *  @param    {Object}  options           from grunts task+target configuration.
 *  @param    {Array}   [options.plugin]  an array of strings which hold the dmd
 *                                        plugin modules.
 *  @return   {Array} of strings, which hold the dmd plugin modules to use.
 */
function getPlugins( options ) {
  return ((( options ) && ( options.plugin )) ? [ ...options.plugin, ..._PLUGINS ] : [ ..._PLUGINS ]);
}

/**
 *  Returns options to be used by currently running task/target.
 *  Any options provided by grunt will be enriched by the plugins
 *  default values.
 *
 *  @param    {grunt}       grunt       - Grunt module
 *  @param    {grunt.task}  task        - The task which currently is run
 *  @returns  {Object}      a superposition of default options and those read
 *                          from grunts configuration (the later always win)
 */
function getOptions( grunt, task ) {
  let    options        = task.options() || /* istanbul ignore next */ { };
         options        = JSON.parse( JSON.stringify( options ));
         options.index  = getIndexOptions( options.index );
         options.plugin = getPlugins( options );

  return options;
}

/* eslint-disable */
// Module exports:
Object.defineProperty( module.exports, _STRINGS.GETINDEXOPTIONS,  {
       value:    getIndexOptions,
       writable: false, enumerable: true, configurable: false });
Object.defineProperty( module.exports, _STRINGS.GETOPTIONS,       {
       value:    getOptions,
       writable: false, enumerable: true, configurable: false });
Object.defineProperty( module.exports, _STRINGS.GETPLUGINS,       {
       value:    getPlugins,
       writable: false, enumerable: true, configurable: false });
/* eslint-enable */
