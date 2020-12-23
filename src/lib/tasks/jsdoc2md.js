/**
 *	tasks/jsdoc2md.js: grunt-jsdoc2md
 *
 *  @module grunt-jsdoc2md/tasks/jsdoc2md
 *
 *//*
 *  © 2020, slashlib.org.
 *
 *  tasks/jsdoc2md.js  is distributed WITHOUT ANY WARRANTY; without even the
 *  implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 *//* eslint-disable-next-line */
"use strict";

/**
 *  Mapping of all imported modules.
 *  @ignore
 */
const _m = {
  fs:               require( "fs"   ),
  path:             require( "path" ),
  jsdoc2md:         require( "jsdoc-to-markdown" )
};

/**
 *  Mapping of strings
 *  @ignore
 */
const _STRINGS =  {
  DEBUG:            "debug",
  FILES:            "files",
  FILESTODIRECTORY: "filesToDirectory",
  FILESTOFILE:      "filesToFile",
  GET:              "get",
  RENDER:           "render",
  RENDERTREE:       "renderTree",
  RUNTASKJSDOC2MD:  "runTaskJSDoc2MD",
  OK_WRITING:       "writing",
  REDUCE:           "reduce",
  SRCEXISTS:        "srcExists",
  SUFFIX_MARKDOWN:  ".md",
  TREE:             "tree",
  WARN_MISSING_SRC: "warning: no source file(s) for rendering to destination"
};

/**
 *  Symbal used by src/dst tree for saving leafs to.
 *  Will keep files from Object.keys( ... )
 *  @ignore
 */
const SYMBOL_FILES = Symbol( _STRINGS.FILES );

/**
 *  Render input file(s) to markdown file.
 *
 *  @param    {grunt}       grunt       - Grunt module
 *  @param    {grunt.task}  task        - The task which currently is run
 *  @param    {Object}      options     - Options to use for rendering jsdoc to md
 *  @param    {Object}      fileset     - Fileset
 */
function render( grunt, task, options, fileset ) {
  grunt.log.ok( `${ _STRINGS.OK_WRITING } ${ fileset.file }` );

  fileset.data = _m.jsdoc2md.getTemplateData( JSON.parse( JSON.stringify( options )))
                   .then( function ( output ) {
                          output.forEach(( element ) => {
                            element.meta.destfilename = fileset.dest;
                            element.meta.destpath     = _m.path.dirname(  fileset.file );
                            element.meta.relativepath = fileset.path;
                            element.meta.href         = `${ fileset.path }/${ fileset.dest }`;
                          });
                          // _m.fs.writeFileSync( `${ fileset.file }.json`, JSON.stringify( output ));
                          return output;
                    })
                   .catch( grunt.fail.fatal );

  return _m.jsdoc2md.render( options )
           .then( function ( output ) {
                  _m.fs.writeFileSync( fileset.file, output );
            })
           .catch( grunt.fail.fatal );
}

/**
 *  Render a tree of sources to a tree of destination directories
 *
 *  @param    {grunt}       grunt       - Grunt module
 *  @param    {grunt.task}  task        - The task which currently is run
 *  @param    {Object}      options     - Options to use for rendering jsdoc to md
 *  @param    {string}      destination - Current destination dir to render files to
 *  @param    {Object}      tree        - (Sub)tree of src/dst settings to render md files from
 */
function renderTree( grunt, task, options, destination, tree, treepath ) {
  /* istanbul ignore else: not required */
  if ( tree[ SYMBOL_FILES ]) {
       grunt.file.mkdir( destination );
       const opts = JSON.parse( JSON.stringify( options ));
       tree[ SYMBOL_FILES ].forEach(( fileset ) => {
         fileset.depth  = treepath.length;
         fileset.path   = treepath.join( "/" );
         fileset.file   = _m.path.join( process.cwd(), destination, fileset.dest );
         opts.files     = [ fileset.src ];
         render( grunt, task, opts, fileset );
       });
  }
  Object.keys( tree ).forEach(( node ) => {
    const localtree = tree[ node ];
    const localdest = _m.path.join( destination, node );
    renderTree( grunt, task, options, localdest, localtree, [ ...treepath, node ]);
  });
}

/**
 *
 */
function flattenTree( grunt, task, tree, datapromise ) {
  if ( tree[ SYMBOL_FILES ]) {
       datapromise = tree[ SYMBOL_FILES ].reduce(( datapromise, fileset ) => {
         return datapromise.then(( dataarray ) => {
           if ( fileset.data ) {
                return fileset.data.then(( output ) => {
                  if ( Array.isArray( output )) {
                       dataarray.push( ...output );
                  }
                  else dataarray.push( output );
                  return dataarray;
                });
           }
           else return dataarray;
         });
       }, datapromise );
  }
  return Object.keys( tree ).reduce(( datapromise, node ) => {
    return flattenTree( grunt, task, tree[ node ], datapromise );
  }, datapromise );
}

