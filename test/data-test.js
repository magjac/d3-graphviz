import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";

it("data() returns the data saved by dot().", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;

    var graphviz = d3_graphviz.graphviz("#graph");
    await new Promise(resolve => {
        graphviz
            .on("initEnd", resolve);
    });

    var savedData;

    var noData = graphviz.data();
    assert.equal(noData, null, 'Data is not avaliable before calling dot()');

    await new Promise(resolve => {
        graphviz
            .dot('digraph {a -> b;}', () => {
                savedData = graphviz.data();
                assert.notEqual(savedData, null, 'Data is avaliable after calling dot()');
            })
            .render(resolve);
    });

    savedData = graphviz.data();
    assert.notEqual(savedData, null, 'Data is still avaliable after calling render()');
    assert.equal(savedData, d3.select("#graph").selectAll("svg").datum(), 'The retrieved data is the same as the data attached to the #graph element');

});
