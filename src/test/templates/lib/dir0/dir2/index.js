"use strict";

function test() { return "test"; }

Object.defineProperty( module.exports, "test", {
       value:    test,
       writable: false, enumerable: true, configurable: false });
