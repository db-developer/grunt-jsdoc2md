# API Index #
## Modules

* [grunt-jsdoc2md](api/index.md#module_grunt-jsdoc2md)
    * [.registerMultiTask(grunt)](api/index.md#module_grunt-jsdoc2md.registerMultiTask)
* [grunt-jsdoc2md/constants](api/constants.md#module_grunt-jsdoc2md/constants)
    * [.TASKNAME](api/constants.md#module_grunt-jsdoc2md/constants.TASKNAME) : <code>string</code>
    * [.TASKDESCRIPTION](api/constants.md#module_grunt-jsdoc2md/constants.TASKDESCRIPTION) : <code>string</code>
* [grunt-jsdoc2md/log](api/log.md#module_grunt-jsdoc2md/log)
    * [.log(grunt, level, phase, action, message, [context])](api/log.md#module_grunt-jsdoc2md/log.log)
* [grunt-jsdoc2md/options](api/options/index.md#module_grunt-jsdoc2md/options)
    * [.get(grunt, task)](api/options/index.md#module_grunt-jsdoc2md/options.get) ⇒ <code>Object</code>
* [grunt-jsdoc2md/options/jsdoc2md](api/options/jsdoc2md.md#module_grunt-jsdoc2md/options/jsdoc2md)
    * [.getIndexOptions(options)](api/options/jsdoc2md.md#module_grunt-jsdoc2md/options/jsdoc2md.getIndexOptions) ⇒ <code>Object</code> \| <code>boolean</code>
    * [.getPlugins(options)](api/options/jsdoc2md.md#module_grunt-jsdoc2md/options/jsdoc2md.getPlugins) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getOptions(grunt, task)](api/options/jsdoc2md.md#module_grunt-jsdoc2md/options/jsdoc2md.getOptions) ⇒ <code>Object</code>
* [grunt-jsdoc2md/tasks](api/tasks/index.md#module_grunt-jsdoc2md/tasks)
    * [.registerMultiTask(grunt)](api/tasks/index.md#module_grunt-jsdoc2md/tasks.registerMultiTask)
* [grunt-jsdoc2md/tasks/jsdoc2md](api/tasks/jsdoc2md.md#module_grunt-jsdoc2md/tasks/jsdoc2md)
    * [.render(grunt, task, options, fileset)](api/tasks/jsdoc2md.md#module_grunt-jsdoc2md/tasks/jsdoc2md.render) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.renderTree(grunt, task, options, destination, tree, treepath)](api/tasks/jsdoc2md.md#module_grunt-jsdoc2md/tasks/jsdoc2md.renderTree) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.flattenTree(grunt, task, tree, datapromise)](api/tasks/jsdoc2md.md#module_grunt-jsdoc2md/tasks/jsdoc2md.flattenTree) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
    * [.renderApiIndex(grunt, task, file, options, dsttree)](api/tasks/jsdoc2md.md#module_grunt-jsdoc2md/tasks/jsdoc2md.renderApiIndex) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.srcMissing(grunt, file)](api/tasks/jsdoc2md.md#module_grunt-jsdoc2md/tasks/jsdoc2md.srcMissing) ⇒ <code>Boolean</code>
    * [.tree(sources)](api/tasks/jsdoc2md.md#module_grunt-jsdoc2md/tasks/jsdoc2md.tree) ⇒ <code>Object</code>
    * [.unwrapLinearRoot(dsttree)](api/tasks/jsdoc2md.md#module_grunt-jsdoc2md/tasks/jsdoc2md.unwrapLinearRoot) ⇒ <code>Object</code>
    * [.filesToDirectory(grunt, task, file, options)](api/tasks/jsdoc2md.md#module_grunt-jsdoc2md/tasks/jsdoc2md.filesToDirectory) ⇒ <code>Promise.&lt;(boolean\|void)&gt;</code>
    * [.filesToFile(grunt, task, file, options)](api/tasks/jsdoc2md.md#module_grunt-jsdoc2md/tasks/jsdoc2md.filesToFile) ⇒ <code>Promise.&lt;(boolean\|void)&gt;</code>
    * [.get(grunt, task, file, options)](api/tasks/jsdoc2md.md#module_grunt-jsdoc2md/tasks/jsdoc2md.get) ⇒ <code>Promise.&lt;(boolean\|void)&gt;</code>
    * [.runTask(grunt, task)](api/tasks/jsdoc2md.md#module_grunt-jsdoc2md/tasks/jsdoc2md.runTask) ⇒ <code>Promise.&lt;Array.&lt;unknown&gt;&gt;</code>
    * [.registerMultiTask(grunt)](api/tasks/jsdoc2md.md#module_grunt-jsdoc2md/tasks/jsdoc2md.registerMultiTask)
