var tape = require("tape");
var jsdom = require("./jsdom");
var deepEqualData = require("./deepEqualData");
var d3 = require("d3-selection");
var d3_graphviz = require("../");
var translatePointsAttribute = require("./svg").translatePointsAttribute;

tape("Verify that rect shape is drawn exactly as Graphviz does.", function(test) {
    var window = global.window = jsdom('<div id="expected-graph"></div><div id="actual-graph"></div>');
    var document = global.document = window.document;
    var expectedGraph = d3.select("#expected-graph");
    var actualGraph = d3.select("#actual-graph");
    var expectedGraphviz = d3_graphviz.graphviz("#expected-graph");
    var actualGraphviz = d3_graphviz.graphviz("#actual-graph");

    expectedGraphviz
        .zoom(false)
        .renderDot('digraph {a [shape="rect"]}', function () {
            actualGraphviz
                .renderDot('digraph {}', function () {
                    var x = 27;
                    var y = -18;
                    actualGraphviz
                        .drawNode(x, y, 'a', {shape: 'rect', id: 'node1'})
                        .insertDrawnNode('a');

                    expectedNodeGroup = expectedGraph.selectAll('.node');
                    expectedNodeTitle = expectedNodeGroup.selectAll('title');
                    expectedNodeShape = expectedNodeGroup.selectAll('polygon');
                    expectedNodeText = expectedNodeGroup.selectAll('text');

                    actualNodeGroup = actualGraph.selectAll('.node');
                    actualNodeTitle = actualNodeGroup.selectAll('title');
                    actualNodeShape = actualNodeGroup.selectAll('polygon');
                    actualNodeText = actualNodeGroup.selectAll('text');

                    var bbox = expectedNodeShape.node().getBBox();
                    bbox.cx = bbox.x + bbox.width / 2;
                    bbox.cy = bbox.y + bbox.height / 2;
                    xoffs = x - bbox.cx;
                    yoffs = y - bbox.cy;

                    test.equal(actualNodeGroup.attr("id"), expectedNodeGroup.attr("id"), 'id of group');

                    test.equal(actualNodeTitle.text(), expectedNodeTitle.text(), 'text of title');

                    test.equal(actualNodeShape.attr("fill"), expectedNodeShape.attr("fill"), 'fill of polygon');
                    test.equal(actualNodeShape.attr("stroke"), expectedNodeShape.attr("stroke"), 'stroke of polygon');
                    test.equal(actualNodeShape.attr("points"), translatePointsAttribute(expectedNodeShape.attr("points"), xoffs, yoffs), 'points of polygon');

                    test.equal(actualNodeText.attr("text-anchor"), expectedNodeText.attr("text-anchor"), 'text-anchor of text');
                    test.equal(+actualNodeText.attr("x"), +expectedNodeText.attr("x") + xoffs, 'x of text');
                    test.equal(+actualNodeText.attr("y"), +expectedNodeText.attr("y") + yoffs, 'y of text');
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
