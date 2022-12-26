import tape from "./tape.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";

tape(".destroy() deletes the Graphviz instance from the container element", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph", {useWorker: false})
        .renderDot('digraph {a -> b;}', destroy);

    function destroy() {

        test.notEqual(d3.select("#graph").node().__graphviz__, undefined,
                       'Renderer instance shall exist before destroy');
        graphviz.destroy();
        test.equal(d3.select("#graph").node().__graphviz__, undefined,
                       'Renderer instance shall not exist after destroy');

        test.end();
    }
});
