/**
 *	lib/tasks/jsdoc2md.js: grunt-jsdoc2md
 *
 *  @module grunt-jsdoc2md/tasks/jsdoc2md
 * 
 *//*
 *  © 2020, db-developer.
 *
 *  Distributed  WITHOUT  ANY WARRANTY;  without  even the  implied
 *  warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */
"use strict";

const fsmodule   = require( "node:fs"           );
const pathmodule = require( "node:path"         );
const jsdoc2md   = require( "jsdoc-to-markdown" );
const constants  = require( "../constants"      );
const logmodule  = require( "../log"            );
const optsmodule = require( "../options"        );

const log = logmodule.log;

/**
 *  Warning message for missing source files.
 *  @ignore
 */
const WARN_MISSING_SRC ="warning: no source file(s) for rendering to destination";

/**
 *  Default file encoding
 *  @ignore
 */
const FILEENCODING = { encoding: "utf-8" };

/**
 *  Symbol used by src/dst tree for saving leafs to.
 *  Will keep files from Object.keys( ... )
 *  Notes:
 *    - Get symbol from registry to make sure the same symbol
 *      can be used in test and implementation.
 *  @ignore
 */
const SYMBOL_FILES = Symbol.for( "files" );

/**
 *  Render one fileset to a Markdown file using jsdoc-to-markdown.
 *
 *  ------------------------------------------------------------------------
 *  Architectural Role
 *  ------------------------------------------------------------------------
 *  `render` is the rendering primitive of the module. It performs a single,
 *  atomic transformation step:
 *
 *    source file(s) → template data → Markdown output → filesystem write
 *
 *  Higher-level orchestration (tree traversal, directory creation, index
 *  generation, error policy) is intentionally handled by callers.
 *
 *  ------------------------------------------------------------------------
 *  Processing Pipeline
 *  ------------------------------------------------------------------------
 *  1. Validate `options` (must be a non-null object).
 *  2. Retrieve template data via `jsdoc2md.getTemplateData`.
 *  3. Enrich each template data element's `meta` object with:
 *       - `destfilename` → target filename
 *       - `destpath`     → directory of the output file
 *       - `relativepath` → logical tree path context
 *       - `href`         → link used for API index resolution
 *  4. Render Markdown via `jsdoc2md.render`.
 *  5. Log the rendering step.
 *  6. Write the generated Markdown to `fileset.file`.
 *
 *  ------------------------------------------------------------------------
 *  Fileset Contract
 *  ------------------------------------------------------------------------
 *  The `fileset` object is expected to contain at minimum:
 *
 *      {
 *        file: string,   // absolute output file path
 *        dest: string,   // output filename
 *        path: string    // logical tree path (used for link computation)
 *      }
 *
 *  Side effect:
 *    - `fileset.data` is assigned the resolved template data array.
 *
 *  This property is later consumed by aggregation layers (e.g. API index
 *  generation).
 *
 *  ------------------------------------------------------------------------
 *  Template Data Assumptions
 *  ------------------------------------------------------------------------
 *  - `jsdoc2md.getTemplateData` resolves to an Array.
 *  - Elements may contain a `meta` object.
 *  - Only elements with a `meta` property are enriched.
 *
 *  No structural validation of template data is performed here.
 *
 *  ------------------------------------------------------------------------
 *  Error Semantics
 *  ------------------------------------------------------------------------
 *  - Rejects with `TypeError` if `options` is invalid.
 *  - Propagates any rejection from:
 *        - `jsdoc2md.getTemplateData`
 *        - `jsdoc2md.render`
 *        - `fs.promises.writeFile`
 *  - Does not perform error transformation or recovery.
 *
 *  ------------------------------------------------------------------------
 *  Side Effects
 *  ------------------------------------------------------------------------
 *  - Mutates `fileset` by assigning `fileset.data`.
 *  - Mutates template data elements by enriching `element.meta`.
 *  - Writes one Markdown file to the filesystem.
 *  - Emits a log entry via the logging abstraction.
 *
 *  ------------------------------------------------------------------------
 *  Determinism Guarantees
 *  ------------------------------------------------------------------------
 *  - Execution is strictly sequential.
 *  - Exactly one output file is written per invocation.
 *
 *  @param {grunt} grunt
 *    The Grunt instance used for logging.
 *
 *  @param {grunt.task} task
 *    The currently executing Grunt task context (not used directly here,
 *    retained for API symmetry).
 *
 *  @param {Object} options
 *    Normalized jsdoc2md rendering options. Must be a non-null object.
 *
 *  @param {Object} fileset
 *    Fileset descriptor containing output file context and link metadata.
 *
 *  @returns {Promise<void>}
 *    Resolves when rendering and file writing complete.
 *
 *  @throws {TypeError}
 *    If `options` is not a valid object.
 */
module.exports.render = async function render( grunt, task, options, fileset ) {
  if ( !options || typeof options !== "object" ) {
       return Promise.reject( new TypeError("Invalid options"));
  }
  
  fileset.data = await jsdoc2md.getTemplateData({ ...options });

  for ( const element of fileset.data ) {
        /* istanbul ignore else: TODO: Find out else path and test it */
        if (element.meta) {
            element.meta.destfilename = fileset.dest;
            element.meta.destpath     = pathmodule.dirname(fileset.file);
            element.meta.relativepath = fileset.path;
            element.meta.href         = `${fileset.path}/${fileset.dest}`;
        }
  }
 
  const output = await jsdoc2md.render( options );
  log( grunt, "ok", "render", "rendering", "writing", `fileset.file="${ fileset.file }"` );

  return fsmodule.promises.writeFile( fileset.file, output, FILEENCODING );
}

