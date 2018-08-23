var tape = require("tape");
var jsdom = require("./jsdom");
var d3 = require("d3-selection");
var d3_graphviz = require("../");

tape("Check our understanding of how Graphviz draws edges.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var num_nodes = 2;
    var num_edges = 1;

    graphviz
        .zoom(false)
        .dot('digraph {graph [rankdir="LR"]; a -> b;}')
        .render(endTest);

    function endTest() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
        arrowHeadLength = 10;
        arrowHeadWidth = 7;
        margin = 0.174;
        x1 = 54.003;
        y1 = -18;
        x2 = 89.705;
        y2 = -18.000;

        line = d3.selectAll('.edge').selectAll('path').filter(function(d) {
            return d.parent.key == 'a->b'
        });
        points = line.attr("d").split(/[MC ]/).map(function(v) {
            point = v.split(',');
            return [Math.round(+point[0] * 1000) / 1000 , Math.round(+point[1] * 1000) / 1000];
        });
        var actual_x = [];
        var actual_y = [];
        for (i = 1; i < points.length; i += 1) {
            actual_x.push(points[i][0]);
            actual_y.push(points[i][1]);
        }
        var expected_x = [];
        var expected_y = [];
        expected_x.push(x1);
        expected_y.push(y1);
        expected_x.push(62.028);
        expected_y.push(y1);
        expected_x.push(70.967);
        expected_y.push(y1);
        expected_x.push(Math.round((x2 - margin - arrowHeadLength) * 1000) / 1000);
        expected_y.push(y2);
        for (i = 0; i < expected_x.length; i++) {
            test.deepLooseEqual([actual_x[i], actual_y[i]], [expected_x[i], expected_y[i]], 'Point ' + i + ' of edge');
        }

        arrowHead = d3.selectAll('.edge').selectAll('polygon').filter(function(d) {
            return d.parent.key == 'a->b'
        });
        points = arrowHead.attr("points").split(' ').map(function(v) {
            point = v.split(',');
            return [Math.round(+point[0] * 1000) / 1000 , Math.round(+point[1] * 1000) / 1000];
        });
        var actual_x = [];
        var actual_y = [];
        for (i = 0; i < points.length; i += 1) {
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
        for (i = 0; i < expected_x.length; i++) {
            test.deepLooseEqual([actual_x[i], actual_y[i]], [expected_x[i], expected_y[i]], 'Point ' + i + ' of arrow head');
        }

        test.end();
    }

});

tape("drawEdge() draws an edge in the same way as Graphviz does", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var num_nodes = 2;
    var num_edges = 1;

    graphviz
        .zoom(false)
        .dot('digraph {graph [rankdir="LR"]; a -> b;}')
        .render(drawEdge);

    function drawEdge() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
        arrowHeadLength = 10;
        arrowHeadWidth = 7;
        margin = 0.174;
        x1 = 20;
        y1 = -20;
        x2 = 40;
        y2 = -20;
        graphviz
            .drawEdge(x1, y1, x2, y2);
        num_edges += 1;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');
        graphviz
            .insertDrawnEdge('b->a');
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after inserting the currently drawn edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after inserting the currently drawn edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after inserting the currently drawn edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after inserting the currently drawn edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after inserting the currently drawn edge');

        line = d3.selectAll('.edge').selectAll('path').filter(function(d) {
            return d.parent.key == 'b->a'
        });
        points = line.attr("d").split(/[MCL ]/).map(function(v) {
            point = v.split(',');
            return [Math.round(+point[0] * 1000) / 1000 , Math.round(+point[1] * 1000) / 1000];
        });
        var actual_x = [];
        var actual_y = [];
        for (i = 1; i < points.length; i += 1) {
            actual_x.push(points[i][0]);
            actual_y.push(points[i][1]);
        }
        var expected_x = [];
        var expected_y = [];
        expected_x.push(x1);
        expected_y.push(y1);
        expected_x.push(Math.round((x2 - margin - arrowHeadLength) * 1000) / 1000);
        expected_y.push(y2);
        for (i = 0; i < expected_x.length; i++) {
            test.deepLooseEqual([actual_x[i], actual_y[i]], [expected_x[i], expected_y[i]], 'Point ' + i + ' of edge');
        }

        newArrowHead = d3.selectAll('.edge').selectAll('polygon').filter(function(d) {
            return d.parent.key == 'b->a'
        });
        points = newArrowHead.attr("points").split(' ').map(function(v) {
            point = v.split(',');
            return [Math.round(+point[0] * 1000) / 1000 , Math.round(+point[1] * 1000) / 1000];
        });
        var actual_x = [];
        var actual_y = [];
        for (i = 0; i < points.length; i += 1) {
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
        for (i = 0; i < expected_x.length; i++) {
            test.deepLooseEqual([actual_x[i], actual_y[i]], [expected_x[i], expected_y[i]], 'Point ' + i + ' of arrow head');
        }
        test.end();
    }

});

