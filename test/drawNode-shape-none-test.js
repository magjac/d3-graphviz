import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import deepEqualData from "./deepEqualData.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";
import {translatePointsAttribute} from "../src/svg.js"

it("Verify that none shape is drawn exactly as Graphviz does.", async () => {
    var window = global.window = jsdom('<div id="expected-graph"></div><div id="actual-graph"></div>');
    global.document = window.document;
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
            .renderDot('digraph {a [shape="none"]}', resolve);
    });

    await new Promise(resolve => {
        actualGraphviz
            .renderDot('digraph {}', resolve);
    });

    var x = 27;
    var y = -13.8;
    actualGraphviz
        .drawNode(x, y, 'a', { shape: 'none', id: 'node1' })
        .insertDrawnNode('a');

    const expectedNodeGroup = expectedGraph.selectAll('.node');
    const expectedNodeTitle = expectedNodeGroup.selectAll('title');
    const expectedNodeShape = expectedNodeGroup.selectAll('polygon');
    const expectedNodeText = expectedNodeGroup.selectAll('text');

    const actualNodeGroup = actualGraph.selectAll('.node');
    const actualNodeTitle = actualNodeGroup.selectAll('title');
    const actualNodeShape = actualNodeGroup.selectAll('polygon');
    const actualNodeText = actualNodeGroup.selectAll('text');

    var bbox = expectedNodeText.node().getBBox();
    bbox.cx = bbox.x + bbox.width / 2;
    bbox.cy = bbox.y + bbox.height / 2;
    var xoffs = x - bbox.cx;
    var yoffs = y - bbox.cy;

    assert.equal(actualNodeGroup.attr("id"), expectedNodeGroup.attr("id"), 'id of group');

    assert.equal(actualNodeTitle.text(), expectedNodeTitle.text(), 'text of title');

    assert.equal(actualNodeShape.size(), 0, 'no svg shape elements');
    assert.equal(actualNodeShape.size(), expectedNodeShape.size(), 'same number of svg shape elements');

    assert.equal(actualNodeText.attr("text-anchor"), expectedNodeText.attr("text-anchor"), 'text-anchor of text');
    assert.equal(+actualNodeText.attr("x"), +expectedNodeText.attr("x") + xoffs, 'x of text');
    assert.equal(+actualNodeText.attr("y"), +expectedNodeText.attr("y") + yoffs, 'y of text');
    assert.equal(actualNodeText.attr("font-family"), expectedNodeText.attr("font-family"), 'font-family of text');
    assert.equal(actualNodeText.attr("font-size"), expectedNodeText.attr("font-size"), 'font-size of text');
    assert.equal(actualNodeText.attr("fill"), expectedNodeText.attr("fill"), 'fill of text');

    assert.equal(actualNodeText.text(), expectedNodeText.text(), 'text of node group');

    var actualNodeGroupDatum = actualNodeGroup.datum();
    var expectedNodeGroupDatum = expectedNodeGroup.datum();
    delete expectedNodeGroupDatum.parent;
    deepEqualData(actualNodeGroupDatum, expectedNodeGroupDatum, 'data of drawn node of shape "none" equals Graphviz generated data');

});

