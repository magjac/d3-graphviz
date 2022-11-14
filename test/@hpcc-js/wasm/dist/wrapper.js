const vizURL = 'node_modules/@hpcc-js/wasm/dist/graphviz.umd.js';
importScripts(vizURL);
self["@hpcc-js/wasm"] = global["@hpcc-js/wasm"];
global.document = {};
