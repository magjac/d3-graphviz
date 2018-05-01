var tape = require("tape");
var jsdom = require("./jsdom");
var deepEqualData = require("./deepEqualData");
var d3 = require("d3-selection");
var d3_graphviz = require("../");
var translateDAttribute = require("./svg").translateDAttribute;

tape("Verify that cylinder shape is drawn exactly as Graphviz does.", function(test) {
    var window = global.window = jsdom('<div id="expected-graph"></div><div id="actual-graph"></div>');
    var document = global.document = window.document;
    var expectedGraph = d3.select("#expected-graph");
    var actualGraph = d3.select("#actual-graph");
    var expectedGraphviz = d3_graphviz.graphviz("#expected-graph");
    var actualGraphviz = d3_graphviz.graphviz("#actual-graph");

    expectedGraphviz
        .zoom(false)
        .renderDot('digraph {a [shape="cylinder"]}', function () {
            actualGraphviz
                .renderDot('digraph {}', function () {
                    var x = 27;
                    var y = -18;
                    actualGraphviz
                        .drawNode(x, y, 'a', {shape: 'cylinder', id: 'node1'})
                        .insertDrawnNode('a');

                    expectedNodeGroup = expectedGraph.selectAll('.node');
                    expectedNodeTitle = expectedNodeGroup.selectAll('title');
                    expectedNodeShapes = expectedNodeGroup.selectAll('path');
                    expectedNodeText = expectedNodeGroup.selectAll('text');

                    actualNodeGroup = actualGraph.selectAll('.node');
                    actualNodeTitle = actualNodeGroup.selectAll('title');
                    actualNodeShapes = actualNodeGroup.selectAll('path');
                    actualNodeText = actualNodeGroup.selectAll('text');

                    var bbox = expectedNodeShapes.node().getBBox();
                    bbox.cx = bbox.x + bbox.width / 2;
                    bbox.cy = bbox.y + bbox.height / 2;
                    var xoffs = x - bbox.cx;
                    var yoffs = y - bbox.cy;

                    test.equal(actualNodeGroup.attr("id"), expectedNodeGroup.attr("id"), 'id of group');

                    test.equal(actualNodeTitle.text(), expectedNodeTitle.text(), 'text of title');

                    actualNodeShapes.each(function(d, i, nodes) {
                        var actualNodeShape = d3.select(this);
                        var expectedNodeShape = d3.select(expectedNodeShapes.nodes()[i]);
                        test.equal(actualNodeShape.attr("fill"), expectedNodeShape.attr("fill"), 'fill of path ' + (i + 1));
                        test.equal(actualNodeShape.attr("stroke"), expectedNodeShape.attr("stroke"), 'stroke of path '  + (i + 1));
                        test.equal(actualNodeShape.attr("d"), translateDAttribute(expectedNodeShape.attr("d"), xoffs, yoffs), 'd of path ' + (i + 1));
                    });
                    test.equal(actualNodeText.attr("text-anchor"), expectedNodeText.attr("text-anchor"), 'text-anchor of text');
                    test.equal(+actualNodeText.attr("x") - xoffs, +expectedNodeText.attr("x"), 'x of text');
                    test.equal(+actualNodeText.attr("y") - yoffs, +expectedNodeText.attr("y"), 'y of text');
                    test.equal(actualNodeText.attr("font-family"), expectedNodeText.attr("font-family"), 'font-family of text');
                    test.equal(actualNodeText.attr("font-size"), expectedNodeText.attr("font-size"), 'font-size of text');
                    test.equal(actualNodeText.attr("fill"), expectedNodeText.attr("fill"), 'fill of text');

                    test.equal(actualNodeText.text(), expectedNodeText.text(), 'text of node group');

                    var actualNodeGroupDatum = actualNodeGroup.datum();
                    var expectedNodeGroupDatum = expectedNodeGroup.datum();
                    delete expectedNodeGroupDatum.parent;
                    deepEqualData(test, actualNodeGroupDatum, expectedNodeGroupDatum, 'data of drawn node of shape equals Graphviz generated data');

                    test.end();
                });
        });
});
