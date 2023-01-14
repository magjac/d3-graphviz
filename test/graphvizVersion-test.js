import jsdom from "./jsdom.js";
import tape from "./tape.js";
import * as d3_graphviz from "../index.js";

tape("graphviz().graphvizVersion() return the Graphviz version.", async function (test) {
    global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;

    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    const version = graphviz.graphvizVersion();
    if (version == undefined) {
        test.fail("version is not defined")
    }
    else {
        const [major, minor, patch] = version.split('.');
        test.ok(!isNaN(major), 'Major version number is a number');
        test.ok(!isNaN(minor), 'Minor version number is a number');
        test.ok(!isNaN(patch), 'Patch version number is a number');
    }

    test.end();
});
