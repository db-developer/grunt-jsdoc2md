## make targets of gruntfile.js and package.json ##

This guide assumes, that you are familiar with the use of [git](https://git-scm.com/ "Homepage of GIT"), [npm](https://npmjs.com "Homepage of npm") and [grunt](https://gruntjs.com "Homepage of grunt").  

1. git fork [grunt-jsdoc2md plugin for grunt](https://github.com/db-developer/grunt-jsdoc2md) (https://github.com/db-developer/grunt-jsdoc2md.git)
2. cd into forked grunt-jsdoc2md directory
3. open a shell
4. make sure your environment knows about the paths to nodejs
5. run <code>npm install</code>

### testing ###

The code of grunt-jsdoc2md can be tested. A [mocha](https://mochajs.org/ "Homepage of mocha")/[istanbul](https://istanbul.js.org/ "Homepage of istanbul") testsuite is provided. See directory <code>test</code>.  
Open a shell to run the tests, make sure the environment is set, cd into the forked grunt-jsdoc2md directory and run: <code>grunt test</code>

### code coverage ###

With testing (see above) code coverage is available and can be configured by gruntfile.js.  
Open a shell to run code coverage, make sure the environment is set, cd into the forked grunt-jsdoc2md directory and run: <code>grunt coverage</code>.  
The results of a code coverage run are located in the directory <code>dist/coverage</code>.

### api docs ###

Open a shell to run generation of api docs. Make sure the environment is set, cd into the forked grunt-jsdoc2md directory and run: <code>grunt docs</code>.  
The result of api doc generation is located in the directory <code>´docs/api</code>.

### building ###

You have the choice of either simply creating grunt-json-&lt;version&gt;.tgz by running <code>grunt build</code> or to run all tests, code coverage and creating grunt-json-&lt;version&gt;.tgz by <code>grunt all</code>.  
All resulting files are located in the directory <code>dist</code>.

### npm integration ###

All grunt tasks can be run by npm. See the <code>script</code> section of <code>package.json</code>. Open a shell, make sure the environment is set, cd into the forked grunt-jsdoc2md directory and run:

* <code>npm run all</code> for a complete build run with testing, code coverage and library creation.
* <code>npm run build</code> for a quick build of the grunt-jsdoc2md library.
* <code>npm run coverage</code> for running code coverage.
* <code>npm run test</code> for running tests.

### feedback ###
Do you feel this guide is missing essential information? Found any typos or amused by the translation? Please do not hesitate to file an issue on github!