/**
 *  Return true, if file.src exists and is of type {Array(not empty)}
 *
 *  @param    {grunt}       grunt       - Grunt module
 *  @param    {Object}      file        - A grunt file object
 *  @returns  {Boolean} true, if file.src exists and is of type {Array}(not empty);
 *            false otherwise.
 */
function srcExists( grunt, file ) {
  return  ((( file.src === null )        || ( file.src === undefined )) ||
           (( Array.isArray( file.src )) && ( file.src.length <= 0   )));
}

/**
 *  Build a destination tree from an array of sources.
 *
 *  const sources = [
 *    "src/lib/index.js", "src/lib/fun/index.js", "src/lib/fun/some.js",
 *  ];
 *  const tree = {
 *    src: {
 *      lib: {
 *        @files: [
 *          { src: "src/lib/index.js", dest: "index.md" }
 *        ],
 *        fun: {
 *          @files: [
 *            { src: "src/lib/fun/index.js", dest: "index.md" },
 *            { src: "src/lib/fun/some.js",  dest: "some.md"  }
 *          ]
 *        }
 *      }
 *    }
 *  };
 *
 *  @param    {Array<string>} sources   - An array of source files.
 *  @returns  {Object} A tree of src/dst settings to render md files from.
 */
function tree( sources ) {
  let    branch = undefined;
  return sources.reduce(( tree, src ) => {
    const  nodes = src.split( /[/\\]+/ );
           branch = tree;
           nodes.forEach(( node, index, nodes ) => {
             if ( index < nodes.length - 1 ) {
                  if ( ! branch[ node ]) { branch[ node ] = { }; }
                  branch = branch[ node ];
             }
             else { // leaf
                  if ( ! branch[ SYMBOL_FILES ] ) {
                       branch[ SYMBOL_FILES ] = [ ];
                  }
                  const dest = `${ _m.path.parse( node ).name }${ _STRINGS.SUFFIX_MARKDOWN }`;
                  branch[ SYMBOL_FILES ].push({ src, dest });
             }
           });
    return tree;
  }, { });
}

/**
 *  Reduce a destination tree. This will remove treelevels without source/destination
 *  mappings or multiple branches.
 *
 *  const desttree = { src: { lib: { @files: [...], fun:{ ... }}}};
 *  const reduced  = reduce( dsttree );
 *  // => reduced: { @files: [...], fun:{ ... }}
 *
 *  @param    {Object}      dsttree     - tree of src/dst settings to render md files from
 *  @Returns  {Object}  A destination tree that usually is reduced by some levels.
 */
function reduce( dsttree ) {
  let keys = undefined
  if ( dsttree[ SYMBOL_FILES ]) { return dsttree; }
  else keys = Object.keys( dsttree );

  /* istanbul ignore if: not required */
  if ( keys.length < 1 ) { return undefined }
  else if ( keys.length > 1 ) { return dsttree; }
  else return reduce( dsttree[ keys[ 0 ]] );
}

/**
 *  Take one ore more input files and create multiple markdown output files
 *  inside a target directory.
 *
 *  @param    {grunt}       grunt       - Grunt module
 *  @param    {grunt.task}  task        - The task which currently is run
 *  @param    {Object}      file        - A grunt file object
 *  @param    {Object}      options     - Options to use for rendering jsdoc to md
 *//* eslint-disable-next-line */
async function filesToDirectory( grunt, task, file, options ) {
  if ( srcExists( grunt, file )) {
       grunt.log.warn( `${ _STRINGS.WARN_MISSING_SRC } '${ file.dest }'.` );
       return Promise.resolve( true );
  }
  else try {
       let dsttree = tree( file.src );    // build tree
           dsttree = reduce( dsttree );   // remove empty base like cwd/src/...

       /* istanbul ignore else: I would not expect this to happen... */
       if ( dsttree ) {
            renderTree(  grunt, task, options, file.dest, dsttree, [ "." ]);

            let datapromise = Promise.resolve([ ]);
            let data        = await flattenTree( grunt, task, dsttree, datapromise );

            _m.fs.writeFileSync( `${ file.dest }/api.md.json`, JSON.stringify( data ));

            // const handlebars = require( "../handlebars" );
            // handlebars.init( grunt );

            options           = JSON.parse( JSON.stringify( options ));
            options.cache     = false;
            options.data      = data;
            options.template  = "{{>api}}";
            //options[ "api-module-index-format" ] = undefined;
            await _m.jsdoc2md.render(options)
                    .then(( output ) => { _m.fs.writeFileSync( `${ file.dest }/api.md`, output ); });

       }
       else grunt.log.warn( `${ _STRINGS.WARN_MISSING_SRC } '${ file.dest }'.` );

       return Promise.resolve( true );
  }
  catch( error ) { /* istanbul ignore next */ return Promise.reject( error ); }
}