/**
 *  Render a documentation tree into a corresponding directory structure
 *  of Markdown files.
 *
 *  ------------------------------------------------------------------------
 *  Architectural Role
 *  ------------------------------------------------------------------------
 *  `renderTree` is the structural orchestration layer between:
 *
 *    - the tree model (src → dest structure),
 *    - the rendering primitive (`render`),
 *    - the filesystem layer (directory creation).
 *
 *  It is responsible for traversal order, contextual enrichment of filesets,
 *  and controlled delegation to the rendering layer. It does not perform
 *  Markdown generation itself.
 *
 *  ------------------------------------------------------------------------
 *  Execution Model
 *  ------------------------------------------------------------------------
 *  - Traversal strategy: depth-first.
 *  - Rendering within a single node: strictly sequential.
 *  - Subtrees are processed only after all filesets of the current node
 *    have completed.
 *  - No parallel rendering occurs inside this function.
 *
 *  This guarantees:
 *    - Deterministic output ordering.
 *    - Deterministic directory creation timing.
 *    - Fail-fast semantics (any rejected render aborts traversal).
 *
 *  ------------------------------------------------------------------------
 *  Tree Model Invariants
 *  ------------------------------------------------------------------------
 *  - A tree node is a plain object.
 *  - A node may contain a structural property:
 *
 *        tree[SYMBOL_FILES] → Array<Fileset>
 *
 *  - All enumerable keys of the node are interpreted as subtree names.
 *  - No deep structural validation of the tree is performed.
 *  - If `tree[SYMBOL_FILES]` exists but is not an Array, the node is skipped
 *    with a warning.
 *
 *  ------------------------------------------------------------------------
 *  Fileset Contract
 *  ------------------------------------------------------------------------
 *  Each fileset is expected to contain:
 *
 *      {
 *        src:  string,
 *        dest: string
 *      }
 *
 *  Filesets failing this minimal contract are skipped with a warning.
 *
 *  During processing, each valid fileset is enriched with:
 *
 *      fileset.depth → number   (current tree depth)
 *      fileset.path  → string   (logical path context, joined by "/")
 *      fileset.file  → string   (absolute output file path)
 *
 *  The output path is constructed as:
 *
 *      path.join(process.cwd(), destination, fileset.dest)
 *
 *  The enriched fileset is then passed to `render`, which:
 *    - assigns `fileset.data`
 *    - performs Markdown rendering
 *    - writes the output file
 *
 *  ------------------------------------------------------------------------
 *  Directory Semantics
 *  ------------------------------------------------------------------------
 *  - If a node contains a valid fileset array, `destination` is created
 *    via `grunt.file.mkdir` before rendering.
 *  - Subtree destinations are computed by:
 *
 *        path.join(destination, nodeName)
 *
 *  ------------------------------------------------------------------------
 *  Error Semantics
 *  ------------------------------------------------------------------------
 *  - Invalid fileset containers → warning, node skipped.
 *  - Invalid `src` or `dest` → warning, fileset skipped.
 *  - Any rejection from `render` propagates upward.
 *  - No build-fatal decision is made here; callers control failure policy.
 *
 *  ------------------------------------------------------------------------
 *  Side Effects
 *  ------------------------------------------------------------------------
 *  - Creates directories via `grunt.file.mkdir`.
 *  - Mutates fileset objects (context enrichment).
 *  - Delegates file writing to `render`.
 *  - Emits warnings via the logging abstraction.
 *
 *  ------------------------------------------------------------------------
 *  Design Constraints
 *  ------------------------------------------------------------------------
 *  - Sequential rendering is intentional to preserve deterministic order.
 *  - Assumes `options` is already normalized.
 *  - `destination` may be absolute or relative.
 *  - `treepath` defines logical link context and directly influences
 *    `fileset.path` and downstream `meta.href` computation.
 *
 *  @param {grunt} grunt
 *    The Grunt instance used for filesystem operations and logging.
 *
 *  @param {grunt.task} task
 *    The currently executing Grunt task context.
 *
 *  @param {Object} options
 *    Normalized jsdoc2md rendering options.
 *
 *  @param {string} destination
 *    Destination directory for the current tree node.
 *
 *  @param {Object} tree
 *    Documentation subtree describing source-to-destination mappings.
 *
 *  @param {Array<string>} treepath
 *    Path segments used to compute logical link context.
 *
 *  @returns {Promise<void>}
 *    Resolves when the entire subtree (current node and descendants)
 *    has been rendered.
 */
module.exports.renderTree = async function renderTree( grunt, task, options, destination, tree, treepath ) {
  /* istanbul ignore else: not required */
  if ( tree && tree[ SYMBOL_FILES ]) {
        if ( ! Array.isArray( tree[ SYMBOL_FILES ] )) {
             log( grunt, "warn", "renderTree", "skipping node", "invalid fileset container", `destination="${ destination }"` );
        }
        else {
             grunt.file.mkdir( destination );
             for ( const fileset of tree[ SYMBOL_FILES ]) {
                   if ( ! fileset.src || typeof fileset.src !== "string" ) {
                        log( grunt, "warn", "renderTree", "skipping fileset", "missing or invalid src", `fileset.dest="${ fileset.dest }"` );
                        continue;
                   }

                   if ( ! fileset.dest || typeof fileset.dest !== "string" ) {
                        log( grunt, "warn", "renderTree", "skipping fileset", "missing or invalid dest", `fileset.src="${ fileset.src }"` );
                        continue;
                   }

                   fileset.depth = treepath.length;
                   fileset.path  = treepath.join( "/" );
                   fileset.file  = pathmodule.join( process.cwd(), destination, fileset.dest );

                   const renderOptions = { ...options, files: [ fileset.src ]};

                   await module.exports.render( grunt, task, renderOptions, fileset );
             }
        }
  }

  for ( const node of Object.keys(tree || {})) {
        const localtree = tree[ node ];
        const localdest = pathmodule.join( destination, node );
        await module.exports.renderTree( grunt, task, options, localdest, localtree, [ ...treepath, node ]);
  }
}

