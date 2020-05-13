/* This file is excluded from coverage because the intrumented code
 * translates "self" which gives a reference error.
 */

/* istanbul ignore next */

export function workerCode() {

    self.document = {}; // Workaround for "ReferenceError: document is not defined" in hpccWasm

    self.onconnect = function(e) {
        const port = e.ports[0];
        port.addEventListener('message', function(event) {
            let hpccWasm = self["@hpcc-js/wasm"];
            if (hpccWasm == undefined && event.data.vizURL) {
                importScripts(event.data.vizURL);
                hpccWasm = self["@hpcc-js/wasm"];
                hpccWasm.wasmFolder(event.data.vizURL.match(/.*\//)[0]);
                // This is an alternative workaround where wasmFolder() is not needed
//                                    document = {currentScript: {src: event.data.vizURL}};
            }
            hpccWasm.graphviz.layout(event.data.dot, "svg", event.data.engine, event.data.options).then((svg) => {
                if (svg) {
                    port.postMessage({
                        type: "done",
                        svg: svg,
                    });
                } else if (event.data.vizURL) {
                    port.postMessage({
                        type: "init",
                    });
                } else {
                    port.postMessage({
                        type: "skip",
                    });
                }
            }).catch(error => {
                port.postMessage({
                    type: "error",
                    error: error.message,
                });
            });
        });
        port.start();
    }
}
