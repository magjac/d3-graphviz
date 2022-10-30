importScripts('test/polyfill_fetch.js');
const vizURL = 'node_modules/@hpcc-js/wasm/dist/index.js';
global.document = { currentScript: { src: vizURL } };
importScripts(vizURL);
self["@hpcc-js/wasm"] = global["@hpcc-js/wasm"];
global.document = {};
