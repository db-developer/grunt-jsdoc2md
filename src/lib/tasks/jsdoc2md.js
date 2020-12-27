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
 *  Moduletable
 *  @ignore
 */
const _m = {
  fs:               require( "fs"   ),
  path:             require( "path" ),
  jsdoc2md:         require( "jsdoc-to-markdown" ),
  const:            require( "../constants" ),
  options:          require( "../options"   )
};

/**
 *  Stringtable
 *  @ignore
 */
const _STRINGS =  {
  DEBUG:                      "debug",
  DEFAULTAPITEMPLATE:         "{{>api}}",
  FILES:                      "files",
  FILESTODIRECTORY:           "filesToDirectory",
  FILESTOFILE:                "filesToFile",
  GET:                        "get",
  OK_INDEXING:                "indexing",
  OK_WRITING:                 "writing",
  REGISTERMULTITASKJSDOC2MD:  "registerMultiTaskJSDoc2MD",
  RENDER:                     "render",
  RENDERTREE:                 "renderTree",
  RUNTASKJSDOC2MD:            "runTaskJSDoc2MD",
  REDUCE:                     "reduce",
  SRCEXISTS:                  "srcExists",
  SUFFIX_MARKDOWN:            ".md",
  TREE:                       "tree",
  UTF8:                       "utf-8",
  WARN_MISSING_SRC:           "warning: no source file(s) for rendering to destination"
};

/**
 *  Default file encoding
 *  @ignore
 */
