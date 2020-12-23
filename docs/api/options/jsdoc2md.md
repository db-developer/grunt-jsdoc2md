
<br><a name="module_grunt-jsdoc2md/options/jsdoc2md"></a>

## grunt-jsdoc2md/options/jsdoc2md
> options/jsdoc2md.js: grunt-jsdoc2md


* [grunt-jsdoc2md/options/jsdoc2md](#module_grunt-jsdoc2md/options/jsdoc2md)
    * [~getIndexOptions(options)](#module_grunt-jsdoc2md/options/jsdoc2md..getIndexOptions) ⇒ <code>Object</code>
    * [~getPlugins(options)](#module_grunt-jsdoc2md/options/jsdoc2md..getPlugins) ⇒ <code>Array</code>
    * [~getOptions(grunt, task)](#module_grunt-jsdoc2md/options/jsdoc2md..getOptions) ⇒ <code>Object</code>


<br><a name="module_grunt-jsdoc2md/options/jsdoc2md..getIndexOptions"></a>

### grunt-jsdoc2md/options/jsdoc2md~getIndexOptions(options) ⇒ <code>Object</code>
> Returns options for generating api indexes which apply only, if a number>  of markdowns have been generated for sourcefiles and a central index is>  required for linking them together.

**Returns**: <code>Object</code> - a superposition of default values for index options                     and index options read for grunt (which always win).  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | read from grunts task+target configuration. |


<br><a name="module_grunt-jsdoc2md/options/jsdoc2md..getPlugins"></a>

### grunt-jsdoc2md/options/jsdoc2md~getPlugins(options) ⇒ <code>Array</code>
> Returns the dmd plugins to be used by the grunt plugin.

**Returns**: <code>Array</code> - of strings, which hold the dmd plugin modules to use.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | from grunts task+target configuration. |
| [options.plugin] | <code>Array</code> | an array of strings which hold the dmd                                        plugin modules. |


<br><a name="module_grunt-jsdoc2md/options/jsdoc2md..getOptions"></a>

### grunt-jsdoc2md/options/jsdoc2md~getOptions(grunt, task) ⇒ <code>Object</code>
> Returns options to be used by currently running task/target.>  Any options provided by grunt will be enriched by the plugins>  default values.

**Returns**: <code>Object</code> - a superposition of default options and those read                         from grunts configuration (the later always win)  

| Param | Type | Description |
| --- | --- | --- |
| grunt | <code>grunt</code> | Grunt module |
| task | <code>grunt.task</code> | The task which currently is run |

