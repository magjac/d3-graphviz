import assert from "assert";
import {selectAll as d3_selectAll} from "d3-selection";
import {transition as d3_transition} from "d3-transition";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";

const html = '<div id="graph"></div>';

it("graphviz().render() removes attribute from SVG element when attribute is removed from Graphviz node.", html, () => new Promise(resolve => {


    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    function startTest() {
        graphviz
            .zoom(false)
            .renderDot('digraph {a [style=dashed]}', function() {
                assert.equal(d3_selectAll('ellipse').attr('stroke-dasharray'), '5,2', 'stroke-dasharray is present when style="dashed"');
                graphviz
                    .renderDot('digraph {a}', function () {
                        assert.equal(d3_selectAll('ellipse').attr('stroke-dasharray'), null, 'stroke-dasharray not present when style is not used');
                        resolve();
                    });
            });
    }
}));