/**
 *  Flatten a documentation tree by aggregating resolved fileset data
 *  into a single accumulator array.
 *
 *  ------------------------------------------------------------------------
 *  Architectural Role
 *  ------------------------------------------------------------------------
 *  `flattenTree` is the pure data aggregation layer of the documentation
 *  pipeline. It traverses a documentation tree depth-first and collects
 *  resolved `fileset.data` payloads into a shared accumulator.
 *
 *  It performs:
 *    - no rendering
 *    - no filesystem access
 *    - no logging
 *    - no structural mutation of the tree
 *
 *  Its sole responsibility is deterministic extraction and aggregation
 *  of fileset data.
 *
 *  ------------------------------------------------------------------------
 *  Execution Model
 *  ------------------------------------------------------------------------
 *  - Traversal strategy: depth-first.
 *  - Resolution strategy: strictly sequential via `await`.
 *  - Aggregation strategy: in-place mutation of a shared accumulator.
 *
 *  The function first awaits `datapromise` to obtain the accumulator array.
 *  It then:
 *
 *    1. Processes all filesets at the current node.
 *    2. Recursively processes all enumerable child nodes.
 *
 *  All async resolution is performed sequentially to preserve stable order.
 *
 *  ------------------------------------------------------------------------
 *  Tree Structure Contract
 *  ------------------------------------------------------------------------
 *  - `tree` MUST be a non-null object.
 *  - If present, `tree[SYMBOL_FILES]` is expected to be an Array of filesets.
 *  - All enumerable keys of `tree` are interpreted as subtree names and
 *    recursively traversed.
 *
 *  No validation of the structural integrity of `tree[SYMBOL_FILES]`
 *  is performed beyond existence checks.
 *
 *  ------------------------------------------------------------------------
 *  Fileset Data Contract
 *  ------------------------------------------------------------------------
 *  - A fileset MAY expose a `data` property.
 *  - If `fileset.data` is absent, the fileset is ignored.
 *  - `fileset.data` may be:
 *        - a Promise resolving to a value or Array of values
 *        - a non-Promise value
 *  - Resolution is normalized via `Promise.resolve`.
 *  - If the resolved value is an Array, it is spread into the accumulator.
 *  - Otherwise, the value is appended as a single element.
 *
 *  The function does not validate the semantic shape of resolved values.
 *
 *  ------------------------------------------------------------------------
 *  Accumulator Contract
 *  ------------------------------------------------------------------------
 *  - `datapromise` MUST resolve to an Array instance.
 *  - The resolved array is mutated in-place.
 *  - The same array instance is returned to the caller.
 *
 *  Recursive calls pass the accumulator directly (not wrapped in a Promise);
 *  awaiting the parameter normalizes both Promise and Array inputs.
 *
 *  ------------------------------------------------------------------------
 *  Side Effects
 *  ------------------------------------------------------------------------
 *  - Mutates the resolved accumulator array by appending elements.
 *  - Does not mutate the tree or fileset objects.
 *
 *  ------------------------------------------------------------------------
 *  Error Semantics
 *  ------------------------------------------------------------------------
 *  - Throws `TypeError` if `tree` is null or undefined.
 *  - Propagates rejections from:
 *        - `datapromise`
 *        - any awaited `fileset.data`
 *  - Does not perform recovery or partial aggregation handling.
 *
 *  ------------------------------------------------------------------------
 *  Determinism Guarantees
 *  ------------------------------------------------------------------------
 *  Aggregation order is stable and defined as:
 *
 *    1. Filesets of the current node (array order)
 *    2. Child subtrees in `Object.keys(tree)` enumeration order
 *
 *  No parallel execution occurs.
 *
 *  @param {grunt} grunt
 *    The Grunt instance (unused; retained for API compatibility).
 *
 *  @param {Object} task
 *    The active Grunt task context (unused).
 *
 *  @param {Object} tree
 *    The documentation tree or subtree to flatten.
 *
 *  @param {Promise<Object[]>|Object[]} datapromise
 *    A Promise resolving to the accumulator array, or an Array directly.
 *    The resolved value MUST be an Array.
 *
 *  @returns {Promise<Object[]>}
 *    A Promise resolving to the same accumulator array instance,
 *    extended with all resolved fileset data from the subtree.
 *
 *  @throws {TypeError}
 *    If `tree` is null or undefined.
 */