it("Verify that none shape without label is drawn exactly as Graphviz does.", async () => {
    var window = global.window = jsdom('<div id="expected-graph"></div><div id="actual-graph"></div>');
    global.document = window.document;
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
        .renderDot('digraph {a [shape="none" label=""]}', resolve);
    });

    await new Promise(resolve => {
        actualGraphviz
                .renderDot('digraph {}', resolve);
    });

    var x = 27;
    var y = -13.8;
    actualGraphviz
        .drawNode(x, y, 'a', {shape: 'none', id: 'node1', label: ''})
        .insertDrawnNode('a');

    const expectedNodeGroup = expectedGraph.selectAll('.node');
    const expectedNodeTitle = expectedNodeGroup.selectAll('title');
    const expectedNodeShape = expectedNodeGroup.selectAll('polygon');
    const expectedNodeText = expectedNodeGroup.selectAll('text');

    const actualNodeGroup = actualGraph.selectAll('.node');
    const actualNodeTitle = actualNodeGroup.selectAll('title');
    const actualNodeShape = actualNodeGroup.selectAll('polygon');
    const actualNodeText = actualNodeGroup.selectAll('text');

    assert.equal(actualNodeGroup.attr("id"), expectedNodeGroup.attr("id"), 'id of group');

    assert.equal(actualNodeTitle.text(), expectedNodeTitle.text(), 'text of title');

    assert.equal(actualNodeShape.size(), 0, 'no svg shape elements');
    assert.equal(actualNodeShape.size(), expectedNodeShape.size(), 'same number of svg shape elements');

    assert.equal(actualNodeText.size(), 0, 'no text elements');
    assert.equal(actualNodeText.size(), expectedNodeText.size(), 'same number of svg text elements');

    var actualNodeGroupDatum = actualNodeGroup.datum();
    var expectedNodeGroupDatum = expectedNodeGroup.datum();
    delete expectedNodeGroupDatum.parent;
    deepEqualData(actualNodeGroupDatum, expectedNodeGroupDatum, 'data of drawn node of shape "none" equals Graphviz generated data');

});

it("Verify that none shape with style filled is drawn exactly as Graphviz does.", async () => {
    var window = global.window = jsdom('<div id="expected-graph"></div><div id="actual-graph"></div>');
    global.document = window.document;
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
            .renderDot('digraph {a [shape="none" style="filled"]}', resolve);
    });

    await new Promise(resolve => {
        actualGraphviz
            .renderDot('digraph {}', resolve);
    });

    var x = 27;
    var y = -18;
    actualGraphviz
        .drawNode(x, y, 'a', { shape: 'none', id: 'node1', style: 'filled' })
        .insertDrawnNode('a');

    const expectedNodeGroup = expectedGraph.selectAll('.node');
    const expectedNodeTitle = expectedNodeGroup.selectAll('title');
    const expectedNodeShape = expectedNodeGroup.selectAll('polygon');
    const expectedNodeText = expectedNodeGroup.selectAll('text');

    const actualNodeGroup = actualGraph.selectAll('.node');
    const actualNodeTitle = actualNodeGroup.selectAll('title');
    const actualNodeShape = actualNodeGroup.selectAll('polygon');
    const actualNodeText = actualNodeGroup.selectAll('text');

    var bbox = expectedNodeShape.node().getBBox();
    bbox.cx = bbox.x + bbox.width / 2;
    bbox.cy = bbox.y + bbox.height / 2;
    const xoffs = x - bbox.cx;
    const yoffs = y - bbox.cy;

    assert.equal(actualNodeGroup.attr("id"), expectedNodeGroup.attr("id"), 'id of group');

    assert.equal(actualNodeTitle.text(), expectedNodeTitle.text(), 'text of title');

    assert.equal(actualNodeShape.size(), 1, 'one svg shape element');
    assert.equal(actualNodeShape.size(), expectedNodeShape.size(), 'same number of svg shape elements');

    assert.equal(actualNodeShape.attr("fill"), expectedNodeShape.attr("fill"), 'fill of polygon');
    assert.equal(actualNodeShape.attr("stroke"), expectedNodeShape.attr("stroke"), 'stroke of polygon');
    assert.equal(actualNodeShape.attr("points"), translatePointsAttribute(expectedNodeShape.attr("points"), xoffs, yoffs), 'points of polygon');

    assert.equal(actualNodeText.attr("text-anchor"), expectedNodeText.attr("text-anchor"), 'text-anchor of text');
    assert.equal(+actualNodeText.attr("x"), +expectedNodeText.attr("x") + xoffs, 'x of text');
    assert.equal(+actualNodeText.attr("y"), +expectedNodeText.attr("y") + yoffs, 'y of text');
    assert.equal(actualNodeText.attr("font-family"), expectedNodeText.attr("font-family"), 'font-family of text');
    assert.equal(actualNodeText.attr("font-size"), expectedNodeText.attr("font-size"), 'font-size of text');
    assert.equal(actualNodeText.attr("fill"), expectedNodeText.attr("fill"), 'fill of text');

    assert.equal(actualNodeText.text(), expectedNodeText.text(), 'text of node group');

    var actualNodeGroupDatum = actualNodeGroup.datum();
    var expectedNodeGroupDatum = expectedNodeGroup.datum();
    delete expectedNodeGroupDatum.parent;
    deepEqualData(actualNodeGroupDatum, expectedNodeGroupDatum, 'data of drawn node of shape "none" equals Graphviz generated data');

});

