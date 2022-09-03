import assert from "assert";
import {select as d3_select} from "d3-selection";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";

const html = '<div id="graph"></div>';

it("data() returns the data saved by dot().", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on("initEnd", function () {

            var savedData;
            var attachedData;

            var noData = graphviz.data();
            assert.equal(noData, null, 'Data is not avaliable before calling dot()');

            graphviz
                .dot('digraph {a -> b;}', () => {
                    savedData = graphviz.data();
                    assert.notEqual(savedData, null, 'Data is avaliable after calling dot()');
                })
               .render(() => {
                   savedData = graphviz.data();
                   assert.notEqual(savedData, null, 'Data is still avaliable after calling render()');
                   assert.equal(savedData, d3_select("#graph").selectAll("svg").datum(), 'The retrieved data is the same as the data attached to the #graph element');

                   resolve();
               });
        });

}));
