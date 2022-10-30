/* This file is excluded from coverage because the intrumented code
 * translates "self" which gives a reference error.
 */

/* c8 ignore start */

export function workerCodeBody(port) {

    self.document = {}; // Workaround for "ReferenceError: document is not defined" in hpccWasm

    port.addEventListener('message', function(event) {
        let hpccWasm = self["@hpcc-js/wasm"];
        if (hpccWasm == undefined && event.data.vizURL) {
            global.document = { currentScript: { src: event.data.vizURL } };
            importScripts(event.data.vizURL);
            hpccWasm = self["@hpcc-js/wasm"];
            //hpccWasm.wasmFolder("node_modules/@hpcc-js/wasm/dist/graphvizlib.wasm");
            hpccWasm.wasmFolder("/home/magjac/d3-graphviz/node_modules/@hpcc-js/wasm/dist");

                        // This is an alternative workaround where wasmFolder() is not needed
//                                    document = {currentScript: {src: event.data.vizURL}};
        }

        if (event.data.type == "version") {
            hpccWasm.graphvizVersion().then((version) => {
                port.postMessage({
                    type: "version",
                    version: version,
                });
            });
            return;
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
}

export function workerCode() {
    const port = self;
    workerCodeBody(port);
}

export function sharedWorkerCode() {
    self.onconnect = function(e) {
        const port = e.ports[0];
        workerCodeBody(port);
        port.start();
    }
}

/* c8 ignore stop */