module.exports.flattenTree = async function flattenTree( grunt, task, tree, datapromise ) {
  let dataarray = await datapromise;

  if ( !tree ) throw new TypeError( "Missing tree" );

  if ( tree && tree[ SYMBOL_FILES ]) {
       for ( const fileset of tree[SYMBOL_FILES]) {
             if ( !fileset.data ) continue;

             // in case fileset.data is not a promise...
             const output = await Promise.resolve(fileset.data);

             if ( Array.isArray( output )) {
                  dataarray.push( ...output );
             } 
             else dataarray.push( output );
      }
  }

  for ( const node of Object.keys( tree )) {
        dataarray = await module.exports.flattenTree( grunt, task, tree[ node ], dataarray );
  }

  return dataarray;
}

/**
 *  Render the API index file by aggregating all rendered fileset data
 *  and passing it through a dedicated index template.
 *
 *  ------------------------------------------------------------------------
 *  Architectural Role
 *  ------------------------------------------------------------------------
 *  `renderApiIndex` is the terminal aggregation step of the documentation
 *  pipeline. It:
 *
 *    1. Collects all resolved fileset data from the destination tree.
 *    2. Prepares a template for index rendering.
 *    3. Invokes `jsdoc2md.render` with aggregated data.
 *    4. Writes the resulting Markdown index file to disk.
 *
 *  It does not participate in tree traversal beyond delegating to
 *  `flattenTree`, and it does not mutate the tree structure.
 *
 *  ------------------------------------------------------------------------
 *  Data Aggregation
 *  ------------------------------------------------------------------------
 *  - Aggregation is delegated to `flattenTree`.
 *  - The accumulator is initialized as an empty Array.
 *  - The resolved `data` array is passed to jsdoc2md as `options.data`.
 *  - Aggregation order is determined by `flattenTree` (depth-first,
 *    deterministic).
 *
 *  ------------------------------------------------------------------------
 *  Template Resolution
 *  ------------------------------------------------------------------------
 *  - Template source is resolved from `options.index.template`.
 *  - If no template path is provided, the default template string
 *        "{{>api}}"
 *    is used.
 *  - If a template path is provided, it is read synchronously via
 *    `grunt.file.read`.
 *
 *  No template validation is performed here.
 *
 *  ------------------------------------------------------------------------
 *  Destination Handling
 *  ------------------------------------------------------------------------
 *  - Target file path: `options.index.dest`.
 *  - The base directory of the destination file is derived via
 *    `path.dirname`.
 *  - If the base directory is not ".", it is created via
 *    `grunt.file.mkdir`.
 *  - File writing is delegated to `fs.promises.writeFile`.
 *
 *  The function assumes `options.index.dest` is a valid writable path.
 *
 *  ------------------------------------------------------------------------
 *  Rendering Contract
 *  ------------------------------------------------------------------------
 *  - Rendering is performed via `jsdoc2md.render(indexOptions)`.
 *  - `indexOptions` extends the provided `options` with:
 *        - `data`     → aggregated fileset data
 *        - `template` → resolved index template
 *
 *  No additional transformation of the aggregated data occurs.
 *
 *  ------------------------------------------------------------------------
 *  Side Effects
 *  ------------------------------------------------------------------------
 *  - Reads a template file if configured.
 *  - Creates destination directories as needed.
 *  - Writes a single Markdown file to disk.
 *  - Emits a log entry upon successful render invocation.
 *
 *  ------------------------------------------------------------------------
 *  Error Semantics
 *  ------------------------------------------------------------------------
 *  - Propagates rejections from:
 *        - `flattenTree`
 *        - `jsdoc2md.render`
 *        - `fs.promises.writeFile`
 *  - Does not perform recovery or partial write handling.
 *
 *  ------------------------------------------------------------------------
 *  Determinism Guarantees
 *  ------------------------------------------------------------------------
 *  - Index content is fully determined by:
 *        - the structure and data of `dsttree`
 *        - the resolved template
 *        - the provided `options`
 *  - No parallel execution occurs within this function.
 *
 *  ------------------------------------------------------------------------
 *  Debugging Note:
 *    Handlebars aggressively caches compiled templates. During debugging,
 *    template changes may not be reflected immediately due to this caching.
 *
 *    To ensure consistent results while developing or troubleshooting,
 *    manually clear the system temporary directory before rerunning the task
 *    instead of relying solely on runtime cache configuration.
 *
 *    On Windows, cached files are typically located under:
 *      C:\Users\<username>\AppData\Local\Temp

 *  @param {grunt} grunt
 *    The Grunt instance used for filesystem operations and logging.
 *
 *  @param {Object} task
 *    The active Grunt task context.
 *
 *  @param {Object} file
 *    Task file descriptor (currently unused by this function).
 *
 *  @param {Object} options
 *    Normalized jsdoc2md options. Must include:
 *        options.index.dest      → string (required)
 *        options.index.template  → string (optional)
 *
 *  @param {Object} dsttree
 *    The fully rendered destination tree used as aggregation source.
 *
 *  @returns {Promise<void>}
 *    Resolves once the index file has been written.
 */
module.exports.renderApiIndex = async function renderApiIndex( grunt, task, file, options, dsttree ) {
  // debug: write json data to file for analysis
  // fsmodule.promises.writeFile( `${ file.dest }/api.md.json`, JSON.stringify( options.data ), FILEENCODING );
  const data        = await module.exports.flattenTree( grunt, task, dsttree, Promise.resolve([ ]));

  let   template;
  const tmplpath    = options.index.template;
  if ( ! tmplpath ) { template = "{{>api}}" }
  else template = grunt.file.read( tmplpath, FILEENCODING );

  const basedir = pathmodule.dirname( options.index.dest );
  if ( basedir !== "." ) { grunt.file.mkdir( basedir )}

  const indexOptions = { ...options, data, template };

  const output = await jsdoc2md.render( indexOptions );
  log( grunt, "ok", "renderApiIndex", "rendering", "indexing", `indexOptions.index.dest="${ indexOptions.index.dest }"` );

  return fsmodule.promises.writeFile( indexOptions.index.dest, output, FILEENCODING );
}

