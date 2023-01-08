import tape from "./tape.js";
import jsdom from "./jsdom.js";
import deepEqualData from "./deepEqualData.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";
import {translateDAttribute} from "../src/svg.js"

tape("Verify that cylinder shape is drawn exactly as Graphviz does.", async function (test) {
    var window = global.window = jsdom('<div id="expected-graph"></div><div id="actual-graph"></div>');
    var document = global.document = window.document;
    var expectedGraph = d3.select("#expected-graph");
    var actualGraph = d3.select("#actual-graph");
    var actualGraphviz;
    var expectedGraphviz;
    await new Promise(resolve => {
        expectedGraphviz = d3_graphviz.graphviz("#expected-graph")
            .on('initEnd', resolve);
    });

    await new Promise(resolve => {
        actualGraphviz = d3_graphviz.graphviz("#actual-graph")
            .on('initEnd', resolve);
        });

    await new Promise(resolve => {
        expectedGraphviz
            .zoom(false)
            .renderDot('digraph {a [shape="cylinder"]}', resolve);
    });

    await new Promise(resolve => {
        actualGraphviz
            .renderDot('digraph {}', resolve);
    });

    var x = 27;
    var y = -18;
    actualGraphviz
        .drawNode(x, y, 'a', { shape: 'cylinder', id: 'node1' })
        .insertDrawnNode('a');

    const expectedNodeGroup = expectedGraph.selectAll('.node');
    const expectedNodeTitle = expectedNodeGroup.selectAll('title');
    const expectedNodeShapes = expectedNodeGroup.selectAll('path');
    const expectedNodeText = expectedNodeGroup.selectAll('text');

    const actualNodeGroup = actualGraph.selectAll('.node');
    const actualNodeTitle = actualNodeGroup.selectAll('title');
    const actualNodeShapes = actualNodeGroup.selectAll('path');
    const actualNodeText = actualNodeGroup.selectAll('text');

    var bbox = expectedNodeShapes.node().getBBox();
    bbox.cx = bbox.x + bbox.width / 2;
    bbox.cy = bbox.y + bbox.height / 2;
    var xoffs = x - bbox.cx;
    var yoffs = y - bbox.cy;

    test.equal(actualNodeGroup.attr("id"), expectedNodeGroup.attr("id"), 'id of group');

    test.equal(actualNodeTitle.text(), expectedNodeTitle.text(), 'text of title');

    actualNodeShapes.each(function (d, i, nodes) {
        var actualNodeShape = d3.select(this);
        var expectedNodeShape = d3.select(expectedNodeShapes.nodes()[i]);
        test.equal(actualNodeShape.attr("fill"), expectedNodeShape.attr("fill"), 'fill of path ' + (i + 1));
        test.equal(actualNodeShape.attr("stroke"), expectedNodeShape.attr("stroke"), 'stroke of path ' + (i + 1));
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
    deepEqualData(actualNodeGroupDatum, expectedNodeGroupDatum, 'data of drawn node of shape equals Graphviz generated data');

    test.end()
});
