/**
 *  lib/log.js: logging utilities for grunt-jsdoc2md
 *
 *  @module grunt-jsdoc2md/log
 *
 *//*
 *  © 2026, db-developer.
 *
 *  Distributed WITHOUT ANY WARRANTY; without even the implied
 *  warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */
"use strict";

/**
 *  Emit a formatted log message for the grunt-jsdoc2md plugin.
 *
 *  This function provides a centralized and consistent logging format
 *  for all informational and warning messages emitted by the plugin.
 *  It ensures that messages are prefixed, structured, and readable
 *  within typical Grunt build logs.
 *
 *  The resulting output format is:
 *
 *    [jsdoc2md] <phase>: <action> — <message> (<context>)
 *
 *  where:
 *  - <phase>   identifies the logical processing stage (e.g. "tree",
 *              "renderTree", "render", "index", "task", "io")
 *  - <action>  briefly describes the performed or skipped action
 *  - <message> explains the reason or outcome
 *  - <context> (optional) provides additional information such as
 *              destination paths or source files
 *
 *  This function intentionally does not throw errors and does not decide
 *  build-fatal behavior. It is meant to be used by working-level functions
 *  to communicate state and anomalies, while task-level code decides
 *  whether execution can continue.
 *
 *  Typical use cases include:
 *  - warnings for missing or unexpected input
 *  - informational messages about skipped or adjusted behavior
 *  - user-facing diagnostics that aid configuration or debugging
 *
 *  @param {grunt} grunt
 *    The Grunt instance used for emitting log output.
 *
 *  @param {("ok"|"warn"|"error")} level
 *    The log level to use. This maps directly to the corresponding
 *    grunt.log function.
 *
 *  @param {string} phase
 *    The logical processing phase emitting the message.
 *
 *  @param {string} action
 *    A short description of the action being performed or skipped.
 *
 *  @param {string} message
 *    A human-readable explanation of the situation.
 *
 *  @param {string} [context]
 *    Optional contextual information (e.g. destination path, source file).
 */
module.exports.log = function log( grunt, level, phase, action, message, context ) {
  const prefix  = "[jsdoc2md]";
  const ctx     = context ? ` (${ context })` : "";
  const text    = `${ prefix } ${ phase }: ${ action } — ${ message }${ ctx }`;

  /* istanbul ignore else */
  if ( grunt && grunt.log && typeof grunt.log[ level ] === "function" ) {
       grunt.log[ level ]( text );
  }
};
