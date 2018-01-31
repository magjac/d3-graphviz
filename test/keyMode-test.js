var tape = require("tape");
var jsdom = require("./jsdom");
var d3 = require("d3-selection");
var d3_transition = require("d3-transition");
var d3_timer = require("d3-timer");
var d3_graphviz = require("../");

tape("graphviz().keyMode() affects transitions and order of rendering.", function(test) {
    var window = global.window = jsdom('<div id="main"></div>');
    var document = global.document = window.document;
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

    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
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

    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
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
