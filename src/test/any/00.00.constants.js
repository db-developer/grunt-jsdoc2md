/**
 *  © 2020, slashlib.org.
 */
const grunt = require( "grunt" );

const promise = new Promise(( resolve, reject ) => {
  const name     = "jsonfile";
  const taskname = "target1";

  // note: this requires a "nyc_mocha.js" file in .conf/grunt (see gruntfile.js)
  grunt.task.registerMultiTask( name, `Test '${ name }' stuff`, function() {
    const task = this;
    resolve({ name, grunt, task });
  });

  // run registered task using current gruntfile.js
  // FUTURE: find a way to pass in some other config
  grunt.tasks([ name ], undefined, () => {});
});

module.exports.env = promise.catch(( error ) => { grunt.fail.warn( "custom error in 00.00.constants.js" )});

module.exports.options = {
  templates: {
    one:  "package.json",
    two: {
      pname1:     5,
      pname2:     true,
      pname3:     "value",
      pname4:     "${ BUILD }",
      aproperty:  "a aproperty will be deleted"
    },
    three: {
      compilerOptions: {
        outDir                  : "xxx",
        target                  : "xxx",
        module                  : "xxx",
        moduleResolution        : "node",
        declaration             : true,
        inlineSourceMap         : true,
        inlineSources           : true,
        emitDecoratorMetadata   : true,
        experimentalDecorators  : true,
        importHelpers           : true,
        typeRoots               : [ "node_modules/@types", "lib/@types" ],
        lib                     : [ "dom", "es2018" ]
      },
      include : [ "../build/**/*.ts"   ],
      exclude : [ "../build/test/**/*" ]
    }
  }
};
