import tape from "./tape.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";

tape("data() returns the data saved by dot().", async function (test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;

    var graphviz = d3_graphviz.graphviz("#graph");
    await new Promise(resolve => {
        graphviz
            .on("initEnd", resolve);
    });

    var savedData;

    var noData = graphviz.data();
    test.equal(noData, null, 'Data is not avaliable before calling dot()');

    await new Promise(resolve => {
        graphviz
            .dot('digraph {a -> b;}', () => {
                savedData = graphviz.data();
                test.notEqual(savedData, null, 'Data is avaliable after calling dot()');
            })
            .render(resolve);
    });

    savedData = graphviz.data();
    test.notEqual(savedData, null, 'Data is still avaliable after calling render()');
    test.equal(savedData, d3.select("#graph").selectAll("svg").datum(), 'The retrieved data is the same as the data attached to the #graph element');

    test.end();
});
