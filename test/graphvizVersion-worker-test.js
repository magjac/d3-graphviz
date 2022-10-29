import assert from "assert";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";
import Worker from "tiny-worker";

const html = `
    <script src="http://dummyhost/test/@hpcc-js/wasm/dist/wrapper.js" type="javascript/worker"></script>
    <div id="graph"></div>
    `;

it("graphviz().graphvizVersion() returns the Graphviz version (worker version)", html, () => new Promise(resolve => {
    global.Blob = function (jsarray) {
        return new Function(jsarray[0]);
    }
    window.URL.createObjectURL = function (js) {
        return js;
    }
    global.Worker = Worker;

    console.log("magjac 040");
    //var graphviz = d3_graphviz("#graph", { useWorker: false }) // this works
    var graphviz = d3_graphviz("#graph", { useWorker: true })
        .logEvents(true)
        .on("initEnd", startTest);

    function startTest() {
        console.log("magjac 050");
        const version = graphviz.graphvizVersion();
        if (version == undefined) {
            assert.fail("version is not defined")
        }
        else {
            const [major, minor, patch] = version.split('.');
            assert.ok(!isNaN(major), 'Major version number is a number');
            assert.ok(!isNaN(minor), 'Minor version number is a number');
            assert.ok(!isNaN(patch), 'Patch version number is a number');
        }

        console.log("magjac 100.");
        graphviz._worker.terminate();
        console.log("magjac 110.");
        global.Worker = undefined;
        console.log("magjac 120.");
        resolve()
        console.log("magjac 130.");
    }
}));
