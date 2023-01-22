import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import deepEqualData from "./deepEqualData.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";
import {translatePointsAttribute} from "../src/svg.js"

it("No edge is drawn when style is invis.", async () => {
    var window = global.window = jsdom('<div id="expected-graph"></div><div id="actual-graph"></div>');
    global.document = window.document;
    var expectedGraph = d3.select("#expected-graph");
    var actualGraph = d3.select("#actual-graph");
    var actualGraphviz;
    var expectedGraphviz = d3_graphviz.graphviz("#expected-graph");

    await new Promise(resolve => {
        expectedGraphviz.on('initEnd', resolve);
    });

    await new Promise(resolve => {
        actualGraphviz = d3_graphviz.graphviz("#actual-graph")
            .on('initEnd', resolve);
    });

    await new Promise(resolve => {
        expectedGraphviz
            .zoom(false)
            .renderDot('digraph {a -> b [style="invis"]}', resolve);
    });

    await new Promise(resolve => {
        actualGraphviz
            .renderDot('digraph {}', resolve);
    })

    const x1 = 20;
    const y1 = -20;
    const x2 = 40;
    const y2 = -20;
    actualGraphviz
        .drawEdge(x1, y1, x2, y2, { style: 'invis', id: 'edge1' })
        .insertDrawnEdge('a->b');

    const expectedEdgeGroup = expectedGraph.selectAll('.edge');

    const actualEdgeGroup = actualGraph.selectAll('.edge');

    assert.equal(expectedEdgeGroup.size(), 0, 'No edge is generated by Graphviz when style is invis');
    assert.equal(actualEdgeGroup.size(), 0, 'No edge is drawn when style is invis');


});

it("Updating of an edge with style invis is ignored.", async () => {
    var window = global.window = jsdom('<div id="expected-graph"></div><div id="actual-graph"></div>');
    global.document = window.document;
    var expectedGraph = d3.select("#expected-graph");
    var actualGraph = d3.select("#actual-graph");
    var actualGraphviz;
    var expectedGraphviz = d3_graphviz.graphviz("#expected-graph");
    await new Promise(resolve => {
        expectedGraphviz
            .on('initEnd', resolve);
    })

    await new Promise(resolve => {
            actualGraphviz = d3_graphviz.graphviz("#actual-graph")
            .on('initEnd', resolve);
    });

    await new Promise(resolve => {
        expectedGraphviz
            .zoom(false)
            .renderDot('digraph {a -> b [style="invis"]}', resolve);
    });

    await new Promise(resolve => {
        actualGraphviz
            .renderDot('digraph {}', resolve);
    });

    const x1 = 20;
    const y1 = -20;
    const x2 = 40;
    const y2 = -20;
    actualGraphviz
                .drawEdge(x1, y1, x2, y2, { style: 'invis', id: 'edge1' })
                .updateDrawnEdge(x1 + 1, y1 + 1, x2 + 1, y2 + 1, { color: 'green' })
                .insertDrawnEdge('a->b');

    const expectedEdgeGroup = expectedGraph.selectAll('.edge');

    const actualEdgeGroup = actualGraph.selectAll('.edge');

    assert.equal(expectedEdgeGroup.size(), 0, 'No edge is generated by Graphviz when style is invis');
    assert.equal(actualEdgeGroup.size(), 0, 'No edge is drawn when style is invis');


});

it("Moving an edge with style invis is ignored.", async () => {
    var window = global.window = jsdom('<div id="expected-graph"></div><div id="actual-graph"></div>');
    global.document = window.document;
    var expectedGraph = d3.select("#expected-graph");
    var actualGraph = d3.select("#actual-graph");
    var actualGraphviz;
    var expectedGraphviz = d3_graphviz.graphviz("#expected-graph");
    await new Promise(resolve => {
        expectedGraphviz
            .on('initEnd', resolve);
    });

    await new Promise(resolve => {
        actualGraphviz = d3_graphviz.graphviz("#actual-graph")
            .on('initEnd', resolve);
        });

    await new Promise(resolve => {
        expectedGraphviz
            .zoom(false)
            .renderDot('digraph {a -> b [style="invis"]}', resolve);
    });

    await new Promise(resolve => {
        actualGraphviz
            .renderDot('digraph {}', resolve);
    });

    const x1 = 20;
    const y1 = -20;
    const x2 = 40;
    const y2 = -20;
    actualGraphviz
        .drawEdge(x1, y1, x2, y2, { style: 'invis', id: 'edge1' })
        .moveDrawnEdgeEndPoint(x2 + 1, y2 + 1)
        .insertDrawnEdge('a->b');

    const expectedEdgeGroup = expectedGraph.selectAll('.edge');

    const actualEdgeGroup = actualGraph.selectAll('.edge');

    assert.equal(expectedEdgeGroup.size(), 0, 'No edge is generated by Graphviz when style is invis');
    assert.equal(actualEdgeGroup.size(), 0, 'No edge is drawn when style is invis');

});

