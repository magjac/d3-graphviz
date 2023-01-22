import jsdom from "./jsdom.js";
import assert from "assert";
import it from "./it.js";
import * as d3_graphviz from "../index.js";

it("graphviz().graphvizVersion() return the Graphviz version.", async () => {
    global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;

    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
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
