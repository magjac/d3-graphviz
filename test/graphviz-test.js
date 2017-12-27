var tape = require("tape"),
    jsdom = require("./jsdom"),
    d3 = require("d3-selection"),
    d3_transition = require("d3-transition"),
    d3_timer = require("d3-timer"),
    d3_graphviz = require("../");

tape("graphviz().render() renders an SVG from graphviz DOT.", function(test) {
    var document = global.document = jsdom('<div id="graph"></div>');
    var graphviz = d3_graphviz.graphviz("#graph");

    svgDoc = `<svg width="62pt" height="116pt" viewBox="0.00 0.00 62.00 116.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(4 112)">
<title>%0</title>
<polygon fill="#ffffff" stroke="transparent" points="-4,4 -4,-112 58,-112 58,4 -4,4"></polygon>
<!-- a -->
<g id="node1" class="node">
<title>a</title>
<ellipse fill="none" stroke="#000000" cx="27" cy="-90" rx="27" ry="18"></ellipse>
<text text-anchor="middle" x="27" y="-85.8" font-family="Times,serif" font-size="14.00" fill="#000000">a</text>
</g>
<!-- b -->
<g id="node2" class="node">
<title>b</title>
<ellipse fill="none" stroke="#000000" cx="27" cy="-18" rx="27" ry="18"></ellipse>
<text text-anchor="middle" x="27" y="-13.8" font-family="Times,serif" font-size="14.00" fill="#000000">b</text>
</g>
<!-- a&#45;&gt;b -->
<g id="edge1" class="edge">
<title>a-&gt;b</title>
<path fill="none" stroke="#000000" d="M27,-71.8314C27,-64.131 27,-54.9743 27,-46.4166"></path>
<polygon fill="#000000" stroke="#000000" points="30.5001,-46.4132 27,-36.4133 23.5001,-46.4133 30.5001,-46.4132"></polygon>
</g>
</g>
</svg>`;

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .dot('digraph {a -> b;}')
        .render();

    test.equal(d3.select('div').html(), svgDoc, "SVG after initial rendering");

    // Check data tag by tag
    test.equal(d3.select('svg').data()[0].tag, 'svg', '"svg" tag present in data joined with SVG');
    test.equal(d3.select('g').data()[0].tag, 'g', '"g" tag present in data joined with first svg group element');
    test.equal(d3.select('title').data()[0].tag, 'title', '"title" tag present in data joined with first title element');
    test.equal(d3.select('ellipse').data()[0].tag, 'ellipse', '"ellipse" tag present in data joined with first ellipse element');
    test.equal(d3.select('text').data()[0].tag, 'text', '"text" tag present in data joined with first text element');
    test.equal(d3.select('path').data()[0].tag, 'path', '"path" tag present in data joined with first path element');
    test.equal(d3.select('polygon').data()[0].tag, 'polygon', '"polygon" tag present in data joined with first polygon element');

    // Check data tag by id
    test.equal(d3.select('#graph0').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "graph0"');
    test.equal(d3.select('#node1').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "node1"');
    test.equal(d3.select('#node2').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "node2"');
    test.equal(d3.select('#edge1').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "edge1"');

    // Check data tag by class
    test.equal(d3.select('.graph').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "graph"');
    test.equal(d3.select('.node').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "node"');
    test.equal(d3.select('.edge').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "edge"');

    // Check full data structure for some primary elements
    var data = d3.select('svg').data();
    var svgData = data[0];
    var graph0Data = svgData.children[1];

    test.deepEqual(d3.select('svg').datum(), svgData, 'Data structure present on SVG');
    test.deepEqual(d3.select('#graph0').datum(), graph0Data, 'Data structure present on element with id "graph0"');
    test.deepEqual(d3.select('#node1').datum(), graph0Data.children[7], 'Data structure present on element with id "node1"');
    test.deepEqual(d3.select('#node2').datum(), graph0Data.children[11], 'Data structure present on element with id "node2"');
    test.deepEqual(d3.select('#edge1').datum(), graph0Data.children[15], 'Data structure present on element with id "edge1"');

    test.end();
});

tape("graphviz().render() renders on a div with sub-elements", function(test) {
    var document = global.document = jsdom('<div id="graph"><div id="dummy">Hello World</div></div>');
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .dot('digraph {a -> b;}')
        .render();

    // Check data tag by tag
    test.equal(d3.select('svg').data()[0].tag, 'svg', '"svg" tag present in data joined with SVG');
    test.equal(d3.select('g').data()[0].tag, 'g', '"g" tag present in data joined with first svg group element');
    test.equal(d3.select('title').data()[0].tag, 'title', '"title" tag present in data joined with first title element');
    test.equal(d3.select('ellipse').data()[0].tag, 'ellipse', '"ellipse" tag present in data joined with first ellipse element');
    test.equal(d3.select('text').data()[0].tag, 'text', '"text" tag present in data joined with first text element');
    test.equal(d3.select('path').data()[0].tag, 'path', '"path" tag present in data joined with first path element');
    test.equal(d3.select('polygon').data()[0].tag, 'polygon', '"polygon" tag present in data joined with first polygon element');

    // Check data tag by id
    test.equal(d3.select('#graph0').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "graph0"');
    test.equal(d3.select('#node1').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "node1"');
    test.equal(d3.select('#node2').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "node2"');
    test.equal(d3.select('#edge1').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "edge1"');

    // Check data tag by class
    test.equal(d3.select('.graph').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "graph"');
    test.equal(d3.select('.node').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "node"');
    test.equal(d3.select('.edge').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "edge"');

    // Check full data structure for some primary elements
    var data = d3.select('svg').data();
    var svgData = data[0];
    var graph0Data = svgData.children[1];

    test.deepEqual(d3.select('svg').datum(), svgData, 'Data structure present on SVG');
    test.deepEqual(d3.select('#graph0').datum(), graph0Data, 'Data structure present on element with id "graph0"');
    test.deepEqual(d3.select('#node1').datum(), graph0Data.children[7], 'Data structure present on element with id "node1"');
    test.deepEqual(d3.select('#node2').datum(), graph0Data.children[11], 'Data structure present on element with id "node2"');
    test.deepEqual(d3.select('#edge1').datum(), graph0Data.children[15], 'Data structure present on element with id "edge1"');

    test.end();
});

tape("graphviz().render() removes SVG elements for nodes and edges when removed from updated DOT.", function(test) {

    var document = global.document = jsdom('<div id="graph"></div>');
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .dot('digraph {a -> b;}')
        .render();
    test.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    graphviz
        .dot('digraph {a}')
        .render();

    svgDoc2 = `<svg width="62pt" height="44pt" viewBox="0.00 0.00 62.00 44.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(4 40)">
<title>%0</title>
<polygon fill="#ffffff" stroke="transparent" points="-4,4 -4,-40 58,-40 58,4 -4,4"></polygon>
<!-- a -->
<g id="node1" class="node">
<title>a</title>
<ellipse fill="none" stroke="#000000" cx="27" cy="-18" rx="27" ry="18"></ellipse>
<text text-anchor="middle" x="27" y="-13.8" font-family="Times,serif" font-size="14.00" fill="#000000">a</text>
</g>
</g>
</svg>`;

    test.equal(d3.selectAll('.node').size(), 1, 'Number of nodes after removal');
    test.equal(d3.selectAll('.edge').size(), 0, 'Number of edges after removal');
    test.equal(d3.select('div').html(), svgDoc2, "SVG after removal of one edge and one node");

    test.end();
});

tape("graphviz().render() adds SVG elements for nodes and edges when added to updated DOT.", function(test) {
    var document = global.document = jsdom('<div id="graph"></div>');
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .dot('digraph {a -> b;}')
        .render();
    test.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    graphviz
        .dot('digraph {a -> b; a -> c}')
        .render();
    test.equal(d3.selectAll('.node').size(), 3, 'Number of nodes after add');
    test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after add');

    test.end();
});

tape("graphviz().renderDot() renders an SVG from graphviz DOT.", function(test) {
    var document = global.document = jsdom('<div id="graph"></div>');
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .renderDot('digraph {a -> b;}');
    test.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of initial ellipses');
    test.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
    test.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');

    test.end();
});

tape("graphviz().render() updates SVG text element when node name changes in DOT.", function(test) {
    var document = global.document = jsdom('<div id="graph"></div>');
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .dot('digraph {a}')
        .render();
    test.equal(d3.selectAll('.node').size(), 1, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 0, 'Number of initial edges');
    test.equal(d3.selectAll('text').text(), 'a', 'Text of initial node');
    graphviz
        .dot('digraph {b}')
        .render();
    test.equal(d3.selectAll('.node').size(), 1, 'Number of nodes after node name change');
    test.equal(d3.selectAll('.edge').size(), 0, 'Number of edges after node name change');
    test.equal(d3.selectAll('text').text(), 'b', 'Text after node name change');

    test.end();
});

tape("graphviz().render() changes SVG element type when node shape changes in DOT.", function(test) {
    var document = global.document = jsdom('<div id="graph"></div>');
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .dot('digraph {a -> b;}')
        .render();
    test.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of initial ellipses');
    test.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
    test.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');
    graphviz
        .dot('digraph {a [shape="box"];a -> b}')
        .render();
    test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after shape change');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges after shape change');
    test.equal(d3.selectAll('ellipse').size(), 1, 'Number of ellipses after shape change');
    test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons after shape change');
    test.equal(d3.selectAll('path').size(), 1, 'Number of paths after shape change');

    test.end();
});

tape("graphviz().render() adds and removes SVG elements after transition delay.", function(test) {

    var document = global.document = jsdom('<div id="graph"></div>');
    var graphviz = d3_graphviz.graphviz("#graph");

    transition1 = d3_transition.transition().duration(0);
    graphviz
        .tweenShapes(false)
        .zoom(false)
        .transition(transition1)
        .dot('digraph {a -> b; c}')
        .render()
        .on("end", part1_end);

    function part1_end() {
        test.equal(d3.selectAll('.node').size(), 3, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), 3, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');

        transition1 = d3_transition.transition().duration(0);
        graphviz
            .dot('digraph {a -> b; b -> a}')
            .transition(transition1)
            .fade(false)
            .tweenPaths(false)
            .on("renderEnd", part2_end)
            .on("end", null)
            .render();
    }

    function part2_end() {
        test.equal(d3.selectAll('.node').size(), 3, 'Number of nodes immediately after rendering');
        test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges immediately after rendering');
        test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons immediately after rendering');
        test.equal(d3.selectAll('ellipse').size(), 3, 'Number of ellipses immediately after rendering');
        test.equal(d3.selectAll('path').size(), 2, 'Number of paths immediately after rendering');

        d3_timer.timeout(function(elapsed) {
            part3_end();
        }, 100);
    }

    function part3_end() {

        test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after transition');
        test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after transition');
        test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons after transition');
        test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses after transition');
        test.equal(d3.selectAll('path').size(), 2, 'Number of paths after transition');

        test.end();
    }
});

tape("graphviz().keyMode() affects transitions and order of rendering.", function(test) {
    var document = global.document = jsdom('<div id="main"></div>');
    var keyModes = [
        'title',
        'tag-index',
        'id',
// NOTE: The 'index' keyMode is not useful, because it may create transition between SVG objects of different types which yields error:
// TypeError: Cannot read property 'baseVal' of undefined
//    at parseSvg (/home/magjac/external/d3-graphviz/node_modules/d3-interpolate/build/d3-interpolate.js:303:34)
//        'index',
    ];
    var delay = 500;
    var duration = 500;
    keyModes.forEach(function (keyMode) {
        d3.select('#main')
          .append('div')
            .attr('id', 'graph-' + keyMode)
        var graphviz = d3_graphviz.graphviz("#graph-" + keyMode);
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .keyMode(keyMode)
            .dot('digraph {a -> b; c}')
            .render();
        checkInitalRendering(keyMode);
        transition1 = d3_transition.transition().delay(delay).duration(duration);
        graphviz
            .keyMode(keyMode)
            .dot('digraph {a -> b; b -> a}')
            .transition(transition1)
            .fade(false)
            .tweenPaths(false)
            .render();

        checkBeforeScheduling(keyMode);
        d3_timer.timeout(function(elapsed) {
            checkBeforeStarting(keyMode)
        }, delay / 2);
        transition1
            .on('start', function() {
                checkAtStarting(keyMode);
               });
        d3_timer.timeout(function(elapsed) {
            checkAfterStarting(keyMode)
        }, delay + duration / 2);
        transition1
            .on('end', function() {
                checkAtEnding(keyMode);
               });
        d3_timer.timeout(function(elapsed) {
            checkAfterEnding(keyMode)
        }, delay + duration + delay);
    });

    d3_timer.timeout(function(elapsed) {
        endTest()
    }, delay + duration + delay);

    function check(counts, state, keyMode) {
        for (name in counts) {
            var count = counts[name];
            objectName = name.replace('.', '');
            test.equal(d3.select('#graph-' + keyMode).selectAll(name).size(), count, 'Number of ' + objectName + 's is ' + count + ' ' + state + ' transition with keyMode ' + keyMode);
        }
    }

    function checkInitalRendering(keyMode) {
        var counts = {
            '.node': 3,
            '.edge': 1,
            'polygon': 2,
            'ellipse': 3,
        };
        check(counts, 'after initial rendering without', keyMode);
    }

    function checkBeforeScheduling(keyMode) {
        var counts = {
            '.node': 3,
            '.edge': 1,
            'polygon': keyMode == 'index' ? 5 : 3,
            'ellipse': keyMode == 'index' ? 5 : 3,
        };
        check(counts, 'before scheduling', keyMode);
    }

    function checkBeforeStarting(keyMode) {
        var counts = {
            '.node': 3,
            '.edge': 1,
            'polygon': keyMode == 'index' ? 5 : 3,
            'ellipse': keyMode == 'index' ? 5 : 3,
        };
        check(counts, 'before starting', keyMode);
    }

    function checkAtStarting(keyMode) {
        var counts = {
            '.node': 3,
            '.edge': keyMode == 'id' ? 2 : 1,
            'polygon': keyMode == 'index' ? 5 : 3,
            'ellipse': keyMode == 'index' ? 5 : 3,
        };
        check(counts, 'at starting', keyMode);
    }

    function checkAfterStarting(keyMode) {
        var counts = {
            '.node': keyMode == 'tag-index' ? 2 : 3,
            '.edge': 2,
            'polygon': keyMode == 'index' ? 5 : 3,
            'ellipse': keyMode == 'index' ? 5 : 3,
        };
        check(counts, 'after starting', keyMode);
    }

    function checkAtEnding(keyMode) {
        var counts = {
            '.node': keyMode == 'tag-index' ? 2 : 3,
            '.edge': 2,
            'polygon': keyMode == 'index' ? 5 : 3,
            'ellipse': keyMode == 'index' ? 5 : 3,
        };
        check(counts, 'at ending', keyMode);
    }

    function checkAfterEnding(keyMode) {
        var counts = {
            '.node': 2,
            '.edge': 2,
            'polygon': 3,
            'ellipse': 2,
        };
        check(counts, 'after ending', keyMode);
    }

    function endTest() {
        test.end();
    }

});

tape("graphviz().keyMode() does not accept illegal key modes.", function(test) {

    var document = global.document = jsdom('<div id="graph"></div>');
    var graphviz = d3_graphviz.graphviz("#graph");

    function useIllegalKeyMode() {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .keyMode('illegal-key-mode')
            .dot('digraph {a -> b}')
            .render();
    }

    test.throws(useIllegalKeyMode, 'Illegal keyMode throws error');

    test.end();

});

tape("graphviz().keyMode() cannot be changed after applying dot source.", function(test) {

    var document = global.document = jsdom('<div id="graph"></div>');
    var graphviz = d3_graphviz.graphviz("#graph");

    function changeKeyMode() {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .keyMode('title')
            .dot('digraph {a -> b}')
            .keyMode('id')
            .render();
    }

    test.throws(changeKeyMode, 'Too late change of keyMode throws error');

    test.end();

});

tape("graphviz().tweenPaths() enables and disables path tweening during transitions. FIXME: tape bug prohibits tweenPaths enabled test.", function(test) {

    var document = global.document = jsdom('<div id="graph"></div>');
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .dot('digraph {a -> b; c}')
        .render();
    test.equal(d3.selectAll('.node').size(), 3, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    test.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
    test.equal(d3.selectAll('ellipse').size(), 3, 'Number of initial ellipses');
    test.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');
    transition1 = d3_transition.transition().duration(0);
    graphviz
        .dot('digraph {a -> b; b -> a}')
        .transition(transition1)
        .fade(false)
        .tweenPaths(false)
        .render();
    test.equal(d3.selectAll('.node').size(), 3, 'Number of nodes immediately after rendering');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges immediately after rendering');
    test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons immediately after rendering');
    test.equal(d3.selectAll('ellipse').size(), 3, 'Number of ellipses immediately after rendering');
    test.equal(d3.selectAll('path').size(), 2, 'Number of paths immediately after rendering');

    d3_timer.timeout(function(elapsed) {
        part1_end();
    }, 100);

    function part1_end() {

        test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after transition');
        test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after transition');
        test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons after transition');
        test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses after transition');
        test.equal(d3.selectAll('path').size(), 2, 'Number of paths after transition');

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        function renderWithPathTweening() {
            graphviz
                .dot('digraph {a -> b; b -> a}')
                .transition(transition1)
                .tweenPaths(true)
                .render();
        }

        d3_timer.timeout(function(elapsed) {
            part2_end();
        }, 0);
    }

    function part2_end() {

        test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after transition');
        test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after transition');
        test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons after transition');
        test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses after transition');
        test.equal(d3.selectAll('path').size(), 2, 'Number of paths after transition');
        test.end();
    }
});

tape("graphviz().tweenShapes() enables and disables shape tweening during transitions.", function(test) {

    var document = global.document = jsdom('<div id="graph"></div>');
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(true)
        .zoom(false)
        .tweenPaths(true)
        .convertEqualSidedPolygons(false)
        .dot('digraph {a -> b;}')
        .render();
    test.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of initial ellipses');
    test.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
    test.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');
    transition1 = d3_transition.transition().duration(0);
    graphviz
        .dot('digraph {a [shape="box"];a -> b}')
        .transition(transition1)
        .render();
    test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes immediately after rendering');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges immediately after rendering');
    test.equal(d3.selectAll('polygon').size(), 2, 'Number of polygons immediately after rendering');
    test.equal(d3.selectAll('ellipse').size(), 1, 'Number of ellipses immediately after rendering');
    test.equal(d3.selectAll('path').size(), 2, 'Number of paths immediately after rendering');



    d3_timer.timeout(function(elapsed) {
        part1_end();
    }, 100);

    function part1_end() {

        test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after shape change');
        test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges after shape change');
        test.equal(d3.selectAll('ellipse').size(), 1, 'Number of ellipses after shape change');
        test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons after shape change');
        test.equal(d3.selectAll('path').size(), 1, 'Number of paths after shape change');

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        function renderWithShapeTweening() {
            graphviz
                .dot('digraph {a -> b; b -> a}')
                .transition(transition1)
                .tweenShapes(true)
                .zoom(false)
                .render();
        }

        d3_timer.timeout(function(elapsed) {
            part2_end();
        }, 0);
    }

    function part2_end() {

        test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after shape change');
        test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges after shape change');
        test.equal(d3.selectAll('ellipse').size(), 1, 'Number of ellipses after shape change');
        test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons after shape change');
        test.equal(d3.selectAll('path').size(), 1, 'Number of paths after shape change');

        test.end();
    }
});

tape("graphviz().renderDot() renders an SVG from graphviz strict undirectd DOT.", function(test) {
    var document = global.document = jsdom('<div id="graph"></div>');
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .renderDot('strict graph {a -- b;}');
    test.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of initial ellipses');
    test.equal(d3.selectAll('polygon').size(), 1, 'Number of initial polygons');
    test.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');
    graphviz
        .dot('graph {a -- b; b -- a}')
        .fade(false)
        .tweenPaths(false)
        .render();
    test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after adding one edge');
    test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after adding one edge');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses after adding one edge');
    test.equal(d3.selectAll('polygon').size(), 1, 'Number of polygons after adding one edge');
    test.equal(d3.selectAll('path').size(), 2, 'Number of paths after adding one edge');

    test.end();
});

tape("graphviz().renderDot() renders an SVG from graphviz strict directd DOT.", function(test) {
    var document = global.document = jsdom('<div id="graph"></div>');
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .renderDot('digraph {a -> b;}');
    test.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of initial ellipses');
    test.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
    test.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');
    graphviz
        .dot('strict digraph {a -> b; b -> a}')
        .fade(false)
        .tweenPaths(false)
        .render();
    test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after adding an edge');
    test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after adding an edge');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses after adding an edge');
    test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons after adding an edge');
    test.equal(d3.selectAll('path').size(), 2, 'Number of paths after adding an edge');

    test.end();
});

tape("graphviz().render() renders edges with tooltip attribute.", function(test) {
    var document = global.document = jsdom('<div id="graph"></div>');
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .renderDot('digraph {edge [tooltip="\\\\E"]; a -> b;}');
    test.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    test.equal(d3.selectAll('g').size(), 5, 'Number of groups');
    test.equal(d3.selectAll('a').size(), 1, 'Number of hyperlinks');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
    test.equal(d3.selectAll('path').size(), 1, 'Number of paths');
    graphviz
        .renderDot('digraph {edge [tooltip="\\\\E"]; a -> b; a -> c}')
    test.equal(d3.selectAll('.node').size(), 3, 'Number of nodes after add');
    test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after add');
    test.equal(d3.selectAll('g').size(), 8, 'Number of groups');
    test.equal(d3.selectAll('a').size(), 2, 'Number of hyperlinks');
    test.equal(d3.selectAll('ellipse').size(), 3, 'Number of ellipses');
    test.equal(d3.selectAll('path').size(), 2, 'Number of paths');

    test.end();
});

tape("graphviz().render() renders growing edges to nodes with URL attribute.", function(test) {
    var document = global.document = jsdom('<div id="graph"></div>');
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .growEnteringEdges(true)
        .zoom(false)
        .renderDot('digraph {node [URL="DUMMY-URL"]; a -> b;}');
    test.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    test.equal(d3.selectAll('g').size(), 6, 'Number of groups');
    test.equal(d3.selectAll('a').size(), 2, 'Number of hyperlinks');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
    test.equal(d3.selectAll('path').size(), 1, 'Number of paths');
    graphviz
        .renderDot('digraph {node [URL="DUMMY-URL"]; a -> b; a -> c}')
    test.equal(d3.selectAll('.node').size(), 3, 'Number of nodes after add');
    test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after add');
    test.equal(d3.selectAll('g').size(), 9, 'Number of groups');
    test.equal(d3.selectAll('a').size(), 3, 'Number of hyperlinks');
    test.equal(d3.selectAll('ellipse').size(), 3, 'Number of ellipses');
    test.equal(d3.selectAll('path').size(), 2, 'Number of paths');

    test.end();
});
