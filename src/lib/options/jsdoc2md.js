/**
 *	lib/options/jsdoc2md.js: grunt-jsdoc2md
 *
 *  @module grunt-jsdoc2md/options/jsdoc2md
 *
 *//*
 *  © 2020, db-developer.
 *
 *  Distributed  WITHOUT  ANY WARRANTY;  without  even the  implied
 *  warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */
"use strict";

/**
 *  Default configuration for API index generation.
 *
 *  This object defines the options used when documentation is written
 *  to multiple files and a consolidated index file should be created
 *  to link all generated modules.
 *
 *  ------------------------------------------------------------------------
 *  Properties
 *  ------------------------------------------------------------------------
 *  @property {string} dest
 *    The filename of the generated API index Markdown file (default: "api.md").
 *
 *  @property {string|undefined} template
 *    Optional path to a custom Handlebars template for the index.
 *    If undefined, a default template is used.
 *
 *  ------------------------------------------------------------------------
 *  Usage Notes
 *  ------------------------------------------------------------------------
 *  - Index creation can be disabled by setting the `index` property to `false`.
 *  - This object is intended for internal use only.
 *
 *  @ignore
 */
const _INDEXOPTIONS = {
  dest:     "api.md",
  template: undefined
};

/**
 *  dmd plugins used by this grunt plugin
 *  @ignore
 */
const _PLUGINS = [ "dmd-readable", "dmd-grunt-jsdoc2md" ];

/**
 *  Compute effective API index options for documentation generation.
 *
 *  This function produces the configuration used when multiple Markdown files
 *  are generated and a central index file is required to link them.
 *
 *  ------------------------------------------------------------------------
 *  Behavior
 *  ------------------------------------------------------------------------
 *  - If `options` is `false`, index generation is disabled and `false` is returned.
 *  - Otherwise, a deep copy of the default index options (`_INDEXOPTIONS`) is
 *    created.
 *  - If `options` is an object, its properties override the defaults.
 *
 *  @param {Object|boolean} options
 *    Task-level index configuration read from Grunt. Can be `false` to disable
 *    index generation, or an object to override default options.
 *
 *  @returns {Object|boolean}
 *    Either `false` if index generation is disabled, or an object containing
 *    the effective index options with defaults merged and task-level overrides applied.
 */
module.exports.getIndexOptions = function getIndexOptions( options ) {
  let retval = undefined;
  if ( options === false ) { return false; }
  else retval = JSON.parse( JSON.stringify( _INDEXOPTIONS ));

  if ( typeof( options ) === "object" ) {
       return Object.assign( retval, options );
  }
  else return retval;
}

/**
 *  Determine the list of dmd plugins to be applied during rendering.
 *
 *  This function returns the set of plugins used by the Grunt jsdoc2md task,
 *  combining any user-specified plugins with the internal default plugins.
 *
 *  ------------------------------------------------------------------------
 *  Behavior
 *  ------------------------------------------------------------------------
 *  - If `options.plugin` is provided and is an array, its elements are prepended
 *    to the internal default plugin list.
 *  - If no user plugins are specified, only the internal default plugins (`_PLUGINS`)
 *    are used.
 *  - Returns a new array to avoid mutating the input or the internal defaults.
 *
 *  @param {Object} options
 *    Task-level configuration object from Grunt.
 *  @param {Array<string>} [options.plugin]
 *    Optional array of plugin module names to include before the default plugins.
 *
 *  @returns {Array<string>}
 *    Array of plugin module names to apply, including defaults and user-specified plugins.
 */
module.exports.getPlugins = function getPlugins( options ) {
  return ((( options ) && ( options.plugin )) ? [ ...options.plugin, ..._PLUGINS ] : [ ..._PLUGINS ]);
}

/**
 *  Compute the effective options for the currently executing Grunt task/target.
 *
 *  This function merges the task-level options provided via Grunt with
 *  internal defaults and derived values. It ensures that:
 *
 *    - Index options are normalized using `getIndexOptions`.
 *    - Plugin options are normalized using `getPlugins`.
 *    - The resulting object is a fresh copy to prevent mutation of the original
 *      Grunt task configuration.
 *
 *  @param {grunt} grunt
 *    The Grunt module instance, used to access task utilities and logging.
 *
 *  @param {grunt.task} task
 *    The currently executing Grunt task or target context.
 *
 *  @returns {Object}
 *    A fully normalized options object combining:
 *      - User-specified options from Grunt (take precedence)
 *      - Internal defaults (index and plugins)
 *      - Derived properties necessary for rendering and index generation
 */
module.exports.getOptions = function getOptions( grunt, task ) {
  let    options        = task.options() || /* istanbul ignore next */ { };
         options        = structuredClone( options );
         options.index  = module.exports.getIndexOptions( options.index );
         options.plugin = module.exports.getPlugins( options );

  return options;
}