tape("drawEdge() draws an edge even if the length is zero", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var num_nodes = 2;
    var num_edges = 0;

    graphviz
        .zoom(false)
        .dot('digraph {graph [rankdir="LR"]; a; b;}')
        .render(drawEdge);

    function drawEdge() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
        arrowHeadLength = 10;
        arrowHeadWidth = 7;
        margin = 0.174;
        x1 = 20;
        y1 = -20;
        x2 = x1;
        y2 = y1;
        graphviz
            .drawEdge(x1, y1, x2, y2);
        num_edges += 1;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');
      test.equal(d3.select('.edge').select('polygon').attr("points"), "10,-23.5 20,-20 10,-16.5 10,-23.5", 'Number of paths after drawing an edge');
        test.equal(d3.selectAll('path').attr("d"), "M20,-20L9.826,-20", 'Number of paths after drawing an edge');

        test.end();
    }

});

tape("drawEdge() draws an edge with an URL attribute in the same way as Graphviz does", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var num_nodes = 2;
    var num_edges = 1;

    graphviz
        .zoom(false)
        .dot('digraph {graph [rankdir="LR"]; a -> b [URL="dummy"];}')
        .render(drawEdge);

    function drawEdge() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
        arrowHeadLength = 10;
        arrowHeadWidth = 7;
        margin = 0.174;
        x1 = 20;
        y1 = -20;
        x2 = 40;
        y2 = -20;
        graphviz
            .drawEdge(x1, y1, x2, y2, {URL: "dummy2"});
        num_edges += 1;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');
        graphviz
            .insertDrawnEdge('b->a');
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after inserting the currently drawn edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after inserting the currently drawn edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after inserting the currently drawn edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after inserting the currently drawn edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after inserting the currently drawn edge');

        line = d3.selectAll('.edge').selectAll('path').filter(function(d) {
            return d.parent.parent.parent.key == 'b->a'
        });
        points = line.attr("d").split(/[MCL ]/).map(function(v) {
            point = v.split(',');
            return [Math.round(+point[0] * 1000) / 1000 , Math.round(+point[1] * 1000) / 1000];
        });
        var actual_x = [];
        var actual_y = [];
        for (i = 1; i < points.length; i += 1) {
            actual_x.push(points[i][0]);
            actual_y.push(points[i][1]);
        }
        var expected_x = [];
        var expected_y = [];
        expected_x.push(x1);
        expected_y.push(y1);
        expected_x.push(Math.round((x2 - margin - arrowHeadLength) * 1000) / 1000);
        expected_y.push(y2);
        for (i = 0; i < expected_x.length; i++) {
            test.deepLooseEqual([actual_x[i], actual_y[i]], [expected_x[i], expected_y[i]], 'Point ' + i + ' of edge');
        }

        newArrowHead = d3.selectAll('.edge').selectAll('polygon').filter(function(d) {
            return d.parent.parent.parent.key == 'b->a'
        });
        points = newArrowHead.attr("points").split(' ').map(function(v) {
            point = v.split(',');
            return [Math.round(+point[0] * 1000) / 1000 , Math.round(+point[1] * 1000) / 1000];
        });
        var actual_x = [];
        var actual_y = [];
        for (i = 0; i < points.length; i += 1) {
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
        for (i = 0; i < expected_x.length; i++) {
            test.deepLooseEqual([actual_x[i], actual_y[i]], [expected_x[i], expected_y[i]], 'Point ' + i + ' of arrow head');
        }
        test.end();
    }

});

