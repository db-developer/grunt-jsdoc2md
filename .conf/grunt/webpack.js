/**
 *  © 2020, db-developer.
 *  Licensed under the MIT license.
 */
 const path      = require( "path" );

 module.exports  = function ( grunt, options ) {
   return {
    build: {
      mode:             "production",
      entry:            path.resolve( options.LIBDIR, "index.js" ),
      output: {
        path:             path.resolve( options.BUILDDIR, "lib" ),
        // publicPath:       "",
        filename:         "index.js",
        libraryTarget:    "commonjs2"
      },
      devtool:          "inline-source-map",
      target:           "node", // in order to ignore built-in modules like path, fs,
      externals:        { },
      module: {
        rules: [
          {
            test:         /\.js?$/,
            exclude:      /(node_modules)/,
            use:          "babel-loader"
          },
        ],
      },
      resolve: {
        extensions:       [ ".js" ]
      }
    }
  }
}
