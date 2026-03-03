/**
 * src/test/any/__mocks__/grunt.js
 *
 * Reversible Grunt mock for tests.
 *
 * Purpose:
 * - Patches the already loaded Grunt instance (singleton)
 * - Covers exactly the Grunt API surface used by grunt-jsdoc2md
 * - Simulates the Grunt runtime environment explicitly
 * - Allows each test to decide between real or mocked Grunt
 *
 * Design principles:
 * - No replacement of require("grunt"), only monkey-patching
 * - Fully reversible (apply / restore)
 * - Deterministic behavior
 * - Diagnostic-friendly (logs and calls are collected)
 *
 * Node >= 18
 */
"use strict";

const realGrunt = require("grunt");

/**
 * Internal storage for original implementations
 */
const _originals = new Map();

/**
 * Public state for test inspection
 */
const state = {
  logs: {
    ok: [],
    warn: [],
    error: []
  },
  fail: {
    warn: [],
    fatal: []
  },
  registeredTasks: [],
  taskInvocations: [],
  asyncCalls: [],
  mkdirs: [],
  reads: [],
  isDirChecks: []
};

module.exports.state = state;

/**
 * Patch helper
 */
function patch(obj, key, value) {
  if (!_originals.has(obj)) {
    _originals.set(obj, {});
  }

  const store = _originals.get(obj);

  if (!(key in store)) {
    store[key] = obj[key];
  }

  obj[key] = value;
}

/**
 * Create a mock task context (`this` inside a Grunt multi task)
 */
function createTaskContext(taskConfig = {}) {
  let asyncCalled = false;

  return {
    options(defaults = {}) {
      return { ...defaults, ...(taskConfig.options || {}) };
    },

    files: taskConfig.files || [],

    async() {
      asyncCalled = true;
      state.asyncCalls.push(true);

      return function done(err) {
        state.taskInvocations.push({ doneCalled: true, err });
      };
    }
  };
}

/**
 * Create mocked Grunt API fragments
 */
function createMock() {
  return {
    log: {
      ok(message) {
        state.logs.ok.push(message);
      },
      warn(message) {
        state.logs.warn.push(message);
      },
      error(message) {
        state.logs.error.push(message);
      }
    },

    fail: {
      warn(message) {
        state.fail.warn.push(message);
        throw new Error(`grunt.fail.warn: ${message}`);
      },
      fatal(error) {
        state.fail.fatal.push(error);
        throw error instanceof Error ? error : new Error(error);
      }
    },

    file: {
      isDir(path) {
        state.isDirChecks.push(path);
        return false;
      },
      mkdir(path) {
        state.mkdirs.push(path);
      },
      read(path, options) {
        state.reads.push({ path, options });
        return "";
      }
    },

    registerMultiTask(name, description, fn) {
      state.registeredTasks.push({ name, description, fn });

      // Expose an explicit invocation hook for tests
      fn.__invoke = function invoke(taskConfig) {
        const ctx = createTaskContext(taskConfig);
        return fn.call(ctx);
      };
    }
  };
}

/**
 * Apply the mock
 */
module.exports.apply = function apply() {
  const mock = createMock();

  patch(realGrunt, "log", mock.log);
  patch(realGrunt, "fail", mock.fail);
  patch(realGrunt, "file", mock.file);
  patch(realGrunt, "registerMultiTask", mock.registerMultiTask);

  return realGrunt;
};

/**
 * Restore original Grunt state
 */
module.exports.restore = function restore() {
  for (const [obj, props] of _originals.entries()) {
    for (const key of Object.keys(props)) {
      obj[key] = props[key];
    }
  }
  _originals.clear();
};

/**
 * Reset collected state
 */
module.exports.resetState = function resetState() {
  state.logs.ok.length = 0;
  state.logs.warn.length = 0;
  state.logs.error.length = 0;
  state.fail.warn.length = 0;
  state.fail.fatal.length = 0;
  state.registeredTasks.length = 0;
  state.taskInvocations.length = 0;
  state.asyncCalls.length = 0;
  state.mkdirs.length = 0;
  state.reads.length = 0;
  state.isDirChecks.length = 0;
};