tape("drawEdge() draws an edge with an tooltip attribute in the same way as Graphviz does", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var num_nodes = 2;
    var num_edges = 1;

    graphviz
        .zoom(false)
        .dot('digraph {graph [rankdir="LR"]; a -> b [tooltip="dummy"];}')
        .render(drawEdge);

    function drawEdge() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
        arrowHeadLength = 10;
        arrowHeadWidth = 7;
        margin = 0.174;
        x1 = 20;
        y1 = -20;
        x2 = 40;
        y2 = -20;
        graphviz
            .drawEdge(x1, y1, x2, y2, {tooltip: "dummy2"});
        num_edges += 1;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');
        graphviz
            .insertDrawnEdge('b->a');
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after inserting the currently drawn edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after inserting the currently drawn edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after inserting the currently drawn edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after inserting the currently drawn edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after inserting the currently drawn edge');

        line = d3.selectAll('.edge').selectAll('path').filter(function(d) {
            return d.parent.parent.parent.key == 'b->a'
        });
        points = line.attr("d").split(/[MCL ]/).map(function(v) {
            point = v.split(',');
            return [Math.round(+point[0] * 1000) / 1000 , Math.round(+point[1] * 1000) / 1000];
        });
        var actual_x = [];
        var actual_y = [];
        for (i = 1; i < points.length; i += 1) {
            actual_x.push(points[i][0]);
            actual_y.push(points[i][1]);
        }
        var expected_x = [];
        var expected_y = [];
        expected_x.push(x1);
        expected_y.push(y1);
        expected_x.push(Math.round((x2 - margin - arrowHeadLength) * 1000) / 1000);
        expected_y.push(y2);
        for (i = 0; i < expected_x.length; i++) {
            test.deepLooseEqual([actual_x[i], actual_y[i]], [expected_x[i], expected_y[i]], 'Point ' + i + ' of edge');
        }

        newArrowHead = d3.selectAll('.edge').selectAll('polygon').filter(function(d) {
            return d.parent.parent.parent.key == 'b->a'
        });
        points = newArrowHead.attr("points").split(' ').map(function(v) {
            point = v.split(',');
            return [Math.round(+point[0] * 1000) / 1000 , Math.round(+point[1] * 1000) / 1000];
        });
        var actual_x = [];
        var actual_y = [];
        for (i = 0; i < points.length; i += 1) {
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
        for (i = 0; i < expected_x.length; i++) {
            test.deepLooseEqual([actual_x[i], actual_y[i]], [expected_x[i], expected_y[i]], 'Point ' + i + ' of arrow head');
        }
        test.end();
    }

});

tape("insertDrawnEdge() inserts the currently drawn edge into the joined data structure so that it can be animated when the graph is re-rendered", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var num_nodes = 2;
    var num_edges = 1;

    graphviz
        .zoom(false)

        .dot('digraph {graph [rankdir="LR"]; a -> b;}')
        .render(drawEdge);

    function drawEdge() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
        x1 = 20;
        y1 = -20;
        x2 = 40;
        y2 = -20;
        graphviz
            .drawEdge(x1, y1, x2, y2);
        num_edges += 1;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');
        graphviz
            .insertDrawnEdge('b->a');
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after inserting the currently drawn edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after inserting the currently drawn edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after inserting the currently drawn edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after inserting the currently drawn edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after inserting the currently drawn edge');

        graphviz
            .dot('digraph {a -> b; b -> a}')
            .render(endTest);
    }

    function endTest() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after re-rendering with the inserted edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after re-rendering with the inserted edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after re-rendering with the inserted edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after re-rendering with the inserted edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after re-rendering with the inserted edge');
        test.end();
    }

});

tape("removeDrawnEdge() removes the edge currently being drawn", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var num_nodes = 2;
    var num_edges = 1;

    graphviz
        .zoom(false)
        .dot('digraph {graph [rankdir="LR"]; a -> b;}')
        .render(drawEdge);

    function drawEdge() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
        arrowHeadLength = 10;
        arrowHeadWidth = 7;
        margin = 0.174;
        x1 = 20;
        y1 = -20;
        x2 = 40;
        y2 = -20;
        graphviz
            .drawEdge(x1, y1, x2, y2);
        num_edges += 1;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');

        graphviz
            .removeDrawnEdge();
        num_edges -= 1;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after aborting drawing of the current edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after aborting drawing of the current edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons aborting drawing of the current edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses aborting drawing of the current edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after aborting drawing of the current edge');

        graphviz
            .dot('digraph {a -> b; b -> a}')
            .render(endTest);
    }

    function endTest() {
        num_edges = 2;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after re-rendering with the inserted edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after re-rendering with the inserted edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after re-rendering with the inserted edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after re-rendering with the inserted edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after re-rendering with the inserted edge');
        test.end();
    }

});

