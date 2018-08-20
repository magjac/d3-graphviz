var tape = require("tape"),
    jsdom = require("./jsdom"),
    d3 = require("d3-selection"),
    d3_graphviz = require("../");

tape("data() returns the data saved by dot().", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var savedData;
    var attachedData;

    var noData = graphviz.data();
    test.equal(noData, null, 'Data is not avaliable before calling dot()');

    graphviz
        .dot('digraph {a -> b;}', () => {
            savedData = graphviz.data();
            test.notEqual(savedData, null, 'Data is avaliable after calling dot()');
        })
       .render(() => {
           savedData = graphviz.data();
           test.notEqual(savedData, null, 'Data is still avaliable after calling render()');
           test.equal(savedData, d3.select("#graph").selectAll("svg").datum(), 'The retrieved data is the same as the data attached to the #graph element');

           test.end();
       });
});
