/**
 *	handlebars.js:  grunt-jsdoc2md
 *
 *  @module grunt-jsdoc2md/handlebars
 *
 *//*
 *  © 2020, slashlib.org.
 *
 *  handlebars.js  is  distributed WITHOUT  ANY WARRANTY;  without even  the
 *  implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 *//* eslint-disable-next-line */
"use strict";

const _m = {
  path:             require( "path" ),
  handlebars:       require( "handlebars" ),
  helpers:          require( "../helpers" )
};

const _STRINGS = {
  INIT:   "init"
};

function init( grunt ) {
  registerPartials( grunt, "src/partials/**/*.hbs" );
  registerHelpers(  grunt, _m.helpers );
}

function registerPartials( grunt, patterns ) {
  const paths = grunt.file.expand( patterns );
  paths.forEach(( path ) => {
    const name    = _m.path.parse( path ).name;
    const content = grunt.file.read( path, { encoding: "utf-8" });
    _m.handlebars.registerPartial( name, content );
  });
}

function registerHelpers( grunt, exports ) {
  Object.keys( exports ).forEach(( key ) => {
    _m.handlebars.registerHelper( key, exports[ key ]);
  })
}

/* eslint-disable */
// Module exports:
Object.defineProperty( module.exports, _STRINGS.INIT, {
       value:    init,
       writable: false, enumerable: true, configurable: false });
/* eslint-enable */