it("Removal of an edge with style invis is allowed.", async () => {
    var window = global.window = jsdom('<div id="expected-graph"></div><div id="actual-graph"></div>');
    global.document = window.document;
    var expectedGraph = d3.select("#expected-graph");
    var actualGraph = d3.select("#actual-graph");
    var actualGraph = d3.select("#actual-graph");
    var actualGraphviz;
    var expectedGraphviz = d3_graphviz.graphviz("#expected-graph");
    await new Promise(resolve => {
        expectedGraphviz
            .on('initEnd', resolve);
    });

    await new Promise(resolve => {
        actualGraphviz = d3_graphviz.graphviz("#actual-graph")
            .on('initEnd', resolve);
    });

    await new Promise(resolve => {
        expectedGraphviz
            .zoom(false)
            .renderDot('digraph {a -> b [style="invis"]}', resolve);
    });

    await new Promise(resolve => {
        actualGraphviz
            .renderDot('digraph {}', resolve);
    });

    const x1 = 20;
    const y1 = -20;
    const x2 = 40;
    const y2 = -20;
    actualGraphviz
        .drawEdge(x1, y1, x2, y2, { style: 'invis', id: 'edge1' })
        .removeDrawnEdge();

    const expectedEdgeGroup = expectedGraph.selectAll('.edge');

    const actualEdgeGroup = actualGraph.selectAll('.edge');

    assert.equal(expectedEdgeGroup.size(), 0, 'No edge is generated by Graphviz when style is invis');
    assert.equal(actualEdgeGroup.size(), 0, 'No edge is drawn when style is invis');

});

it("Changing an edge with style invis to a visible edge is allowed.", async () => {
    var window = global.window = jsdom('<div id="expected-graph"></div><div id="actual-graph"></div>');
    global.document = window.document;
    var expectedGraph = d3.select("#expected-graph");
    var actualGraph = d3.select("#actual-graph");
    var actualGraphviz;
    var expectedGraphviz = d3_graphviz.graphviz("#expected-graph");
    await new Promise(resolve => {
        expectedGraphviz
            .on('initEnd', resolve);
    });

    await new Promise(resolve => {
        actualGraphviz = d3_graphviz.graphviz("#actual-graph")
            .on('initEnd', resolve);
    });

    await new Promise(resolve => {
        expectedGraphviz
            .zoom(false)
            .renderDot('digraph {a -> b}', resolve);
    });

    await new Promise(resolve => {
        actualGraphviz
            .renderDot('digraph {}', resolve);
    });

    const x1 = 20;
    const y1 = -20;
    const x2 = 40;
    const y2 = -20;
    actualGraphviz
        .drawEdge(x1, y1, x2, y2, { style: 'invis', id: 'edge1' })
        .updateDrawnEdge(x1, y1, x2, y2, { style: 'solid' })
        .insertDrawnEdge('a->b');

    const expectedEdgeGroup = expectedGraph.selectAll('.edge');

    const actualEdgeGroup = actualGraph.selectAll('.edge');

    assert.equal(expectedEdgeGroup.size(), 1, 'An edge is generated by Graphviz when style is not invis');
    assert.equal(actualEdgeGroup.size(), 1, 'An edge is drawn when style is changed from invis');

    const expectedEdgeTitle = expectedEdgeGroup.selectAll('title');

    const actualEdgeTitle = actualEdgeGroup.selectAll('title');

    assert.equal(actualEdgeGroup.attr("id"), expectedEdgeGroup.attr("id"), 'id of group');

    assert.equal(actualEdgeTitle.text(), expectedEdgeTitle.text(), 'text of title');

});
