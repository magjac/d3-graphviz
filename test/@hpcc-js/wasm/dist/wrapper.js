importScripts('node_modules/@hpcc-js/wasm/dist/index.js');
self["@hpcc-js/wasm"] = global["@hpcc-js/wasm"];
importScripts('test/polyfill_fetch.js');
global.document = {};
