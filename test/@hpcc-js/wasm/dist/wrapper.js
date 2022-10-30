importScripts('test/polyfill_fetch.js');
importScripts('node_modules/@hpcc-js/wasm/dist/index.js');
self["@hpcc-js/wasm"] = global["@hpcc-js/wasm"];
global.document = {};