/**
 *  Take one ore more input files and create an aggregated
 *  markdown output file.
 *
 *  @param    {grunt}       grunt       - Grunt module
 *  @param    {grunt.task}  task        - The task which currently is run
 *  @param    {Object}      file        - A grunt file object
 *  @param    {Object}      options     - Options to use for rendering jsdoc to md
 *  @returns  {Promise} A promise for rendering and writing an aggregated markdown file.
 */
function filesToFile( grunt, task, file, options ) {
  if ( srcExists( grunt, file )) {
       grunt.log.warn( `${ _STRINGS.WARN_MISSING_SRC } '${ file.dest }'.` );
       return Promise.resolve( true );
  }
  else {
       grunt.file.mkdir( _m.path.dirname( file.dest ));
       options       = JSON.parse( JSON.stringify( options ));
       options.files = file.src;
       return render( grunt, task, options, { file: file.dest });
  }
}

/**
 *  Returns a promise for rendering and writing markdown files.
 *  Markdowns can be rendered and written in parallel for multiple sources.
 *
 *  @param    {grunt}       grunt       - Grunt module
 *  @param    {grunt.task}  task        - The task which currently is run
 *  @param    {Object}      file        - A grunt file object
 *  @param    {Object}      options     - Options to use for rendering jsdoc to md
 *  @returns  {Promise} A promise for rendering and writing markdown files.
 */
function get( grunt, task, file, options ) {
  // console.log( `${ task.name }:${ task.target }` );
  if ( grunt.file.isDir( file.dest )) {
       // write one or more files to an existing directory
       return filesToDirectory( grunt, task, file, options );
  }
  else if (( file.dest.endsWith( "/"  )) ||
           ( file.dest.endsWith( "\\" ))) {
       // prepare target directory
       grunt.file.mkdir( file.dest );
       // write one or more files to an existing directory
       return filesToDirectory( grunt, task, file, options );
  }
  else return filesToFile( grunt, task, file, options );
}

/**
 *  Return a promise for rendering and writing markdown files.
 *
 *  @export
 *  @param    {grunt}       grunt       - Grunt module
 *  @param    {grunt.task}  task        - The task which currently is run
 *  @returns  {Promise} A promise for rendering and writing markdown files.
 */
function runTaskJSDoc2MD( grunt, task ) {
  const options = task.options();
  // task.files:
  // @see https://gruntjs.com/configuring-tasks#files-array-format
  const promises = task.files.map(( file ) => {
    return get( grunt, task, file, options );
  })
  return Promise.all( promises );
}

/* eslint-disable */
// Module exports:
Object.defineProperty( module.exports, _STRINGS.FILESTODIRECTORY,  {
       value:    filesToDirectory,
       writable: false, enumerable: true, configurable: false });
Object.defineProperty( module.exports, _STRINGS.FILESTOFILE,    {
       value:    filesToFile,
       writable: false, enumerable: true, configurable: false });
Object.defineProperty( module.exports, _STRINGS.GET,            {
       value:    get,
       writable: false, enumerable: true, configurable: false });
Object.defineProperty( module.exports, _STRINGS.REDUCE,         {
       value:    reduce,
       writable: false, enumerable: true, configurable: false });
Object.defineProperty( module.exports, _STRINGS.RENDER,         {
       value:    render,
       writable: false, enumerable: true, configurable: false });
Object.defineProperty( module.exports, _STRINGS.RENDERTREE,     {
       value:    renderTree,
       writable: false, enumerable: true, configurable: false });
Object.defineProperty( module.exports, _STRINGS.RUNTASKJSDOC2MD,{
       value:    runTaskJSDoc2MD,
       writable: false, enumerable: true, configurable: false });
Object.defineProperty( module.exports, _STRINGS.SRCEXISTS,      {
       value:    srcExists,
       writable: false, enumerable: true, configurable: false });
Object.defineProperty( module.exports, _STRINGS.TREE,           {
       value:    tree,
       writable: false, enumerable: true, configurable: false });
/* eslint-enable */
