import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3_graphviz from "../index.js";
import * as d3_selection from "d3-selection";

it("engine() selects which graphviz layout engine to use.", async () => {
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
            .engine('dot')
            .renderDot('digraph {a -> b;}', resolve);
    });

    assert.ok(d3_selection.select('svg').attr('width', '62pt'), 'The "dot" engine generates an SVG with width 62pt');
    assert.ok(d3_selection.select('svg').attr('height', '116pt'), 'The "dot" engine generates an SVG with height 116pt');

});

it("engine() selects which graphviz layout engine to use.", async () => {
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
            .engine('circo')
            .renderDot('digraph {a -> b;}', resolve);
    });

    assert.ok(d3_selection.select('svg').attr('width', '188pt'), 'The "dot" engine generates an SVG with width 188pt');
    assert.ok(d3_selection.select('svg').attr('height', '44pt'), 'The "dot" engine generates an SVG with height 44pt');

});
