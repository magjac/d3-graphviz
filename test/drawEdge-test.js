import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";

it("Check our understanding of how Graphviz draws edges.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    await new Promise(resolve => {
        graphviz.on('initEnd', resolve);
    });

    var num_nodes = 2;
    var num_edges = 1;

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; a -> b;}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
    const arrowHeadLength = 10;
    const arrowHeadWidth = 7;
    const margin = -0.14;
    // start of edge tail
    const x1 = 54.4;
    const y1 = -18;
     // end of edge arrowhead
    const x2 = 88.62;
    const y2 = -18.000;

    const line = d3.selectAll('.edge').selectAll('path').filter(function (d) {
        return d.parent.key == 'a->b'
    });
    var points = line.attr("d").split(/[MC ]/).map(function (v) {
        const point = v.split(',');
        return [Math.round(+point[0] * 1000) / 1000, Math.round(+point[1] * 1000) / 1000];
    });
    var actual_x = [];
    var actual_y = [];
    for (let i = 1; i < points.length; i += 1) {
        actual_x.push(points[i][0]);
        actual_y.push(points[i][1]);
    }
    var expected_x = [];
    var expected_y = [];
    expected_x.push(x1);
    expected_y.push(y1);
    expected_x.push(62.06);
    expected_y.push(y1);
    expected_x.push(70.57);
    expected_y.push(y1);
    expected_x.push(Math.round((x2 - margin - arrowHeadLength) * 1000) / 1000);
    expected_y.push(y2);
    for (let i = 0; i < expected_x.length; i++) {
        assert.deepEqual([actual_x[i], actual_y[i]], [expected_x[i], expected_y[i]], 'Point ' + i + ' of edge');
    }

    const arrowHead = d3.selectAll('.edge').selectAll('polygon').filter(function (d) {
        return d.parent.key == 'a->b'
    });
    points = arrowHead.attr("points").split(' ').map(function (v) {
        const point = v.split(',');
        return [Math.round(+point[0] * 1000) / 1000, Math.round(+point[1] * 1000) / 1000];
    });
    var actual_x = [];
    var actual_y = [];
    for (let i = 0; i < points.length; i += 1) {
        actual_x.push(points[i][0]);
        actual_y.push(points[i][1]);
    }
    var expected_x = [];
    var expected_y = [];
    expected_x.push(x2 - arrowHeadLength);
    expected_y.push(y2 - arrowHeadWidth / 2);
    expected_x.push(x2);
    expected_y.push(y2);
    expected_x.push(x2 - arrowHeadLength);
    expected_y.push(y2 + arrowHeadWidth / 2);
    expected_x.push(x2 - arrowHeadLength);
    expected_y.push(y2 - arrowHeadWidth / 2);
    for (let i = 0; i < expected_x.length; i++) {
        assert.deepEqual([actual_x[i], actual_y[i]], [expected_x[i], expected_y[i]], 'Point ' + i + ' of arrow head');
    }

});

it("drawEdge() draws an edge in the same way as Graphviz does", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");
    await new Promise(resolve => {
        graphviz
            .on('initEnd', resolve);
    });


    var num_nodes = 2;
    var num_edges = 1;

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; a -> b;}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
    const arrowHeadLength = 10;
    const arrowHeadWidth = 7;
    const margin = 0.1;
    const x1 = 20;
    const y1 = -20;
    const x2 = 40;
    const y2 = -20;
    graphviz
        .drawEdge(x1, y1, x2, y2);
    num_edges += 1;
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');
    graphviz
        .insertDrawnEdge('b->a');
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after inserting the currently drawn edge');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after inserting the currently drawn edge');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after inserting the currently drawn edge');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after inserting the currently drawn edge');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after inserting the currently drawn edge');

    const line = d3.selectAll('.edge').selectAll('path').filter(function (d) {
        return d.parent.key == 'b->a'
    });
    var points = line.attr("d").split(/[MCL ]/).map(function (v) {
        const point = v.split(',');
        return [Math.round(+point[0] * 1000) / 1000, Math.round(+point[1] * 1000) / 1000];
    });
    var actual_x = [];
    var actual_y = [];
    for (let i = 1; i < points.length; i += 1) {
        actual_x.push(points[i][0]);
        actual_y.push(points[i][1]);
    }
    var expected_x = [];
    var expected_y = [];
    expected_x.push(x1);
    expected_y.push(y1);
    expected_x.push(Math.round((x2 - margin - arrowHeadLength) * 1000) / 1000);
    expected_y.push(y2);
    for (let i = 0; i < expected_x.length; i++) {
        assert.deepEqual([actual_x[i], actual_y[i]], [expected_x[i], expected_y[i]], 'Point ' + i + ' of edge');
    }

    const newArrowHead = d3.selectAll('.edge').selectAll('polygon').filter(function (d) {
        return d.parent.key == 'b->a'
    });
    points = newArrowHead.attr("points").split(' ').map(function (v) {
        const point = v.split(',');
        return [Math.round(+point[0] * 1000) / 1000, Math.round(+point[1] * 1000) / 1000];
    });
    var actual_x = [];
    var actual_y = [];
    for (let i = 0; i < points.length; i += 1) {
        actual_x.push(points[i][0]);
        actual_y.push(points[i][1]);
    }
    var expected_x = [];
    var expected_y = [];
    expected_x.push(x2 - arrowHeadLength);
    expected_y.push(y2 - arrowHeadWidth / 2);
    expected_x.push(x2);
    expected_y.push(y2);
    expected_x.push(x2 - arrowHeadLength);
    expected_y.push(y2 + arrowHeadWidth / 2);
    expected_x.push(x2 - arrowHeadLength);
    expected_y.push(y2 - arrowHeadWidth / 2);
    for (let i = 0; i < expected_x.length; i++) {
        assert.deepEqual([actual_x[i], actual_y[i]], [expected_x[i], expected_y[i]], 'Point ' + i + ' of arrow head');
    }

});

