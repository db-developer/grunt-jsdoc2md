/**
 *  © 2020, db-developer.
 *  Licensed under the MIT license.
 */

// Note: This is used for running tests only!
module.exports = function ( grunt, options ) {
  return {
    options: {
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
    },
    target1: {
      test: "value",
      dest: "./src/test/tmp/target1.json"
    }
  }
};
