import tape from "./tape.js";
import jsdom from "./jsdom.js";
import deepEqualData from "./deepEqualData.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";

tape("Verify that point shape is drawn exactly as Graphviz does.", async function (test) {
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
            .renderDot('digraph {a [shape="point"]}', resolve);
    });

    await new Promise(resolve => {
        actualGraphviz
            .renderDot('digraph {}', resolve);
    });

    var x = 1.8;
    var y = -1.8;
    actualGraphviz
        .drawNode(x, y, 'a', { shape: 'point', id: 'node1' })
        .insertDrawnNode('a');

    const expectedNodeGroup = expectedGraph.selectAll('.node');
    const expectedNodeTitle = expectedNodeGroup.selectAll('title');
    const expectedNodeShape = expectedNodeGroup.selectAll('ellipse');

    const actualNodeGroup = actualGraph.selectAll('.node');
    const actualNodeTitle = actualNodeGroup.selectAll('title');
    const actualNodeShape = actualNodeGroup.selectAll('ellipse');

    var bbox = expectedNodeShape.node().getBBox();
    bbox.cx = bbox.x + bbox.width / 2;
    bbox.cy = bbox.y + bbox.height / 2;
    var xoffs = x - bbox.cx;
    var yoffs = y - bbox.cy;

    test.equal(actualNodeGroup.attr("id"), expectedNodeGroup.attr("id"), 'id of group');

    test.equal(actualNodeTitle.text(), expectedNodeTitle.text(), 'text of title');

    test.equal(actualNodeShape.attr("fill"), expectedNodeShape.attr("fill"), 'fill of ellipse');
    test.equal(actualNodeShape.attr("stroke"), expectedNodeShape.attr("stroke"), 'stroke of ellipse');
    test.equal(+actualNodeShape.attr("cx"), +expectedNodeShape.attr("cx") + xoffs, 'cx of ellipse');
    test.equal(+actualNodeShape.attr("cy"), +expectedNodeShape.attr("cy") + yoffs, 'cy of ellipse');
    test.equal(+actualNodeShape.attr("rx"), +expectedNodeShape.attr("rx"), 'rx of ellipse');
    test.equal(+actualNodeShape.attr("ry"), +expectedNodeShape.attr("ry"), 'ry of ellipse');

    var actualNodeGroupDatum = actualNodeGroup.datum();
    var expectedNodeGroupDatum = expectedNodeGroup.datum();
    delete expectedNodeGroupDatum.parent;
    deepEqualData(actualNodeGroupDatum, expectedNodeGroupDatum, 'data of drawn node of shape equals Graphviz generated data');

    test.end()
});