it("drawEdge() draws an edge even if the length is zero", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");
    await new Promise(resolve => {
        graphviz
            .on('initEnd', resolve);
    });

    var num_nodes = 2;
    var num_edges = 0

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; a; b;}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
    const arrowHeadLength = 10;
    const arrowHeadWidth = 7;
    const x1 = 20;
    const y1 = -20;
    const x2 = x1;
    const y2 = y1;
    graphviz
        .drawEdge(x1, y1, x2, y2);
    num_edges += 1;
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');
    assert.equal(d3.select('.edge').select('polygon').attr("points"), "10,-23.5 20,-20 10,-16.5 10,-23.5", 'Number of paths after drawing an edge');
    assert.equal(d3.selectAll('path').attr("d"), "M20,-20L9.9,-20", 'Number of paths after drawing an edge');

});

it("drawEdge() draws an edge with an URL attribute in the same way as Graphviz does", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");
    await new Promise(resolve => {
        graphviz
            .on('initEnd', resolve);
    });

    var num_nodes = 2;
    var num_edges = 1;

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; a -> b [URL="dummy"];}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
    const arrowHeadLength = 10;
    const arrowHeadWidth = 7;
    const margin = 0.1;
    const x1 = 20;
    const y1 = -20;
    const x2 = 40;
    const y2 = -20;
    graphviz
        .drawEdge(x1, y1, x2, y2, { URL: "dummy2" });
    num_edges += 1;
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');
    graphviz
        .insertDrawnEdge('b->a');
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after inserting the currently drawn edge');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after inserting the currently drawn edge');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after inserting the currently drawn edge');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after inserting the currently drawn edge');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after inserting the currently drawn edge');

    const line = d3.selectAll('.edge').selectAll('path').filter(function (d) {
        return d.parent.parent.parent.key == 'b->a'
    });
    var points = line.attr("d").split(/[MCL ]/).map(function (v) {
        const point = v.split(',');
        return [Math.round(+point[0] * 1000) / 1000, Math.round(+point[1] * 1000) / 1000];
    });
    var actual_x = [];
    var actual_y = [];
    for (let i = 1; i < points.length; i += 1) {
        actual_x.push(points[i][0]);
        actual_y.push(points[i][1]);
    }
    var expected_x = [];
    var expected_y = [];
    expected_x.push(x1);
    expected_y.push(y1);
    expected_x.push(Math.round((x2 - margin - arrowHeadLength) * 1000) / 1000);
    expected_y.push(y2);
    for (let i = 0; i < expected_x.length; i++) {
        assert.deepEqual([actual_x[i], actual_y[i]], [expected_x[i], expected_y[i]], 'Point ' + i + ' of edge');
    }

    const newArrowHead = d3.selectAll('.edge').selectAll('polygon').filter(function (d) {
        return d.parent.parent.parent.key == 'b->a'
    });
    points = newArrowHead.attr("points").split(' ').map(function (v) {
        const point = v.split(',');
        return [Math.round(+point[0] * 1000) / 1000, Math.round(+point[1] * 1000) / 1000];
    });
    var actual_x = [];
    var actual_y = [];
    for (let i = 0; i < points.length; i += 1) {
        actual_x.push(points[i][0]);
        actual_y.push(points[i][1]);
    }
    var expected_x = [];
    var expected_y = [];
    expected_x.push(x2 - arrowHeadLength);
    expected_y.push(y2 - arrowHeadWidth / 2);
    expected_x.push(x2);
    expected_y.push(y2);
    expected_x.push(x2 - arrowHeadLength);
    expected_y.push(y2 + arrowHeadWidth / 2);
    expected_x.push(x2 - arrowHeadLength);
    expected_y.push(y2 - arrowHeadWidth / 2);
    for (let i = 0; i < expected_x.length; i++) {
        assert.deepEqual([actual_x[i], actual_y[i]], [expected_x[i], expected_y[i]], 'Point ' + i + ' of arrow head');
    }

});