/**
 *  Determines whether a given Grunt file object has a missing or empty `src` property.
 *
 *  This function evaluates the `src` property of the provided file object and returns
 *  `true` if `src` is `null`, `undefined`, or an empty array. Otherwise, it returns `false`.
 *
 *  ------------------------------------------------------------------------
 *  Usage Notes
 *  ------------------------------------------------------------------------
 *  - The function does not modify the file object.
 *  - Only performs type and emptiness checks; it does not verify file system existence.
 *
 *  @param {grunt} grunt
 *    The Grunt instance (currently unused, retained for API symmetry).
 *
 *  @param {Object} file
 *    A Grunt file object which is expected to have a `src` property.
 *
 *  @returns {Boolean}
 *    `true` if `file.src` is `null`, `undefined`, or an empty array; `false` otherwise.
 */
module.exports.srcMissing = function srcMissing( grunt, file ) {
  return  ((( file.src === null )        || ( file.src === undefined )) ||
           (( Array.isArray( file.src )) && ( file.src.length <= 0   )));
}

/**
 *  Constructs a nested destination tree from an array of source file paths.
 *
 *  Each path segment becomes a tree node. The final segment of each path
 *  produces a leaf fileset object containing:
 *
 *      { src: <original source>, dest: <generated markdown filename> }
 *
 *  ------------------------------------------------------------------------
 *  Structural Notes
 *  ------------------------------------------------------------------------
 *  - Tree nodes are plain objects.
 *  - Leaf nodes contain a non-enumerable property `[SYMBOL_FILES]` holding
 *    an array of fileset objects.
 *  - File names are converted to markdown (`.md`) using their basename.
 *  - Directory hierarchy is derived from the path separators in the source string.
 *
 *  ------------------------------------------------------------------------
 *  Usage
 *  ------------------------------------------------------------------------
 *  @example
 *  const sources = [
 *    "src/lib/index.js",
 *    "src/lib/fun/index.js",
 *    "src/lib/fun/some.js"
 *  ];
 *  const tree = module.exports.tree(sources);
 *
 *  // tree structure:
 *  // {
 *  //   src: {
 *  //     lib: {
 *  //       [SYMBOL_FILES]: [{ src: "src/lib/index.js", dest: "index.md" }],
 *  //       fun: {
 *  //         [SYMBOL_FILES]: [
 *  //           { src: "src/lib/fun/index.js", dest: "index.md" },
 *  //           { src: "src/lib/fun/some.js",  dest: "some.md"  }
 *  //         ]
 *  //       }
 *  //     }
 *  //   }
 *  // }
 *
 *  ------------------------------------------------------------------------
 *  Parameters
 *  ------------------------------------------------------------------------
 *  @param {Array<string>} sources
 *    An array of source file paths to include in the tree.
 *
 *  @returns {Object}
 *    A nested tree object representing directory hierarchy and filesets.
 *
 *  ------------------------------------------------------------------------
 *  Design Notes
 *  ------------------------------------------------------------------------
 *  - Purely structural: does not perform file system checks or I/O.
 *  - Idempotent and deterministic: same input produces identical tree structure.
 *  - Supports both forward-slash and backslash path separators.
 */
module.exports.tree = function tree( sources ) {
  let    branch = undefined;
  return ( sources || []).reduce(( tree, src ) => {
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
                  const dest = `${ pathmodule.parse( node ).name }.md`;
                  branch[ SYMBOL_FILES ].push({ src, dest });
             }
           });
    return tree;
  }, { });
}

/**
 *  Collapse leading linear wrapper levels of a destination tree.
 *
 *  This function removes artificial top-level path segments introduced
 *  during tree construction, as long as those segments:
 *    - do not contain {@link SYMBOL_FILES}, and
 *    - contain exactly one enumerable child key.
 *
 *  The operation recurses until one of the following conditions is met:
 *    1. The current node contains {@link SYMBOL_FILES}.
 *    2. The current node has zero enumerable keys.
 *    3. The current node has more than one enumerable key.
 *
 *  ------------------------------------------------------------------------
 *  Architectural Role
 *  ------------------------------------------------------------------------
 *  `unwrapLinearRoot` is a structural normalization step that eliminates
 *  non-semantic wrapper levels in a filesystem-derived tree. It ensures
 *  that the root node of the tree reflects meaningful documentation
 *  structure for rendering and API index computation.
 *
 *  ------------------------------------------------------------------------
 *  Structural Semantics
 *  ------------------------------------------------------------------------
 *  - Operates on the root chain of the tree only.
 *  - Unwraps the longest leading chain of single-child nodes.
 *  - Does not traverse or mutate internal branches or fileset objects.
 *  - Returns a reference to an existing subtree node; the original tree
 *    structure may be partially shared.
 *
 *  ------------------------------------------------------------------------
 *  Edge Cases
 *  ------------------------------------------------------------------------
 *  - Empty tree → returns `{}`.
 *  - Root contains {@link SYMBOL_FILES} → unchanged.
 *  - Multiple root branches → unchanged.
 *
 *  ------------------------------------------------------------------------
 *  Purity and Side Effects
 *  ------------------------------------------------------------------------
 *  - Purely structural; no filesystem access.
 *  - No logging.
 *  - No mutation of input nodes beyond root-level reference adjustment.
 *
 *  @example
 *  const desttree = { src: { lib: { [SYMBOL_FILES]: [...], fun:{ ... }}}};
 *  const reduced  = module.exports.unwrapLinearRoot(desttree);
 *  // => reduced: { [SYMBOL_FILES]: [...], fun:{ ... }} 
 *
 *  @param {Object} dsttree
 *    Tree of src/dst mappings produced by `tree()`.
 *
 *  @returns {Object}
 *    A structurally normalized tree with leading linear wrapper levels
 *    removed when applicable.
 */
