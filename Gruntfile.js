/**
 *  © 2019, db-developer.
 *  Licensed under the MIT license.
 */
"use strict";

const path          = require( "path"            );
const strings       = require( "./.conf/strings" );

const env = {
  BUILDDIR:     `${ strings.BUILD }`,
  CONFDIR:      `${ strings.DOT   }${ strings.CONF }`,
  COVERAGEDIR:  path.join( `${ strings.DIST  }`, `${ strings.COVERAGE }` ),
  DOCSDIR:      `${ strings.DOCS  }`,
  DISTDIR:      `${ strings.DIST  }`,
  LIBDIR:       path.join( `${ strings.SRC   }`, `${ strings.LIB }`     ),
  SCRITPSDIR:   path.join( `${ strings.SRC   }`, `${ strings.SCRIPTS }` ),
  SRCDIR:       `${ strings.SRC   }`,
  STRINGS:      strings,
  TASKSDIR:     path.join( `${ strings.SRC   }`, `${ strings.TASKS }` ),
  TEMPLATEDIR:  path.join( `${ strings.SRC   }`, `${ strings.TEST  }`, `${ strings.TEMPLATE }` ),
  TESTDIR:      path.join( `${ strings.SRC   }`, `${ strings.TEST  }`, `${ strings.ANY }` ),
  TMPDIR:       path.join( `${ strings.SRC   }`, `${ strings.TEST  }`, `${ strings.TMP }` )
};

const GRUNTCONFDIR = path.join( process.cwd(), env.CONFDIR, strings.GRUNT );

module.exports = function( grunt ) {

  require( "load-grunt-config" )( grunt, { configPath: GRUNTCONFDIR, data: env });
  require( "load-grunt-tasks"  )( grunt );

  // run lint and all tests by default before packaging
  grunt.registerTask( strings.ALL,     [ strings.TEST, strings.DOCS, strings.BUILD,
                                         strings.DIST, strings.DEPLOY ]);

  // run lint and all tests by default before packaging
  grunt.registerTask( strings.BUILD,   [ strings.ESLINT,   `${ strings.CLEAN }:build`,
                                         strings.MKDIR,    `${ strings.COPY  }:build`,
                                         strings.JSONFILE, strings.BUILDRO ]);

  grunt.registerTask( strings.BUILDWP, [ strings.WEBPACK ]);

  grunt.registerTask( strings.BUILDRO, [ strings.ROLLUP  ]);

  // run coverage (required by travis)
  grunt.registerTask( strings.COVERAGE, [ strings.ESLINT, strings.CLEAN, strings.MKDIR,
                                          strings.NYCMOCHA ]);

  // run default
  grunt.registerTask( strings.DEFAULT, [ strings.ALL ]);

  // run deploy: copy current.tgz from dist to _packages_ current.tgz & latest.tgz
  grunt.registerTask( strings.DEPLOY,  [ `${ strings.COPY }:deploy` ]);

  // run dist: clean dist and move current.tgz from cwd to dist
  grunt.registerTask( strings.DIST,    [ `${ strings.CLEAN }:dist`, `${ strings.CALL_NPM }:pack` ]);

  // run docs (removed self task JSDOC2MD)
  grunt.registerTask( strings.DOCS,    [ strings.ESLINT ]);

  // run test
  grunt.registerTask( strings.TEST,    [ strings.CHKOUTDATED, strings.ESLINT, strings.CLEAN,
                                         strings.MKDIR,       strings.NYCMOCHA ]);
};