it("drawEdge() draws an edge with an tooltip attribute in the same way as Graphviz does", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");
    await new Promise(resolve => {
        graphviz
            .on('initEnd', resolve);
    });

    var num_nodes = 2;
    var num_edges = 1;

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; a -> b [tooltip="dummy"];}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
    const arrowHeadLength = 10;
    const arrowHeadWidth = 7;
    const margin = 0.1;
    const x1 = 20;
    const y1 = -20;
    const x2 = 40;
    const y2 = -20;
    graphviz
        .drawEdge(x1, y1, x2, y2, { tooltip: "dummy2" });
    num_edges += 1;
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');
    graphviz
        .insertDrawnEdge('b->a');
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after inserting the currently drawn edge');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after inserting the currently drawn edge');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after inserting the currently drawn edge');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after inserting the currently drawn edge');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after inserting the currently drawn edge');

    const line = d3.selectAll('.edge').selectAll('path').filter(function (d) {
        return d.parent.parent.parent.key == 'b->a'
    });
    var points = line.attr("d").split(/[MCL ]/).map(function (v) {
        const point = v.split(',');
        return [Math.round(+point[0] * 1000) / 1000, Math.round(+point[1] * 1000) / 1000];
    });
    var actual_x = [];
    var actual_y = [];
    for (let i = 1; i < points.length; i += 1) {
        actual_x.push(points[i][0]);
        actual_y.push(points[i][1]);
    }
    var expected_x = [];
    var expected_y = [];
    expected_x.push(x1);
    expected_y.push(y1);
    expected_x.push(Math.round((x2 - margin - arrowHeadLength) * 1000) / 1000);
    expected_y.push(y2);
    for (let i = 0; i < expected_x.length; i++) {
        assert.deepEqual([actual_x[i], actual_y[i]], [expected_x[i], expected_y[i]], 'Point ' + i + ' of edge');
    }

    const newArrowHead = d3.selectAll('.edge').selectAll('polygon').filter(function (d) {
        return d.parent.parent.parent.key == 'b->a'
    });
    points = newArrowHead.attr("points").split(' ').map(function (v) {
        const point = v.split(',');
        return [Math.round(+point[0] * 1000) / 1000, Math.round(+point[1] * 1000) / 1000];
    });
    var actual_x = [];
    var actual_y = [];
    for (let i = 0; i < points.length; i += 1) {
        actual_x.push(points[i][0]);
        actual_y.push(points[i][1]);
    }
    var expected_x = [];
    var expected_y = [];
    expected_x.push(x2 - arrowHeadLength);
    expected_y.push(y2 - arrowHeadWidth / 2);
    expected_x.push(x2);
    expected_y.push(y2);
    expected_x.push(x2 - arrowHeadLength);
    expected_y.push(y2 + arrowHeadWidth / 2);
    expected_x.push(x2 - arrowHeadLength);
    expected_y.push(y2 - arrowHeadWidth / 2);
    for (let i = 0; i < expected_x.length; i++) {
        assert.deepEqual([actual_x[i], actual_y[i]], [expected_x[i], expected_y[i]], 'Point ' + i + ' of arrow head');
    }

});

it("insertDrawnEdge() inserts the currently drawn edge into the joined data structure so that it can be animated when the graph is re-rendered", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");
    await new Promise(resolve => {
        graphviz
            .on('initEnd', resolve);
    });

    var num_nodes = 2;
    var num_edges = 1;

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; a -> b;}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
    const x1 = 20;
    const y1 = -20;
    const x2 = 40;
    const y2 = -20;
    graphviz
        .drawEdge(x1, y1, x2, y2);
    num_edges += 1;
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');
    graphviz
        .insertDrawnEdge('b->a');
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after inserting the currently drawn edge');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after inserting the currently drawn edge');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after inserting the currently drawn edge');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after inserting the currently drawn edge');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after inserting the currently drawn edge');

    await new Promise(resolve => {
        graphviz
            .dot('digraph {a -> b; b -> a}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after re-rendering with the inserted edge');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after re-rendering with the inserted edge');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after re-rendering with the inserted edge');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after re-rendering with the inserted edge');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after re-rendering with the inserted edge');

});