module.exports.unwrapLinearRoot = function unwrapLinearRoot( dsttree ) {
  if (!dsttree) { return dsttree }

  let keys = undefined
  if ( dsttree[ SYMBOL_FILES ]) { return dsttree; }
  else keys = Object.keys( dsttree );

  /* istanbul ignore if: not required */
  if ( keys.length < 1 ) { return { }; }
  else if ( keys.length > 1 ) { return dsttree; }
  else return module.exports.unwrapLinearRoot( dsttree[ keys[ 0 ]] );
}

/**
 *  Render one or more source files into a structured destination directory.
 *
 *  This function orchestrates the transformation of a flat list of source
 *  files (`file.src`) into a normalized tree, delegates rendering to
 *  {@link renderTree}, and optionally generates an aggregated API index
 *  via {@link renderApiIndex}.
 *
 *  ------------------------------------------------------------------------
 *  Architectural Role
 *  ------------------------------------------------------------------------
 *  Acts as the coordination layer between:
 *    - Grunt's file configuration model (`file.src` / `file.dest`)
 *    - Internal tree representation (`tree()` + `unwrapLinearRoot()`)
 *    - Recursive renderer (`renderTree`)
 *    - Optional API index generator (`renderApiIndex`)
 *
 *  Responsibilities:
 *    1. Validate source presence
 *    2. Build and normalize a destination tree
 *    3. Compute relative link context for index generation
 *    4. Delegate rendering and index creation
 *
 *  ------------------------------------------------------------------------
 *  Processing Pipeline
 *  ------------------------------------------------------------------------
 *  1. Validate `file.src` using `srcMissing`
 *     → Missing sources result in a warning and early resolution.
 *
 *  2. Build destination tree:
 *        `tree(file.src)`
 *
 *  3. Remove leading linear wrapper levels:
 *        `unwrapLinearRoot(dsttree)`
 *
 *  4. Render:
 *     - If `options.index !== false`:
 *         - Compute relative path from index destination to module root
 *         - Call `renderTree`
 *         - Then call `renderApiIndex`
 *     - Otherwise:
 *         - Call `renderTree` only
 *
 *  ------------------------------------------------------------------------
 *  Index Integration Semantics
 *  ------------------------------------------------------------------------
 *  When index generation is enabled:
 *    - `options.index.dest` defines the index output file
 *    - Relative base path determines `treepath` for `renderTree`
 *    - Influences generated `meta.href` values in filesets
 *
 *  ------------------------------------------------------------------------
 *  Error and Warning Behavior
 *  ------------------------------------------------------------------------
 *  - Missing sources → warning + resolved Promise
 *  - Rendering failures → propagated rejection
 *  - Index generation failure → warning + rethrow
 *  - Structural anomalies are handled by `renderTree`
 *
 *  ------------------------------------------------------------------------
 *  Side Effects
 *  ------------------------------------------------------------------------
 *  - Emits warnings via Grunt logging
 *  - Delegates directory creation and file writes through `renderTree` and `renderApiIndex`
 *  - No external state is mutated directly
 *
 *  ------------------------------------------------------------------------
 *  Design Notes
 *  ------------------------------------------------------------------------
 *  - Assumes `options` is normalized
 *  - Assumes `file.dest` refers to a directory
 *  - Relies on deterministic sequential rendering in `renderTree`
 *  - Tree reduction is structural only and does not mutate filesets
 *
 *  @param {grunt} grunt
 *    The Grunt instance used for logging and filesystem operations.
 *
 *  @param {grunt.task} task
 *    The currently executing Grunt task context.
 *
 *  @param {Object} file
 *    Grunt file descriptor containing:
 *      - `src` → Array<string>
 *      - `dest` → Destination directory path
 *
 *  @param {Object} options
 *    Normalized jsdoc2md rendering options, including optional `index`
 *    configuration.
 *
 *  @returns {Promise<boolean|void>}
 *    Resolves when rendering (and optional index generation) completes.
 *    Resolves `true` if skipped due to missing sources.
 */
module.exports.filesToDirectory = async function filesToDirectory( grunt, task, file, options ) {
  if ( module.exports.srcMissing( grunt, file )) {
       log( grunt, "warn", "filesToDirectory", "validation", WARN_MISSING_SRC, `file.dest="${ file.dest }"` );
       return true;
  }

  const srctree = module.exports.tree( file.src );             // build tree
  const dsttree = module.exports.unwrapLinearRoot( srctree );  // remove empty base like cwd/src/...

  if ( !dsttree ) {
       log( grunt, "warn", "filesToDirectory", "destination tree", "missing destination tree", `srctree="${ srctree }"` );
       return true;
  }
  // last parameter is "treepath", which will define what context.meta.href
  // looks like. 'href' must map the relative path from the api index markdown
  // to the subsequent api module markdowns.
  if ( options.index !== false ) {
      const  basepath = pathmodule.dirname( options.index.dest );
      let    relpath  = pathmodule.relative( basepath, file.dest );
              relpath  = relpath.replace( /[\\]/g, "/" );

      try {
        await module.exports.renderTree( grunt, task, options, file.dest, dsttree, [ relpath ]);
        await module.exports.renderApiIndex( grunt, task, file, options, dsttree );
      } catch( error ) {
        log( grunt, "warn", "filesToDirectory", "rendering", "Cannot render API Index due to error", `${ error }` );
        throw error;
      }
  }
  else await module.exports.renderTree( grunt, task, options, file.dest, dsttree, [ "." ]);
}

