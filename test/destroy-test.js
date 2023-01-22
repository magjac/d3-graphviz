import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";

it(".destroy() deletes the Graphviz instance from the container element", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph", { useWorker: false });

    await new Promise(resolve => {
        graphviz
            .renderDot('digraph {a -> b;}', resolve);
    });

    assert.notEqual(d3.select("#graph").node().__graphviz__, undefined,
        'Renderer instance shall exist before destroy');
    graphviz.destroy();
    assert.equal(d3.select("#graph").node().__graphviz__, undefined,
        'Renderer instance shall not exist after destroy');

});
