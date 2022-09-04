import assert from "assert";
import {select as d3_select} from "d3-selection";
import {transition as d3_transition} from "d3-transition";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";

const html = '<div id="graph"></div>';

it("graphviz.renderDot() generates a correct SVG from graphviz DOT with graph tooltip.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on('initEnd', startTest);

    const svgDoc = `<svg width="8pt" height="8pt" viewBox="0.00 0.00 8.00 8.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(4 4)">
<g id="a_graph0"><a title="G">
<polygon fill="white" stroke="none" points="-4,4 -4,-4 4,-4 4,4 -4,4"></polygon>
</a>
</g>
</g>
</svg>`;

    function startTest() {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .renderDot('digraph {graph [tooltip="G"]}');

        assert.equal(d3_select('div').html(), svgDoc, "SVG after initial rendering");

        resolve();
    }
}));

it("graphviz.transition().renderDot() generates a correct SVG from graphviz DOT with graph tooltip.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on('initEnd', startTest);

    const svgDoc = `<svg width="8pt" height="8pt" viewBox="0.00 0.00 8.00 8.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(4 4)">
<g id="a_graph0"><a title="G">
<polygon fill="white" stroke="none" points="-4,4 -4,-4 4,-4 4,4 -4,4"></polygon>
</a>
</g>
</g>
</svg>`;

    function startTest() {
        var transition = d3_transition().duration(0);
        graphviz
            .tweenShapes(false)
            .tweenPaths(false)
            .zoom(false)
//            .fade(false)
            .renderDot('digraph {graph [tooltip="G"]}');

        assert.equal(d3_select('div').html(), svgDoc, "SVG after initial rendering");

        graphviz
            .tweenShapes(false)
            .tweenPaths(false)
            .zoom(false)
//            .fade(false)
            .transition(transition)
            .renderDot('digraph {graph [tooltip="G"]}');

        transition
            .transition()
            .on("end", function() {
                assert.equal(d3_select('div').html(), svgDoc, "SVG after transition");
                resolve();
            });
    }

}));