/**
 *  Render one or more source files into a single aggregated Markdown file.
 *
 *  This function represents the *file mode* execution path of the task.
 *  Unlike directory mode (`filesToDirectory`), no structural tree is created.
 *  All provided source files are rendered into exactly one destination file.
 *
 *  ------------------------------------------------------------------------
 *  Architectural Role
 *  ------------------------------------------------------------------------
 *  Acts as a minimal orchestration layer between:
 *    - Grunt's file configuration (`file.src` / `file.dest`)
 *    - The low-level rendering primitive (`render`)
 *
 *  Responsibilities:
 *    - Validate source presence
 *    - Ensure parent directory exists
 *    - Construct render options
 *    - Delegate rendering to `render`
 *
 *  ------------------------------------------------------------------------
 *  Processing Pipeline
 *  ------------------------------------------------------------------------
 *  1. Validate `file.src` using `srcMissing`
 *     → Missing or empty sources result in a warning and early resolution.
 *
 *  2. Ensure parent directory of `file.dest` exists.
 *
 *  3. Construct render options:
 *         { ...options, files: [ ...file.src ] }
 *
 *  4. Delegate rendering to `render`, which:
 *     - invokes jsdoc-to-markdown
 *     - writes the Markdown file
 *     - propagates any rendering errors
 *
 *  ------------------------------------------------------------------------
 *  Data Contract
 *  ------------------------------------------------------------------------
 *  `file` must contain:
 *      {
 *        src:  Array<string>,   // one or more source files
 *        dest: string           // target markdown file (not directory)
 *      }
 *
 *  Only minimal validation is performed (`srcMissing`).
 *
 *  ------------------------------------------------------------------------
 *  Error Semantics
 *  ------------------------------------------------------------------------
 *  - Missing sources → warning + resolved Promise(true)
 *  - Rendering failures → propagated rejection from `render`
 *
 *  ------------------------------------------------------------------------
 *  Side Effects
 *  ------------------------------------------------------------------------
 *  - Creates the destination directory if it does not exist
 *  - Writes exactly one Markdown file
 *  - Emits warnings via Grunt logging
 *
 *  ------------------------------------------------------------------------
 *  Design Notes
 *  ------------------------------------------------------------------------
 *  - Assumes `options` is already normalized
 *  - Assumes `file.dest` is a file path
 *  - Rendering is atomic: all sources are processed in a single `jsdoc-to-markdown` invocation
 *
 *  @param {grunt} grunt
 *    The Grunt instance used for filesystem operations and logging.
 *
 *  @param {grunt.task} task
 *    The currently executing Grunt task context.
 *
 *  @param {Object} file
 *    Grunt file descriptor containing `src` and `dest`.
 *
 *  @param {Object} options
 *    Normalized jsdoc2md rendering options.
 *
 *  @returns {Promise<boolean|void>}
 *    Resolves `true` if skipped due to missing sources.
 *    Otherwise resolves when rendering and file writing complete.
 */
module.exports.filesToFile = async function filesToFile( grunt, task, file, options ) {
  if ( module.exports.srcMissing( grunt, file )) {
       log( grunt, "warn", "filesToFile", "validation", WARN_MISSING_SRC, `file.dest="${ file.dest }"` );
       return true;
  }
  else {
       grunt.file.mkdir( pathmodule.dirname( file.dest ));
       const renderOptions = { ...options, files: [ ...file.src ]};
       return module.exports.render( grunt, task, renderOptions, { file: file.dest });
  }
}

/**
 *  Determine rendering mode (directory or single file) and dispatch rendering.
 *
 *  This function decides whether to render multiple source files into a
 *  destination directory or a single aggregated Markdown file based on
 *  the `file.dest` path.
 *
 *  ------------------------------------------------------------------------
 *  Architectural Role
 *  ------------------------------------------------------------------------
 *  `get` is the high-level orchestration entry point for rendering:
 *    - Delegates to `filesToDirectory` if `file.dest` is a directory
 *    - Delegates to `filesToFile` if `file.dest` is a file
 *
 *  It performs minimal preprocessing:
 *    - Ensures destination directories exist if implied by `file.dest`
 *
 *  ------------------------------------------------------------------------
 *  Processing Logic
 *  ------------------------------------------------------------------------
 *  1. Check if `file.dest` exists and is a directory
 *     → call `filesToDirectory`
 *
 *  2. Check if `file.dest` ends with a path separator
 *     → create directory, then call `filesToDirectory`
 *
 *  3. Otherwise, treat `file.dest` as a file path
 *     → call `filesToFile`
 *
 *  This ensures a consistent and deterministic dispatch based on the
 *  destination type.
 *
 *  ------------------------------------------------------------------------
 *  Error Semantics
 *  ------------------------------------------------------------------------
 *  - Propagates any rejection from delegated functions (`filesToDirectory` or `filesToFile`)
 *  - No additional error wrapping or logging is performed
 *
 *  ------------------------------------------------------------------------
 *  Side Effects
 *  ------------------------------------------------------------------------
 *  - May create destination directories if implied by `file.dest`
 *  - Delegates rendering and file writing to lower-level functions
 *
 *  @param {grunt} grunt
 *    The Grunt instance used for filesystem operations and logging.
 *
 *  @param {grunt.task} task
 *    The currently executing Grunt task context.
 *
 *  @param {Object} file
 *    Grunt file descriptor containing `src` and `dest`.
 *
 *  @param {Object} options
 *    Normalized jsdoc2md rendering options.
 *
 *  @returns {Promise<boolean|void>}
 *    Resolves `true` if skipped due to missing sources.
 *    Otherwise resolves when delegated rendering completes.
 */