tape("updateDrawnEdge modifies the start and end points and the attributes of an edge", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var num_nodes = 2;
    var num_edges = 1;

    const hexColors = {
        'black': '#000000',
        'lightgray': '#d3d3d3',
        'red': '#ff0000',
        'purple': '#a020f0',
        'green': '#00ff00',
    };

    function hexColorOf(colorName) {
        return hexColors[colorName];
    }

    graphviz
        .zoom(false)
        .dot('digraph {graph [rankdir="LR"]; a -> b;}')
        .render(drawEdge);

    function drawEdge() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
        arrowHeadLength = 10;
        arrowHeadWidth = 7;
        margin = 0.174;
        x1 = 20;
        y1 = -20;
        x2 = 40;
        y2 = -20;
        graphviz
            .drawEdge(x1, y1, x2, y2, {id: 'drawn-edge'});
        num_edges += 1;
        var edge = d3.select('#drawn-edge');
        test.equal(edge.size(), 1, 'An edge with the specified id attribute is present');
        var line = edge.selectWithoutDataPropagation("path");
        var arrowHead = edge.selectWithoutDataPropagation("polygon");
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');
        test.equal(arrowHead.attr("points"), '30,-23.5 40,-20 30,-16.5 30,-23.5');
        test.equal(line.attr("fill"), 'none', 'Default fill color of a drawn edge line is black');
        test.equal(line.attr("stroke"), hexColorOf('black'), 'Default stroke color of a drawn edge line is black');

        graphviz
            .updateDrawnEdge(21, -21, 41, -21, {fillcolor: "red", color: "purple", penwidth: 2, id: "drawn-edge"});
        test.equal(arrowHead.attr("points"), '31,-24.5 41,-21 31,-17.5 31,-24.5');
        test.equal(arrowHead.attr("fill"), hexColorOf('red'), 'Fill color of a drawn edge is updated to red');
        test.equal(line.attr("stroke"), hexColorOf('purple'), 'Stroke color is updated to purple');
        test.equal(line.attr("stroke-width"), '2', 'Stroke width is updated to 2');

        graphviz
            .updateDrawnEdge(21, -21, 41, -21, {color: "green"});
        test.equal(arrowHead.attr("points"), '31,-24.5 41,-21 31,-17.5 31,-24.5');
        test.equal(arrowHead.attr("fill"), hexColorOf('red'), 'Fill color is not updated when only color is changed');
        test.equal(line.attr("stroke"), hexColorOf('green'), 'Stroke color is updated to green');
        test.equal(line.attr("stroke-width"), '2', 'Stroke width is not updated when only color is changed');

        graphviz
            .updateDrawnEdge(22, -22, 42, -22);
        test.equal(arrowHead.attr("points"), '32,-25.5 42,-22 32,-18.5 32,-25.5');
        test.equal(arrowHead.attr("fill"), hexColorOf('red'), 'Fill color is not updated when no attribute is given');
        test.equal(line.attr("stroke"), hexColorOf('green'), 'Stroke color is updated  when no attribute is given');
        test.equal(line.attr("stroke-width"), '2', 'Stroke width is not updated  when no attribute is given');

        graphviz
            .updateDrawnEdge(22, -22, 42, -22, {color: null, penwidth: null});
        test.equal(arrowHead.attr("points"), '32,-25.5 42,-22 32,-18.5 32,-25.5');
        test.equal(arrowHead.attr("fill"), hexColorOf('red'), 'Fill color is not updated when not specified');
        test.equal(line.attr("stroke"), hexColorOf('black'), 'Stroke color is black when removed');
        test.equal(line.attr("stroke-width"), null, 'Stroke width is removed when removed');

        test.end();
    }

});

