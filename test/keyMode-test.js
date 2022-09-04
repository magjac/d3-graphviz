import assert from "assert";
import {select as d3_select} from "d3-selection";
import {transition as d3_transition} from "d3-transition";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";

let html = '<div id="main"></div>';

it("graphviz().keyMode() affects transitions and order of rendering.", html, function () { return new Promise(resolve => {
    var keyModes = [
        'title',
        'tag-index',
        'id',
        'index',
    ];
    const nRenderings = 2;
    var delay = 500;
    var duration = 500;
    const current_timeout = this.timeout();
    this.timeout(current_timeout + keyModes.length * nRenderings * (delay + duration));
    var keyModeIndex = 0;
    renderKeyMode();

    function renderKeyMode() {
        const keyMode = keyModes[keyModeIndex]
        d3_select('#main')
          .append('div')
            .attr('id', 'graph-' + keyMode)
        var graphviz = d3_graphviz("#graph-" + keyMode)
            .on("initEnd", render_1st);
        function render_1st() {
            graphviz
                .tweenShapes(false)
                .zoom(false)
                .keyMode(keyMode)
                .dot('digraph {a -> b; c}')
                .transition(function () {
                    return d3_transition().delay(delay).duration(duration);
                })
                .render()
                .on("end", function() {
                    checkInitalRendering(keyMode);
                    render_2nd();
                });
        }

        function render_2nd() {
            graphviz
                .keyMode(keyMode)
                .dot('digraph {a -> b; b -> a}')
                .transition(function () {
                    d3_transition("helper-" + keyMode).delay(delay).duration(0)
                        .transition().delay(0).duration(0)
                        .on("start", function() {
                            checkAtStarting(keyMode);
                        })
                        .transition().delay(0).duration(0)
                        .on("start", function() {
                            checkAfterStarting(keyMode);
                        });
                    return d3_transition("main-" + keyMode).delay(delay).duration(duration);
                })
                .fade(false)
                .tweenPaths(false)
                .render()
                .on("renderEnd", function() {
                    checkBeforeScheduling(keyMode);
                })
                .on("transitionStart", function() {
                    checkBeforeScheduling(keyMode);
                })
                .on("transitionEnd", function() {
                    checkAtEnding(keyMode);
                })
                .on("restoreEnd", function() {
                    checkAfterEnding(keyMode)
                })
                .on("end", function() {
                    checkAfterEnding(keyMode)
                    if (keyMode == keyModes[keyModes.length -1]) {
                        endTest()
                    } else {
                        keyModeIndex += 1;
                        renderKeyMode()
                    }
                });
        }
    }

    function check(counts, state, keyMode) {
        for (let name in counts) {
            var count = counts[name];
            const objectName = name.replace('.', '');
            assert.equal(d3_select('#graph-' + keyMode).selectAll(name).size(), count, 'Number of ' + objectName + 's is ' + count + ' ' + state + ' transition with keyMode ' + keyMode);
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
            '.edge': 1,
            'polygon': keyMode == 'index' ? 5 : 3,
            'ellipse': keyMode == 'index' ? 5 : 3,
        };
        check(counts, 'at starting', keyMode);
    }

    function checkAfterStarting(keyMode) {
        var counts = {
            '.node': keyMode == 'tag-index' ? 2 : keyMode == 'index' ? 5 : 3,
            '.edge': keyMode == 'index' ? 3 : 2,
            'polygon': keyMode == 'index' ? 5 : 3,
            'ellipse': keyMode == 'index' ? 5 : 3,
        };
        check(counts, 'after starting', keyMode);
    }

    function checkAtEnding(keyMode) {
        var counts = {
            '.node': keyMode == 'tag-index' ? 2 : keyMode == 'index' ? 5 : 3,
            '.edge': keyMode == 'index' ? 3 : 2,
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
        resolve();
    }

})});

html = '<div id="graph"></div>';

it("graphviz().keyMode() does not accept illegal key modes.", html, () => new Promise(resolve => {

    var graphviz = d3_graphviz("#graph");

    function useIllegalKeyMode() {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .keyMode('illegal-key-mode')
            .dot('digraph {a -> b}')
            .render();
    }

    assert.throws(useIllegalKeyMode, 'Illegal keyMode throws error');

    resolve();

}));

it("graphviz().keyMode() cannot be changed after applying dot source.", html, () => new Promise(resolve => {

    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    function startTest() {
        function changeKeyMode() {
            graphviz
            .tweenShapes(false)
            .zoom(false)
            .keyMode('title')
            .dot('digraph {a -> b}')
            .keyMode('id')
            .render();
        }

        assert.throws(changeKeyMode, 'Too late change of keyMode throws error');

        resolve();

    }
}));
