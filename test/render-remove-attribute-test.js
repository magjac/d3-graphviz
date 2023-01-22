import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_transition from "d3-transition";
import * as d3_graphviz from "../index.js";

it("graphviz().render() removes attribute from SVG element when attribute is removed from Graphviz node.", async () => {

    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;

    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .renderDot('digraph {a [style=dashed]}', resolve);
    });

    assert.equal(d3.selectAll('ellipse').attr('stroke-dasharray'), '5,2', 'stroke-dasharray is present when style="dashed"');

    await new Promise(resolve => {
        graphviz
            .renderDot('digraph {a}', resolve);
    });

    assert.equal(d3.selectAll('ellipse').attr('stroke-dasharray'), null, 'stroke-dasharray not present when style is not used');

});
