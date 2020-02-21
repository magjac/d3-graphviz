import { graphviz, wasmFolder } from "@hpcc-js/wasm";

/*
Sometimes you need to override the default URL for runtime loading of the wasm file:
* Third party bundles 
* Some worker pages

wasmFolder("./node_modules/@hpcc-js/wasm/dist");
wasmFolder("https://cdn.jsdelivr.net/npm/@hpcc-js/wasm@0.3.3/dist");
*/

export default function Viz(dotStr, options) {
    return graphviz.layout(dotStr, options && options.format ? options.format : "svg", "dot");
}
