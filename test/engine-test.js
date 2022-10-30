import assert from "assert";
import {select as d3_select} from "d3-selection";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";

const html = '<div id="graph"></div>';

it("engine() selects which graphviz layout engine to use ('dot').", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    function startTest() {

        graphviz
            .zoom(false)
            .engine('dot')
            .renderDot('digraph {a -> b;}');

        assert.ok(d3_select('svg').attr('width', '62pt'), 'The "dot" engine generates an SVG with width 62pt');
        assert.ok(d3_select('svg').attr('height', '116pt'), 'The "dot" engine generates an SVG with height 116pt');

        resolve();
    }
}));

it("engine() selects which graphviz layout engine to use ('circo').", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    function startTest() {

        graphviz
            .zoom(false)
            .engine('circo')
            .renderDot('digraph {a -> b;}');

        assert.ok(d3_select('svg').attr('width', '188pt'), 'The "dot" engine generates an SVG with width 188pt');
        assert.ok(d3_select('svg').attr('height', '44pt'), 'The "dot" engine generates an SVG with height 44pt');

        resolve();
    }
}));
