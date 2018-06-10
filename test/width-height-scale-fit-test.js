var tape = require("tape"),
    jsdom = require("./jsdom"),
    d3 = require("d3-selection"),
    d3_graphviz = require("../");

function round12(x) {
    return Math.round(x * 1000000000000) / 1000000000000;
}

tape("graphviz().width() sets svg width.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph")
        .tweenShapes(false)
        .zoom(false);

    var originalWidth = 62;
    var originalHeight = 116;
    var originalAspectRatio = originalWidth / originalHeight;

    var originalViewBox = '0.00 0.00 62.00 116.00'

    // Original settings

    graphviz
        .renderDot('digraph {a -> b;}');

    test.equal(+d3.select('svg').attr("width").replace('pt', ''), originalWidth, "SVG width is the original width");
    test.equal(+d3.select('svg').attr("height").replace('pt', ''), originalHeight, "SVG height is the original height");
    test.equal(d3.select('svg').attr("viewBox"), originalViewBox, "SVG viewBox is the original viewBox");

    // Set width/height with fit, without scale

    var width = originalWidth * 2;
    var height = originalHeight * 2;

    graphviz
        .width(width)
        .height(null)
        .fit(true)
        .renderDot('digraph {a -> b;}');

    test.equal(+d3.select('svg').attr("width"), width, "SVG width is set with .width()");
    test.equal(round12(+d3.select('svg').attr("height")), round12(width / originalAspectRatio), "SVG height is scaled with aspect ratio");
    test.equal(d3.select('svg').attr("viewBox"), originalViewBox, "SVG viewBox is the original viewBox when fit is true and scale is not specified");

    graphviz
        .width(null)
        .height(height)
        .fit(true)
        .renderDot('digraph {a -> b;}');

    test.equal(round12(+d3.select('svg').attr("width")), round12(height * originalAspectRatio), "SVG width is scaled with aspect ratio");
    test.equal(+d3.select('svg').attr("height"), height, "SVG height is set with .height()");
    test.equal(d3.select('svg').attr("viewBox"), originalViewBox, "SVG viewBox is the original viewBox when fit is true and scale is not specified");

    graphviz
        .width(width)
        .height(height)
        .fit(true)
        .renderDot('digraph {a -> b;}');


    test.equal(+d3.select('svg').attr("width"), width, "SVG width is set with .width()");
    test.equal(+d3.select('svg').attr("height"), height, "SVG height is set with .height()");
    test.equal(d3.select('svg').attr("viewBox"), originalViewBox, "SVG viewBox is the original viewBox when fit is true and scale is not specified");

    // Set width/height without fit and scale

    viewBox = `0 0 ${width * 3 / 4} ${height * 3 / 4}`;

    graphviz
        .width(width)
        .height(null)
        .fit(false)
        .renderDot('digraph {a -> b;}');

    test.equal(+d3.select('svg').attr("width"), width, "SVG width is set with .width()");
    test.equal(round12(+d3.select('svg').attr("height")), round12(width / originalAspectRatio), "SVG height is scaled with aspect ratio");
    test.equal(d3.select('svg').attr("viewBox"), viewBox, "SVG viewBox is set to svg size when fit is false and scale is not specified");

    graphviz
        .width(null)
        .height(height)
        .fit(false)
        .renderDot('digraph {a -> b;}');

    test.equal(round12(+d3.select('svg').attr("width")), round12(height * originalAspectRatio), "SVG width is scaled with aspect ratio");
    test.equal(+d3.select('svg').attr("height"), height, "SVG height is set with .height()");
    test.equal(d3.select('svg').attr("viewBox"), viewBox, "SVG viewBox is set to svg size when fit is false and scale is not specified");

    graphviz
        .width(width)
        .height(height)
        .fit(false)
        .renderDot('digraph {a -> b;}');


    test.equal(+d3.select('svg').attr("width"), width, "SVG width is set with .width()");
    test.equal(+d3.select('svg').attr("height"), height, "SVG height is set with .height()");
    test.equal(d3.select('svg').attr("viewBox"), viewBox, "SVG viewBox is set to svg size when fit is false and scale is not specified");

    // Set width/height, with fit and scale

    var width = originalWidth * 2;
    var height = originalHeight * 2;
    var scale = 0.5;

    viewBox = `0 0 ${originalWidth / scale} ${originalHeight / scale}`;

    graphviz
        .width(width)
        .height(null)
        .fit(true)
        .scale(scale)
        .renderDot('digraph {a -> b;}');

    test.equal(+d3.select('svg').attr("width"), width, "SVG width is set with .width()");
    test.equal(round12(+d3.select('svg').attr("height")), round12(width / originalAspectRatio), "SVG height is scaled with aspect ratio");
    test.equal(d3.select('svg').attr("viewBox"), viewBox, "SVG viewBox is set to svg size when fit is false and scale <> 1");

    graphviz
        .width(null)
        .height(height)
        .fit(true)
        .scale(scale)
        .renderDot('digraph {a -> b;}');

    test.equal(round12(+d3.select('svg').attr("width")), round12(height * originalAspectRatio), "SVG width is scaled with aspect ratio");
    test.equal(+d3.select('svg').attr("height"), height, "SVG height is set with .height()");
    test.equal(d3.select('svg').attr("viewBox"), viewBox, "SVG viewBox is the original viewBox when fit is true and scale <> 1");

    graphviz
        .width(width)
        .height(height)
        .fit(true)
        .scale(scale)
        .renderDot('digraph {a -> b;}');


    test.equal(+d3.select('svg').attr("width"), width, "SVG width is set with .width()");
    test.equal(+d3.select('svg').attr("height"), height, "SVG height is set with .height()");
    test.equal(d3.select('svg').attr("viewBox"), viewBox, "SVG viewBox is the original viewBox when fit is true and scale <> 1");

    // Set width/height, without fit, with scale

    viewBox = `0 0 ${width * 3 / 4 / scale} ${height * 3 / 4 / scale}`;

    graphviz
        .width(width)
        .height(null)
        .fit(false)
        .scale(scale)
        .renderDot('digraph {a -> b;}');

    test.equal(+d3.select('svg').attr("width"), width, "SVG width is set with .width()");
    test.equal(round12(+d3.select('svg').attr("height")), round12(width / originalAspectRatio), "SVG height is scaled with aspect ratio");
    test.equal(d3.select('svg').attr("viewBox"), viewBox, "SVG viewBox is set to svg size when fit is false and scale <> 1");

    graphviz
        .width(null)
        .height(height)
        .fit(false)
        .scale(scale)
        .renderDot('digraph {a -> b;}');

    test.equal(round12(+d3.select('svg').attr("width")), round12(height * originalAspectRatio), "SVG width is scaled with aspect ratio");
    test.equal(+d3.select('svg').attr("height"), height, "SVG height is set with .height()");
    test.equal(d3.select('svg').attr("viewBox"), viewBox, "SVG viewBox is set to svg size when fit is false and scale <> 1");

    graphviz
        .width(width)
        .height(height)
        .fit(false)
        .scale(scale)
        .renderDot('digraph {a -> b;}');


    test.equal(+d3.select('svg').attr("width"), width, "SVG width is set with .width()");
    test.equal(+d3.select('svg').attr("height"), height, "SVG height is set with .height()");
    test.equal(d3.select('svg').attr("viewBox"), viewBox, "SVG viewBox is set to svg size when fit is false and scale <> 1");

    // Don't set width/height, but with fit (nop), without scale
    graphviz
        .width(null)
        .height(null)
        .fit(true)
        .scale(1)
        .renderDot('digraph {a -> b;}');


    test.equal(+d3.select('svg').attr("width").replace('pt', ''), originalWidth, "SVG width is the original width");
    test.equal(+d3.select('svg').attr("height").replace('pt', ''), originalHeight, "SVG height is the original height");
    test.equal(d3.select('svg').attr("viewBox"), originalViewBox, "SVG viewBox is the original viewBox when svg size is unchanged, fit is true and scale is 1");

    // Don't set width/height, but with fit (nop) and scale

    viewBox = `0 0 ${originalWidth / scale} ${originalHeight / scale}`;

    graphviz
        .width(null)
        .height(null)
        .fit(true)
        .scale(scale)
        .renderDot('digraph {a -> b;}');

    test.equal(+d3.select('svg').attr("width").replace('pt', ''), originalWidth, "SVG width is the original width");
    test.equal(+d3.select('svg').attr("height").replace('pt', ''), originalHeight, "SVG height is the original height");
    test.equal(d3.select('svg').attr("viewBox"), viewBox, "SVG viewBox is scaled when svg size is unchanged and fit is true and scale is not 1");

    // Don't set width/height or fit, but with and scale

    viewBox = `0 0 ${originalWidth / scale} ${originalHeight / scale}`;

    graphviz
        .width(null)
        .height(null)
        .fit(null)
        .scale(scale)
        .renderDot('digraph {a -> b;}');

    test.equal(+d3.select('svg').attr("width").replace('pt', ''), originalWidth, "SVG width is the original width");
    test.equal(+d3.select('svg').attr("height").replace('pt', ''), originalHeight, "SVG height is the original height");
    test.equal(d3.select('svg').attr("viewBox"), viewBox, "SVG viewBox is scaled when svg size is unchanged and fit is false and scale is not 1");

    test.end();
});
