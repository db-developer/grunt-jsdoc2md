
<br><a name="module_grunt-jsdoc2md/tasks/jsdoc2md"></a>

## grunt-jsdoc2md/tasks/jsdoc2md
> tasks/jsdoc2md.js: grunt-jsdoc2md


* [grunt-jsdoc2md/tasks/jsdoc2md](#module_grunt-jsdoc2md/tasks/jsdoc2md)
    * [~render(grunt, task, options, fileset)](#module_grunt-jsdoc2md/tasks/jsdoc2md..render)
    * [~renderTree(grunt, task, options, destination, tree)](#module_grunt-jsdoc2md/tasks/jsdoc2md..renderTree)
    * [~flattenTree()](#module_grunt-jsdoc2md/tasks/jsdoc2md..flattenTree)
    * [~renderApiIndex()](#module_grunt-jsdoc2md/tasks/jsdoc2md..renderApiIndex)
    * [~srcExists(grunt, file)](#module_grunt-jsdoc2md/tasks/jsdoc2md..srcExists) ⇒ <code>Boolean</code>
    * [~tree(sources)](#module_grunt-jsdoc2md/tasks/jsdoc2md..tree) ⇒ <code>Object</code>
    * [~reduce(dsttree)](#module_grunt-jsdoc2md/tasks/jsdoc2md..reduce) ⇒ <code>Object</code>
    * [~filesToFile(grunt, task, file, options)](#module_grunt-jsdoc2md/tasks/jsdoc2md..filesToFile) ⇒ <code>Promise</code>
    * [~get(grunt, task, file, options)](#module_grunt-jsdoc2md/tasks/jsdoc2md..get) ⇒ <code>Promise</code>
    * [~runTaskJSDoc2MD(grunt, task)](#module_grunt-jsdoc2md/tasks/jsdoc2md..runTaskJSDoc2MD) ⇒ <code>Promise</code>


<br><a name="module_grunt-jsdoc2md/tasks/jsdoc2md..render"></a>

### grunt-jsdoc2md/tasks/jsdoc2md~render(grunt, task, options, fileset)
> Render input file(s) to markdown file.


| Param | Type | Description |
| --- | --- | --- |
| grunt | <code>grunt</code> | Grunt module |
| task | <code>grunt.task</code> | The task which currently is run |
| options | <code>Object</code> | Options to use for rendering jsdoc to md |
| fileset | <code>Object</code> | Fileset |


<br><a name="module_grunt-jsdoc2md/tasks/jsdoc2md..renderTree"></a>

### grunt-jsdoc2md/tasks/jsdoc2md~renderTree(grunt, task, options, destination, tree)
> Render a tree of sources to a tree of destination directories


| Param | Type | Description |
| --- | --- | --- |
| grunt | <code>grunt</code> | Grunt module |
| task | <code>grunt.task</code> | The task which currently is run |
| options | <code>Object</code> | Options to use for rendering jsdoc to md |
| destination | <code>string</code> | Current destination dir to render files to |
| tree | <code>Object</code> | (Sub)tree of src/dst settings to render md files from |


<br><a name="module_grunt-jsdoc2md/tasks/jsdoc2md..flattenTree"></a>

### grunt-jsdoc2md/tasks/jsdoc2md~flattenTree()

<br><a name="module_grunt-jsdoc2md/tasks/jsdoc2md..renderApiIndex"></a>

### grunt-jsdoc2md/tasks/jsdoc2md~renderApiIndex()
> Note on debugging:


<br><a name="module_grunt-jsdoc2md/tasks/jsdoc2md..srcExists"></a>

### grunt-jsdoc2md/tasks/jsdoc2md~srcExists(grunt, file) ⇒ <code>Boolean</code>
> Return true, if file.src exists and is of type {Array(not empty)}

**Returns**: <code>Boolean</code> - true, if file.src exists and is of type {Array}(not empty);

| Param | Type | Description |
| --- | --- | --- |
| grunt | <code>grunt</code> | Grunt module |
| file | <code>Object</code> | A grunt file object |


<br><a name="module_grunt-jsdoc2md/tasks/jsdoc2md..tree"></a>

### grunt-jsdoc2md/tasks/jsdoc2md~tree(sources) ⇒ <code>Object</code>
> Build a destination tree from an array of sources.

**Returns**: <code>Object</code> - A tree of src/dst settings to render md files from.  
**Files:**: [
**Files:**: [

| Param | Type | Description |
| --- | --- | --- |
| sources | <code>Array.&lt;string&gt;</code> | An array of source files. |


<br><a name="module_grunt-jsdoc2md/tasks/jsdoc2md..reduce"></a>

### grunt-jsdoc2md/tasks/jsdoc2md~reduce(dsttree) ⇒ <code>Object</code>
> Reduce a destination tree. This will remove treelevels without source/destination

**Returns**: <code>Object</code> - A destination tree that usually is reduced by some levels.  

| Param | Type | Description |
| --- | --- | --- |
| dsttree | <code>Object</code> | tree of src/dst settings to render md files from |


<br><a name="module_grunt-jsdoc2md/tasks/jsdoc2md..filesToFile"></a>

### grunt-jsdoc2md/tasks/jsdoc2md~filesToFile(grunt, task, file, options) ⇒ <code>Promise</code>
> Take one ore more input files and create an aggregated

**Returns**: <code>Promise</code> - A promise for rendering and writing an aggregated markdown file.  

| Param | Type | Description |
| --- | --- | --- |
| grunt | <code>grunt</code> | Grunt module |
| task | <code>grunt.task</code> | The task which currently is run |
| file | <code>Object</code> | A grunt file object |
| options | <code>Object</code> | Options to use for rendering jsdoc to md |


<br><a name="module_grunt-jsdoc2md/tasks/jsdoc2md..get"></a>

### grunt-jsdoc2md/tasks/jsdoc2md~get(grunt, task, file, options) ⇒ <code>Promise</code>
> Returns a promise for rendering and writing markdown files.

**Returns**: <code>Promise</code> - A promise for rendering and writing markdown files.  

| Param | Type | Description |
| --- | --- | --- |
| grunt | <code>grunt</code> | Grunt module |
| task | <code>grunt.task</code> | The task which currently is run |
| file | <code>Object</code> | A grunt file object |
| options | <code>Object</code> | Options to use for rendering jsdoc to md |


<br><a name="module_grunt-jsdoc2md/tasks/jsdoc2md..runTaskJSDoc2MD"></a>

### grunt-jsdoc2md/tasks/jsdoc2md~runTaskJSDoc2MD(grunt, task) ⇒ <code>Promise</code>
> Return a promise for rendering and writing markdown files.

**Returns**: <code>Promise</code> - A promise for rendering and writing markdown files.  

| Param | Type | Description |
| --- | --- | --- |
| grunt | <code>grunt</code> | Grunt module |
| task | <code>grunt.task</code> | The task which currently is run |