it("removeDrawnEdge() removes the edge currently being drawn", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph")
    await new Promise(resolve => {
        graphviz
            .on('initEnd', resolve);
    });

    var num_nodes = 2;
    var num_edges = 1;

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; a -> b;}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
        assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
        assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
        const arrowHeadLength = 10;
        const arrowHeadWidth = 7;
        const x1 = 20;
        const y1 = -20;
        const x2 = 40;
        const y2 = -20;
        graphviz
            .drawEdge(x1, y1, x2, y2);
        num_edges += 1;
        assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
        assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
        assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
        assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
        assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');

        graphviz
            .removeDrawnEdge();
        num_edges -= 1;
        assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after aborting drawing of the current edge');
        assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after aborting drawing of the current edge');
        assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons aborting drawing of the current edge');
        assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses aborting drawing of the current edge');
        assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after aborting drawing of the current edge');

    await new Promise(resolve => {
        graphviz
            .dot('digraph {a -> b; b -> a}')
            .render(resolve);
    });

    num_edges = 2;
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after re-rendering with the inserted edge');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after re-rendering with the inserted edge');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after re-rendering with the inserted edge');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after re-rendering with the inserted edge');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after re-rendering with the inserted edge');

});

it("updateDrawnEdge modifies the start and end points and the attributes of an edge", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");
    await new Promise(resolve => {
        graphviz
            .on('initEnd', resolve);
    });

    var num_nodes = 2;
    var num_edges = 1;

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; a -> b;}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
    const arrowHeadLength = 10;
    const arrowHeadWidth = 7;
    const x1 = 20;
    const y1 = -20;
    const x2 = 40;
    const y2 = -20;
    graphviz
        .drawEdge(x1, y1, x2, y2, { id: 'drawn-edge' });
    num_edges += 1;
    var edge = d3.select('#drawn-edge');
    assert.equal(edge.size(), 1, 'An edge with the specified id attribute is present');
    var line = edge.selectWithoutDataPropagation("path");
    var arrowHead = edge.selectWithoutDataPropagation("polygon");
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');
    assert.equal(arrowHead.attr("points"), '30,-23.5 40,-20 30,-16.5 30,-23.5');
    assert.equal(line.attr("fill"), 'none', 'Default fill color of a drawn edge line is black');
    assert.equal(line.attr("stroke"), 'black', 'Default stroke color of a drawn edge line is black');

    graphviz
        .updateDrawnEdge(21, -21, 41, -21, { fillcolor: "red", color: "purple", penwidth: 2, id: "drawn-edge" });
    assert.equal(arrowHead.attr("points"), '31,-24.5 41,-21 31,-17.5 31,-24.5');
    assert.equal(arrowHead.attr("fill"), 'red', 'Fill color of a drawn edge is updated to red');
    assert.equal(line.attr("stroke"), 'purple', 'Stroke color is updated to purple');
    assert.equal(line.attr("stroke-width"), '2', 'Stroke width is updated to 2');

    graphviz
        .updateDrawnEdge(21, -21, 41, -21, { color: "green" });
    assert.equal(arrowHead.attr("points"), '31,-24.5 41,-21 31,-17.5 31,-24.5');
    assert.equal(arrowHead.attr("fill"), 'red', 'Fill color is not updated when only color is changed');
    assert.equal(line.attr("stroke"), 'green', 'Stroke color is updated to green');
    assert.equal(line.attr("stroke-width"), '2', 'Stroke width is not updated when only color is changed');

    graphviz
        .updateDrawnEdge(22, -22, 42, -22);
    assert.equal(arrowHead.attr("points"), '32,-25.5 42,-22 32,-18.5 32,-25.5');
    assert.equal(arrowHead.attr("fill"), 'red', 'Fill color is not updated when no attribute is given');
    assert.equal(line.attr("stroke"), 'green', 'Stroke color is updated  when no attribute is given');
    assert.equal(line.attr("stroke-width"), '2', 'Stroke width is not updated  when no attribute is given');

    graphviz
        .updateDrawnEdge(22, -22, 42, -22, { color: null, penwidth: null });
    assert.equal(arrowHead.attr("points"), '32,-25.5 42,-22 32,-18.5 32,-25.5');
    assert.equal(arrowHead.attr("fill"), 'red', 'Fill color is not updated when not specified');
    assert.equal(line.attr("stroke"), 'black', 'Stroke color is black when removed');
    assert.equal(line.attr("stroke-width"), null, 'Stroke width is removed when removed');

});

