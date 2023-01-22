import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3_graphviz from "../index.js";
import Worker from "tiny-worker";

describe("graphvizVersion()", () => {
    let graphviz;

    afterEach(() => {
        graphviz._worker.terminate();
        global.Worker = undefined;
    });

    it("graphviz().graphvizVersion() returns the Graphviz version.", async () => {

        var window = global.window = jsdom(
            `
                <script src="http://dummyhost/test/@hpcc-js/wasm/dist/wrapper.js" type="javascript/worker"></script>
                <div id="graph"></div>
                `,
        );
        global.document = window.document;
        global.Blob = function (jsarray) {
            return new Function(jsarray[0]);
        }
        var createObjectURL = window.URL.createObjectURL = function (js) {
            return js;
        }
        global.Worker = Worker;

        await new Promise(resolve => {
            graphviz = d3_graphviz.graphviz("#graph", { useWorker: true })
                .on("initEnd", resolve);
        });

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

    });
});