const _FILEENCODING = { encoding: _STRINGS.UTF8 };

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
  fileset.data = _m.jsdoc2md.getTemplateData( JSON.parse( JSON.stringify( options )))
                   .then( function ( output ) {
                          output.forEach(( element ) => {
                            /* istanbul ignore else: TODO: Find out else path and test it */
                            if ( element.meta ) { // oviously elements without metadata may exist ...
                                 element.meta.destfilename = fileset.dest;
                                 element.meta.destpath     = _m.path.dirname(  fileset.file );
                                 element.meta.relativepath = fileset.path;
                                 element.meta.href         = `${ fileset.path }/${ fileset.dest }`;
                            }
                          });
                          // _m.fs.writeFileSync( `${ fileset.file }.json`, JSON.stringify( output ));
                          return output;
                    })
                   .catch( grunt.fail.fatal );

  return _m.jsdoc2md.render( options )
           .then( function ( output ) {
                  grunt.log.ok( `${ _STRINGS.OK_WRITING } ${ fileset.file }` );
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
  let  stage = Promise.resolve();
  if ( tree[ SYMBOL_FILES ]) {
       grunt.file.mkdir( destination );
       const opts  = JSON.parse( JSON.stringify( options ));
             stage = tree[ SYMBOL_FILES ].reduce(( promise, fileset ) => {
                       return promise.then(() => {
                         fileset.depth  = treepath.length;
                         fileset.path   = treepath.join( "/" );
                         fileset.file   = _m.path.join( process.cwd(), destination, fileset.dest );
                         opts.files     = [ fileset.src ];
                         return render( grunt, task, opts, fileset );
                       });
                     }, stage );
  }
  return Object.keys( tree ).reduce(( promise, node ) => {
    return promise.then(() => {
                     const localtree = tree[ node ];
                     const localdest = _m.path.join( destination, node );
                     return renderTree( grunt, task, options, localdest, localtree, [ ...treepath, node ]);
                   });
  }, stage );
}

/**
 *
 */
function flattenTree( grunt, task, tree, datapromise ) {
  if ( tree[ SYMBOL_FILES ]) {
       datapromise = tree[ SYMBOL_FILES ].reduce(( datapromise, fileset ) => {
         return datapromise.then(( dataarray ) => {
           /* istanbul ignore else: TODO write test */
           if ( fileset.data ) {
                return fileset.data.then(( output ) => {
                  /* istanbul ignore else: TODO write test */
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
 *
 *  Note on debugging:
 *    handlebars does cache your arse off! If you debug, better manually delete
 *    caching directories before each run, than to rely on caching options...
 *    windows: c:\users\<username>\appdata\local\temp
 */
async function renderApiIndex( grunt, task, file, options, dsttree ) {
  // debug: write json data to file for analysis
  // _m.fs.writeFileSync( `${ file.dest }/api.md.json`, JSON.stringify( options.data ));

  // debug: load custom helpers and partials
  // const handlebars = require( "../handlebars" );
  // handlebars.init( grunt );
  try {
      let   datapromise   = Promise.resolve([ ]);
            options       = JSON.parse( JSON.stringify( options ));
            options.data  = await flattenTree( grunt, task, dsttree, datapromise );

      const tmplpath      = options.index.template;
      if ( ! tmplpath ) { options.template = _STRINGS.DEFAULTAPITEMPLATE }
      else options.template = grunt.file.read( tmplpath, _FILEENCODING );

      const basedir = _m.path.dirname( options.index.dest );
      if ( basedir !== "." ) { grunt.file.mkdir( basedir ); }

      return _m.jsdoc2md.render( options )
               .then( function ( output ) {
                      grunt.log.ok( `${ _STRINGS.OK_INDEXING } ${ options.index.dest }` );
                      _m.fs.writeFileSync( options.index.dest, output );
                })
               .catch( grunt.fail.fatal );
  }
  catch( error ) { /* istanbul ignore next */ return Promise.reject( error ); }
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
  if ( keys.length < 1 ) { return { }; }
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
function filesToDirectory( grunt, task, file, options ) {
  if ( srcExists( grunt, file )) {
       grunt.log.warn( `${ _STRINGS.WARN_MISSING_SRC } '${ file.dest }'.` );
       return Promise.resolve( true );
  }
  else try {
       let dsttree = tree( file.src );    // build tree
           dsttree = reduce( dsttree );   // remove empty base like cwd/src/...

       /* istanbul ignore else: should never happen */
       if ( dsttree ) {
            // last parameter is "treepath", which will define what context.meta.href
            // looks like. 'href' must map the relative path from the api index markdown
            // to the subsequent api module markdows.
            if ( options.index !== false ) {
                 const basepath = _m.path.dirname( options.index.dest );
                 let   relpath  = _m.path.relative( basepath, file.dest );
                       relpath  = relpath.replace( /[\\]/g, "/" );
                 return renderTree( grunt, task, options, file.dest, dsttree, [ relpath ]).then(() => {
                          return renderApiIndex( grunt, task, file, options, dsttree );
                        }).catch( /* istanbul ignore next */ ( error ) => {
                          grunt.log.warn( `Cannot render API Index due to error'.`, error );
                          throw error;
                        });
            }
            else return renderTree( grunt, task, options, file.dest, dsttree, [ "." ]);
       }
       else {
            grunt.log.warn( `${ _STRINGS.WARN_MISSING_SRC } '${ file.dest }'.` );
            return Promise.resolve( true );
       }
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
  const options = _m.options.get( grunt, task );
  // task.files:
  // @see https://gruntjs.com/configuring-tasks#files-array-format
  const promises = task.files.map(( file ) => {
    return get( grunt, task, file, options );
  })
  return Promise.all( promises );
}

/**
 *  Registers the 'jsdoc2md' multitask.
 *
 *  @param  {grunt} grunt
 */
function registerMultiTaskJSDoc2MD( grunt ) {
  grunt.registerMultiTask( _m.const.TASKNAME_JSDOC2MD, _m.const.TASKDESCRIPTION_JSDOC2MD,
    /* istanbul ignore next */ function () {
      const task = this;
      const done = task.async();
      runTaskJSDoc2MD( grunt, task ).then((       ) => { done(); },
                                          ( error ) => { grunt.log.error( error ); done( false ); });
  });
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
Object.defineProperty( module.exports, _STRINGS.REGISTERMULTITASKJSDOC2MD, {
       value:    registerMultiTaskJSDoc2MD,
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
