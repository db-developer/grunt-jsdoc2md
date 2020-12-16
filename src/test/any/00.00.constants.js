/**
 *  © 2020, slashlib.org.
 */
const grunt     = require( "grunt" );
const constants = require( "../../lib/constants" );
// const idx       = require( "../../lib" );

const promise = new Promise(( resolve, reject ) => {
  const name     = constants.TASKNAME_JSDOC2MD;
  // idx.registerMultiTaskJSDoc2MD( grunt );

  // note: this requires a "jsdoc2md.js" file in .conf/grunt (see gruntfile.js)
  grunt.task.registerMultiTask( name, `Test '${ name }' stuff`, function() {
    const task = this;
    resolve({ name, grunt, task });
  });

  // run registered task using current gruntfile.js
  // FUTURE: find a way to pass in some other config
  grunt.tasks([ name ], undefined, () => { });
});

module.exports.env = promise.catch(( error ) => { grunt.fail.warn( "custom error in 00.00.constants.js" )});
