import assert from "assert";
import {select as d3_select} from "d3-selection";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";

const html = '<div id="graph"></div>';

it(".destroy() deletes the Graphviz instance from the container element", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph", {useWorker: false})
        .renderDot('digraph {a -> b;}', destroy);

    function destroy() {

        assert.notEqual(d3_select("#graph").node().__graphviz__, undefined,
                       'Renderer instance shall exist before destroy');
        graphviz.destroy();
        assert.equal(d3_select("#graph").node().__graphviz__, undefined,
                       'Renderer instance shall not exist after destroy');

        resolve();
    }
}));