tape("moveDrawnEdgeEndPoint modifies the end points of an edge", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var num_nodes = 2;
    var num_edges = 1;

    graphviz
        .zoom(false)
        .dot('digraph {graph [rankdir="LR"]; a -> b;}')
        .render(drawEdge);

    function drawEdge() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
        arrowHeadLength = 10;
        arrowHeadWidth = 7;
        margin = 0.174;
        x1 = 20;
        y1 = -20;
        x2 = 40;
        y2 = -20;
        graphviz
            .drawEdge(x1, y1, x2, y2, {id: 'drawn-edge'});
        num_edges += 1;
        var edge = d3.select('#drawn-edge');
        test.equal(edge.size(), 1, 'An edge with the specified id attribute is present');
        var arrowHead = edge.selectWithoutDataPropagation("polygon");
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');
        test.equal(arrowHead.attr("points"), '30,-23.5 40,-20 30,-16.5 30,-23.5');
        graphviz
            .updateDrawnEdge(21, -21, 41, -21, {fillcolor: "red", color: "purple", penwidth: 2, id: "drawn-edge"});
        test.equal(arrowHead.attr("points"), '31,-24.5 41,-21 31,-17.5 31,-24.5');
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after modifying the currently drawn edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after modifying the currently drawn edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after modifying the currently drawn edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after modifying the currently drawn edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after modifying the currently drawn edge');

        graphviz
            .updateDrawnEdge(22, -22, 1000, -2000, {fillcolor: "red", color: "purple", penwidth: 2, id: "drawn-edge"})
            .moveDrawnEdgeEndPoint(42, -22);
        test.equal(arrowHead.attr("points"), '32,-25.5 42,-22 32,-18.5 32,-25.5');

        test.end();
    }

});

tape("drawnEdgeSelection return a selection containing the edge currently being drawn", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var num_nodes = 2;
    var num_edges = 1;

    graphviz
        .zoom(false)
        .dot('digraph {graph [rankdir="LR"]; a -> b;}')
        .render(drawEdge);

    function drawEdge() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
        arrowHeadLength = 10;
        arrowHeadWidth = 7;
        margin = 0.174;
        x1 = 20;
        y1 = -20;
        x2 = 40;
        y2 = -20;

        var noDrawnEdge = graphviz.drawnEdgeSelection();
        test.ok(noDrawnEdge.empty(), "drawnEdgeSelection() returns an empty selection when no edge is currently being drawn");

        graphviz
            .drawEdge(x1, y1, x2, y2, {id: 'drawn-edge'});
        num_edges += 1;
        var edge = d3.select('#drawn-edge');
        test.equal(edge.size(), 1, 'An edge with the specified id attribute is present');
        var arrowHead = edge.selectWithoutDataPropagation("polygon");
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');

        var drawnEdge = graphviz.drawnEdgeSelection();
        test.equal(drawnEdge.node(), edge.node(), "drawnEdgeSelection() returns the edge currently being drawn");
        graphviz
            .insertDrawnEdge('b -> a');
        var insertedDrawnEdge = graphviz.drawnEdgeSelection();
        test.ok(insertedDrawnEdge.empty(), "drawnEdgeSelection() returns an empty selection when the drawn edge has been inserted into the data");

        test.end();
    }

});

tape("Attempts to operate on an edge without drawing one first is handled gracefully", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var num_nodes = 2;
    var num_edges = 1;

    graphviz
        .zoom(false)
        .dot('digraph {graph [rankdir="LR"]; a -> b;}')
        .render(startTest);

    function startTest() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
        test.throws(function () {
            graphviz
                .updateDrawnEdge(21, -21, 41, -21);
        }, "updateDrawnEdge throws error if not edge has been drawn first");
        test.throws(function () {
            graphviz
                .moveDrawnEdgeEndPoint(42, -22);
        }, "moveDrawnEdgeEndPoint throws error if not edge has been drawn first");
        test.throws(function () {
            graphviz
            .insertDrawnEdge('b->a');
        }, "insertDrawnEdge throws error if not edge has been drawn first");

        test.doesNotThrow(function () {
            graphviz
                .removeDrawnEdge();
        }, "removeDrawnEdge is ignored if no edge has been drawn first");

        test.end();
    }

});
