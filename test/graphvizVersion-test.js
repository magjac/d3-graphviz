import assert from "assert";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";

const html = '<div id="graph"></div>';

it("graphviz().graphvizVersion() return the Graphviz version.", html, () => new Promise(resolve => {

    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    function startTest() {
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

        resolve();
    }
}));
