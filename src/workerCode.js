/* This file is excluded from coverage because the intrumented code
 * translates "self" which gives a reference error.
 */

/* c8 ignore start */

export function workerCodeBody(port) {

    console.log("magjac 1100:");
    self.document = {}; // Workaround for "ReferenceError: document is not defined" in hpccWasm

    port.addEventListener('message', function(event) {
        console.log("magjac 1200: event =", event);
        let hpccWasm = self["@hpcc-js/wasm"];
        if (hpccWasm == undefined && event.data.vizURL) {
            console.log("magjac 1210: importScripts: ", event.data.vizURL);
            importScripts(event.data.vizURL);
            hpccWasm = self["@hpcc-js/wasm"];
            hpccWasm.wasmFolder(event.data.vizURL.match(/.*\//)[0]);
            // This is an alternative workaround where wasmFolder() is not needed
//                                    document = {currentScript: {src: event.data.vizURL}};
        }

        if (event.data.type == "version") {
            console.log("magjac 1105:");
            hpccWasm.graphvizVersion().then((version) => {
                port.postMessage({
                    type: "version",
                    version: version,
                });
            });
            console.log("magjac 1106:");
            return;
        }
        console.log("magjac 1110:");

        hpccWasm.graphviz.layout(event.data.dot, "svg", event.data.engine, event.data.options).then((svg) => {
            console.log("magjac 1150:");
            if (svg) {
                console.log("magjac 1160:");
                port.postMessage({
                    type: "done",
                    svg: svg,
                });
            } else if (event.data.vizURL) {
                console.log("magjac 1170:");
                port.postMessage({
                    type: "init",
                });
            } else {
                console.log("magjac 1180:");
                port.postMessage({
                    type: "skip",
                });
            }
        }).catch(error => {
            console.log("magjac 1190: error", error);
            port.postMessage({
                type: "error",
                error: error.message,
            });
        });
        console.log("magjac 1199:");
    });
}

export function workerCode() {
    console.log("magjac 1000:");
    const port = self;
    workerCodeBody(port);
}

export function sharedWorkerCode() {
    console.log("magjac 2000:");
    self.onconnect = function(e) {
        const port = e.ports[0];
        workerCodeBody(port);
        port.start();
    }
}

/* c8 ignore stop */