module.exports.get = async function get( grunt, task, file, options ) {
  // console.log( `${ task.name }:${ task.target }` );
  if ( grunt.file.isDir( file.dest )) {
       // write one or more files to an existing directory
       return module.exports.filesToDirectory( grunt, task, file, options );
  }
  else if (( file.dest.endsWith( "/"  )) ||
           ( file.dest.endsWith( "\\" ))) {
       // prepare target directory
       grunt.file.mkdir( file.dest );
       // write one or more files to an existing directory
       return module.exports.filesToDirectory( grunt, task, file, options );
  }
  else return module.exports.filesToFile( grunt, task, file, options );
}

/**
 *  Execute the jsdoc2md task for all configured file targets.
 *
 *  This function is the execution entry point for a single Grunt
 *  multitask run. It retrieves normalized task options, iterates
 *  over all configured file descriptors (`task.files`), and delegates
 *  processing to the dispatcher (`get`).
 *
 *  ------------------------------------------------------------------------
 *  Architectural Role
 *  ------------------------------------------------------------------------
 *  `runTask` coordinates task-level execution without performing
 *  rendering itself. It:
 *    1. Resolves normalized options via `optsmodule.get`.
 *    2. Dispatches each file descriptor to `get`.
 *    3. Aggregates all returned Promises using `Promise.all`.
 *
 *  Rendering for multiple file targets occurs in parallel, respecting
 *  the concurrency semantics of Promises.
 *
 *  ------------------------------------------------------------------------
 *  Grunt Integration Contract
 *  ------------------------------------------------------------------------
 *  - `task.files` follows Grunt's standard files array format:
 *      https://gruntjs.com/configuring-tasks#files-array-format
 *  - Each file descriptor contains:
 *      { src: Array<string>, dest: string }
 *  - Structural interpretation and rendering are delegated to `get`.
 *
 *  ------------------------------------------------------------------------
 *  Concurrency and Error Semantics
 *  ------------------------------------------------------------------------
 *  - All file targets are processed concurrently.
 *  - Fail-fast behavior is enforced: if any delegated Promise rejects,
 *    the entire task rejects.
 *  - No internal error transformation or recovery is performed.
 *
 *  ------------------------------------------------------------------------
 *  Side Effects
 *  ------------------------------------------------------------------------
 *  - Filesystem and logging effects are produced indirectly via `get`.
 *  - No direct filesystem operations are performed within this function.
 *
 *  ------------------------------------------------------------------------
 *  Design Constraints
 *  ------------------------------------------------------------------------
 *  - Assumes `optsmodule.get` produces fully normalized options.
 *  - Assumes `get` returns a Promise per file descriptor.
 *  - Maintains strict separation between orchestration and rendering.
 *
 *  @param {grunt} grunt
 *    The Grunt instance used for option resolution and delegated operations.
 *
 *  @param {grunt.task} task
 *    The currently executing Grunt multitask context.
 *
 *  @returns {Promise<Array<unknown>>}
 *    Resolves when all file targets have completed, or rejects if any
 *    target fails.
 */
module.exports.runTask = async function runTask( grunt, task ) {
  const options = optsmodule.get( grunt, task );
  const promises = task.files.map(( file ) => {
    return module.exports.get( grunt, task, file, options );
  })
  return Promise.all( promises );
}

/**
 *  Registers the 'jsdoc2md' Grunt multitask.
 *
 *  This function sets up a multitask under the configured task name and description.
 *  The registered task delegates execution to `runTask`, handling all file
 *  targets configured in the Grunt task.
 *
 *  ------------------------------------------------------------------------
 *  Error Handling
 *  ------------------------------------------------------------------------
 *  - Any rejection from `runTask` is caught.
 *  - Errors are logged via `grunt.log.error`.
 *  - `grunt.fail.fatal` is invoked to mark the task as failed.
 *  - This ensures proper termination of the Grunt process on fatal errors.
 *
 *  ------------------------------------------------------------------------
 *  Design Notes
 *  ------------------------------------------------------------------------
 *  - The async function is the last step in the promise chain to guarantee
 *    that errors are properly propagated and logged.
 *  - Maintains a strict separation between task registration and execution.
 *
 *  @param {grunt} grunt
 *    The Grunt instance used to register the multitask.
 */
module.exports.registerMultiTask = function registerMultiTask( grunt ) {
  grunt.registerMultiTask( constants.TASKNAME, constants.TASKDESCRIPTION,
    /* istanbul ignore next */ async function () {
      const task = this;
      try {
        await module.exports.runTask( grunt, task );
      } catch ( error ) {
        grunt.log.error( error );
        grunt.fail.fatal( error );
      }
    });
}