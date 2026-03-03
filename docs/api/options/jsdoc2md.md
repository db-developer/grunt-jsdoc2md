
<br><a name="module_grunt-jsdoc2md/options/jsdoc2md"></a>

## grunt-jsdoc2md/options/jsdoc2md
> lib/options/jsdoc2md.js: grunt-jsdoc2md


* [grunt-jsdoc2md/options/jsdoc2md](#module_grunt-jsdoc2md/options/jsdoc2md)
    * [.getIndexOptions(options)](#module_grunt-jsdoc2md/options/jsdoc2md.getIndexOptions) ⇒ <code>Object</code> \| <code>boolean</code>
    * [.getPlugins(options)](#module_grunt-jsdoc2md/options/jsdoc2md.getPlugins) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getOptions(grunt, task)](#module_grunt-jsdoc2md/options/jsdoc2md.getOptions) ⇒ <code>Object</code>


<br><a name="module_grunt-jsdoc2md/options/jsdoc2md.getIndexOptions"></a>

### grunt-jsdoc2md/options/jsdoc2md.getIndexOptions(options) ⇒ <code>Object</code> \| <code>boolean</code>
> Compute effective API index options for documentation generation.> >  This function produces the configuration used when multiple Markdown files>  are generated and a central index file is required to link them.> >  ------------------------------------------------------------------------>  Behavior>  ------------------------------------------------------------------------>  - If `options` is `false`, index generation is disabled and `false` is returned.>  - Otherwise, a deep copy of the default index options (`_INDEXOPTIONS`) is>    created.>  - If `options` is an object, its properties override the defaults.

**Returns**: <code>Object</code> \| <code>boolean</code> - Either `false` if index generation is disabled, or an object containing   the effective index options with defaults merged and task-level overrides applied.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code>, <code>boolean</code> | Task-level index configuration read from Grunt. Can be `false` to disable    index generation, or an object to override default options. |


<br><a name="module_grunt-jsdoc2md/options/jsdoc2md.getPlugins"></a>

### grunt-jsdoc2md/options/jsdoc2md.getPlugins(options) ⇒ <code>Array.&lt;string&gt;</code>
> Determine the list of dmd plugins to be applied during rendering.> >  This function returns the set of plugins used by the Grunt jsdoc2md task,>  combining any user-specified plugins with the internal default plugins.> >  ------------------------------------------------------------------------>  Behavior>  ------------------------------------------------------------------------>  - If `options.plugin` is provided and is an array, its elements are prepended>    to the internal default plugin list.>  - If no user plugins are specified, only the internal default plugins (`_PLUGINS`)>    are used.>  - Returns a new array to avoid mutating the input or the internal defaults.

**Returns**: <code>Array.&lt;string&gt;</code> - Array of plugin module names to apply, including defaults and user-specified plugins.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Task-level configuration object from Grunt. |
| [options.plugin] | <code>Array.&lt;string&gt;</code> | Optional array of plugin module names to include before the default plugins. |


<br><a name="module_grunt-jsdoc2md/options/jsdoc2md.getOptions"></a>

### grunt-jsdoc2md/options/jsdoc2md.getOptions(grunt, task) ⇒ <code>Object</code>
> Compute the effective options for the currently executing Grunt task/target.> >  This function merges the task-level options provided via Grunt with>  internal defaults and derived values. It ensures that:> >    - Index options are normalized using `getIndexOptions`.>    - Plugin options are normalized using `getPlugins`.>    - The resulting object is a fresh copy to prevent mutation of the original>      Grunt task configuration.

**Returns**: <code>Object</code> - A fully normalized options object combining:     - User-specified options from Grunt (take precedence)     - Internal defaults (index and plugins)     - Derived properties necessary for rendering and index generation  

| Param | Type | Description |
| --- | --- | --- |
| grunt | <code>grunt</code> | The Grunt module instance, used to access task utilities and logging. |
| task | <code>grunt.task</code> | The currently executing Grunt task or target context. |

