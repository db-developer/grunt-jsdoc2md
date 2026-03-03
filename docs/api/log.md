
<br><a name="module_grunt-jsdoc2md/log"></a>

## grunt-jsdoc2md/log
> lib/log.js: logging utilities for grunt-jsdoc2md


<br><a name="module_grunt-jsdoc2md/log.log"></a>

### grunt-jsdoc2md/log.log(grunt, level, phase, action, message, [context])
> Emit a formatted log message for the grunt-jsdoc2md plugin.> >  This function provides a centralized and consistent logging format>  for all informational and warning messages emitted by the plugin.>  It ensures that messages are prefixed, structured, and readable>  within typical Grunt build logs.> >  The resulting output format is:> >    [jsdoc2md] <phase>: <action> — <message> (<context>)> >  where:>  - <phase>   identifies the logical processing stage (e.g. "tree",>              "renderTree", "render", "index", "task", "io")>  - <action>  briefly describes the performed or skipped action>  - <message> explains the reason or outcome>  - <context> (optional) provides additional information such as>              destination paths or source files> >  This function intentionally does not throw errors and does not decide>  build-fatal behavior. It is meant to be used by working-level functions>  to communicate state and anomalies, while task-level code decides>  whether execution can continue.> >  Typical use cases include:>  - warnings for missing or unexpected input>  - informational messages about skipped or adjusted behavior>  - user-facing diagnostics that aid configuration or debugging


| Param | Type | Description |
| --- | --- | --- |
| grunt | <code>grunt</code> | The Grunt instance used for emitting log output. |
| level | <code>&quot;ok&quot;</code>, <code>&quot;warn&quot;</code>, <code>&quot;error&quot;</code> | The log level to use. This maps directly to the corresponding    grunt.log function. |
| phase | <code>string</code> | The logical processing phase emitting the message. |
| action | <code>string</code> | A short description of the action being performed or skipped. |
| message | <code>string</code> | A human-readable explanation of the situation. |
| [context] | <code>string</code> | Optional contextual information (e.g. destination path, source file). |