it("moveDrawnEdgeEndPoint modifies the end points of an edge", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");
    await new Promise(resolve => {
        graphviz
            .on('initEnd', resolve);
    });

    var num_nodes = 2;
    var num_edges = 1;

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; a -> b;}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
    const arrowHeadLength = 10;
    const arrowHeadWidth = 7;
    const x1 = 20;
    const y1 = -20;
    const x2 = 40;
    const y2 = -20;
    graphviz
        .drawEdge(x1, y1, x2, y2, { id: 'drawn-edge' });
    num_edges += 1;
    var edge = d3.select('#drawn-edge');
    assert.equal(edge.size(), 1, 'An edge with the specified id attribute is present');
    var arrowHead = edge.selectWithoutDataPropagation("polygon");
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');
    assert.equal(arrowHead.attr("points"), '30,-23.5 40,-20 30,-16.5 30,-23.5');
    graphviz
        .updateDrawnEdge(21, -21, 41, -21, { fillcolor: "red", color: "purple", penwidth: 2, id: "drawn-edge" });
    assert.equal(arrowHead.attr("points"), '31,-24.5 41,-21 31,-17.5 31,-24.5');
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after modifying the currently drawn edge');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after modifying the currently drawn edge');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after modifying the currently drawn edge');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after modifying the currently drawn edge');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after modifying the currently drawn edge');

    graphviz
        .updateDrawnEdge(22, -22, 1000, -2000, { fillcolor: "red", color: "purple", penwidth: 2, id: "drawn-edge" })
        .moveDrawnEdgeEndPoint(42, -22);
    assert.equal(arrowHead.attr("points"), '32,-25.5 42,-22 32,-18.5 32,-25.5');

});

it("drawnEdgeSelection return a selection containing the edge currently being drawn", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");
    await new Promise(resolve => {
        graphviz
            .on('initEnd', resolve);
    });

    var num_nodes = 2;
    var num_edges = 1;

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; a -> b;}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
    const arrowHeadLength = 10;
    const arrowHeadWidth = 7;
    const x1 = 20;
    const y1 = -20;
    const x2 = 40;
    const y2 = -20;

    var noDrawnEdge = graphviz.drawnEdgeSelection();
    assert.ok(noDrawnEdge.empty(), "drawnEdgeSelection() returns an empty selection when no edge is currently being drawn");

    graphviz
        .drawEdge(x1, y1, x2, y2, { id: 'drawn-edge' });
    num_edges += 1;
    var edge = d3.select('#drawn-edge');
    assert.equal(edge.size(), 1, 'An edge with the specified id attribute is present');
    var arrowHead = edge.selectWithoutDataPropagation("polygon");
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');

    var drawnEdge = graphviz.drawnEdgeSelection();
    assert.equal(drawnEdge.node(), edge.node(), "drawnEdgeSelection() returns the edge currently being drawn");
    graphviz
        .insertDrawnEdge('b -> a');
    var insertedDrawnEdge = graphviz.drawnEdgeSelection();
    assert.ok(insertedDrawnEdge.empty(), "drawnEdgeSelection() returns an empty selection when the drawn edge has been inserted into the data");

});

it("Attempts to operate on an edge without drawing one first is handled gracefully", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");
    await new Promise(resolve => {
        graphviz
            .on('initEnd', resolve);
    });

    var num_nodes = 2;
    var num_edges = 1;

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; a -> b;}')
            .render(resolve);
    });

        assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
        assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
        assert.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
        assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
        assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
        assert.throws(function () {
            graphviz
                .updateDrawnEdge(21, -21, 41, -21);
        }, "updateDrawnEdge throws error if not edge has been drawn first");
        assert.throws(function () {
            graphviz
                .moveDrawnEdgeEndPoint(42, -22);
        }, "moveDrawnEdgeEndPoint throws error if not edge has been drawn first");
        assert.throws(function () {
            graphviz
            .insertDrawnEdge('b->a');
        }, "insertDrawnEdge throws error if not edge has been drawn first");

        assert.doesNotThrow(function () {
            graphviz
                .removeDrawnEdge();
        }, "removeDrawnEdge is ignored if no edge has been drawn first");

});