it("Verify that none shape with style filled and pen color specified is drawn exactly as Graphviz does.", async () => {
    var window = global.window = jsdom('<div id="expected-graph"></div><div id="actual-graph"></div>');
    global.document = window.document;
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
            .renderDot('digraph {a [shape="none" style="filled" color="#0000ff"]}', resolve);
    });

    await new Promise(resolve => {
        actualGraphviz
            .renderDot('digraph {}', resolve);
    });

    var x = 27;
    var y = -18;
    actualGraphviz
        .drawNode(x, y, 'a', { shape: 'none', id: 'node1', style: 'filled', color: '#0000ff' })
        .insertDrawnNode('a');

    const expectedNodeGroup = expectedGraph.selectAll('.node');
    const expectedNodeTitle = expectedNodeGroup.selectAll('title');
    const expectedNodeShape = expectedNodeGroup.selectAll('polygon');
    const expectedNodeText = expectedNodeGroup.selectAll('text');

    const actualNodeGroup = actualGraph.selectAll('.node');
    const actualNodeTitle = actualNodeGroup.selectAll('title');
    const actualNodeShape = actualNodeGroup.selectAll('polygon');
    const actualNodeText = actualNodeGroup.selectAll('text');

    var bbox = expectedNodeShape.node().getBBox();
    bbox.cx = bbox.x + bbox.width / 2;
    bbox.cy = bbox.y + bbox.height / 2;
    const xoffs = x - bbox.cx;
    const yoffs = y - bbox.cy;

    assert.equal(actualNodeGroup.attr("id"), expectedNodeGroup.attr("id"), 'id of group');

    assert.equal(actualNodeTitle.text(), expectedNodeTitle.text(), 'text of title');

    assert.equal(actualNodeShape.size(), 1, 'one svg shape element');
    assert.equal(actualNodeShape.size(), expectedNodeShape.size(), 'same number of svg shape elements');

    assert.equal(actualNodeShape.attr("fill"), expectedNodeShape.attr("fill"), 'fill of polygon');
    assert.equal(actualNodeShape.attr("stroke"), expectedNodeShape.attr("stroke"), 'stroke of polygon');
    assert.equal(actualNodeShape.attr("points"), translatePointsAttribute(expectedNodeShape.attr("points"), xoffs, yoffs), 'points of polygon');

    assert.equal(actualNodeText.attr("text-anchor"), expectedNodeText.attr("text-anchor"), 'text-anchor of text');
    assert.equal(+actualNodeText.attr("x"), +expectedNodeText.attr("x") + xoffs, 'x of text');
    assert.equal(+actualNodeText.attr("y"), +expectedNodeText.attr("y") + yoffs, 'y of text');
    assert.equal(actualNodeText.attr("font-family"), expectedNodeText.attr("font-family"), 'font-family of text');
    assert.equal(actualNodeText.attr("font-size"), expectedNodeText.attr("font-size"), 'font-size of text');
    assert.equal(actualNodeText.attr("fill"), expectedNodeText.attr("fill"), 'fill of text');

    assert.equal(actualNodeText.text(), expectedNodeText.text(), 'text of node group');

    var actualNodeGroupDatum = actualNodeGroup.datum();
    var expectedNodeGroupDatum = expectedNodeGroup.datum();
    delete expectedNodeGroupDatum.parent;
    deepEqualData(actualNodeGroupDatum, expectedNodeGroupDatum, 'data of drawn node of shape "none" equals Graphviz generated data');

});
