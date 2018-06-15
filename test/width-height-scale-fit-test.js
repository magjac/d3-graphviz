var tape = require("tape"),
    jsdom = require("./jsdom"),
    d3 = require("d3-selection"),
    d3_graphviz = require("../");

tape("graphviz().width() sets svg width.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph")
        .tweenShapes(false)
        .zoom(false);

    var originalWidthPt = 62;
    var originalHeightPt = 116;

    var originalViewBox = '0.00 0.00 62.00 116.00'

    // Original settings

    graphviz
        .renderDot('digraph {a -> b;}');

    test.equal(+d3.select('svg').attr("width").replace('pt', ''), originalWidthPt, "SVG width is the original width");
    test.equal(+d3.select('svg').attr("height").replace('pt', ''), originalHeightPt, "SVG height is the original height");
    test.equal(d3.select('svg').attr("viewBox"), originalViewBox, "SVG viewBox is the original viewBox");

    // Set width/height with fit, without scale

    var width = originalWidthPt * 2;
    var height = originalHeightPt * 2;

    graphviz
        .width(width)
        .height(null)
        .fit(true)
        .renderDot('digraph {a -> b;}');

    test.equal(+d3.select('svg').attr("width"), width, "SVG width is set with .width()");
    test.equal(+d3.select('svg').attr("height").replace('pt', ''), originalHeightPt, "SVG height is the original height");
    test.equal(d3.select('svg').attr("viewBox"), originalViewBox, "SVG viewBox is the original viewBox when fit is true and scale is not specified");

    graphviz
        .width(null)
        .height(height)
        .fit(true)
        .renderDot('digraph {a -> b;}');

    test.equal(+d3.select('svg').attr("width").replace('pt', ''), originalWidthPt, "SVG width is the original width");
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
    originalWidthViewBox = `0 0 ${originalWidthPt} ${height * 3 / 4}`;
    originalHeightViewBox = `0 0 ${width * 3 / 4} ${originalHeightPt}`;

    graphviz
        .width(width)
        .height(null)
        .fit(false)
        .renderDot('digraph {a -> b;}');

    test.equal(+d3.select('svg').attr("width"), width, "SVG width is set with .width()");
    test.equal(+d3.select('svg').attr("height").replace('pt', ''), originalHeightPt, "SVG height is the original height");
    test.equal(d3.select('svg').attr("viewBox"), originalHeightViewBox, "SVG viewBox is set to svg width and original height when width is set and height is not set and fit is false and scale is not specified");


    graphviz
        .width(null)
        .height(height)
        .fit(false)
        .renderDot('digraph {a -> b;}');

    test.equal(+d3.select('svg').attr("width").replace('pt', ''), originalWidthPt, "SVG width is the original width");
    test.equal(+d3.select('svg').attr("height"), height, "SVG height is set with .height()");
    test.equal(d3.select('svg').attr("viewBox"), originalWidthViewBox, "SVG viewBox is set to svg width and original height when width is not set and height is set and fit is false and scale is not specified");

    graphviz
        .width(width)
        .height(height)
        .fit(false)
        .renderDot('digraph {a -> b;}');


    test.equal(+d3.select('svg').attr("width"), width, "SVG width is set with .width()");
    test.equal(+d3.select('svg').attr("height"), height, "SVG height is set with .height()");
    test.equal(d3.select('svg').attr("viewBox"), viewBox, "SVG viewBox is set to svg size when both width and height is set and fit is false and scale is not specified");

    // Set width/height, with fit and scale

    var width = originalWidthPt * 2;
    var height = originalHeightPt * 2;
    var scale = 0.5;

    viewBox = `0 0 ${originalWidthPt / scale} ${originalHeightPt / scale}`;

    graphviz
        .width(width)
        .height(null)
        .fit(true)
        .scale(scale)
        .renderDot('digraph {a -> b;}');

    test.equal(+d3.select('svg').attr("width"), width, "SVG width is set with .width()");
    test.equal(+d3.select('svg').attr("height").replace('pt', ''), originalHeightPt, "SVG height is the original height");
    test.equal(d3.select('svg').attr("viewBox"), viewBox, "SVG viewBox is set to svg size when fit is true and scale <> 1");

    graphviz
        .width(null)
        .height(height)
        .fit(true)
        .scale(scale)
        .renderDot('digraph {a -> b;}');

    test.equal(+d3.select('svg').attr("width").replace('pt', ''), originalWidthPt, "SVG width is the original width");
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

    scaledViewBox = `0 0 ${width * 3 / 4 / scale} ${height * 3 / 4 / scale}`;
    scaledOriginalWidthViewBox = `0 0 ${originalWidthPt / scale} ${height * 3 / 4 / scale}`;
    scaledOriginalHeightViewBox = `0 0 ${width * 3 / 4 / scale} ${originalHeightPt / scale}`;
    scaledOriginalViewBox = `0 0 ${originalWidthPt / scale} ${originalHeightPt / scale}`;

    graphviz
        .width(width)
        .height(null)
        .fit(false)
        .scale(scale)
        .renderDot('digraph {a -> b;}');

    test.equal(+d3.select('svg').attr("width"), width, "SVG width is set with .width()");
    test.equal(+d3.select('svg').attr("height").replace('pt', ''), originalHeightPt, "SVG height is the original height");
    test.equal(d3.select('svg').attr("viewBox"), scaledOriginalHeightViewBox, "SVG viewBox has scaled svg width and scaled original height when width is set and height is not set and fit is false and scale <> 1");

    graphviz
        .width(null)
        .height(height)
        .fit(false)
        .scale(scale)
        .renderDot('digraph {a -> b;}');

    test.equal(+d3.select('svg').attr("width").replace('pt', ''), originalWidthPt, "SVG width is the original width");
    test.equal(+d3.select('svg').attr("height"), height, "SVG height is set with .height()");
    test.equal(d3.select('svg').attr("viewBox"), scaledOriginalWidthViewBox, "SVG viewBox has scaled original width and scaled svg height when width is not set and height is set and fit is false and scale <> 1");

    graphviz
        .width(width)
        .height(height)
        .fit(false)
        .scale(scale)
        .renderDot('digraph {a -> b;}');


    test.equal(+d3.select('svg').attr("width"), width, "SVG width is set with .width()");
    test.equal(+d3.select('svg').attr("height"), height, "SVG height is set with .height()");
    test.equal(d3.select('svg').attr("viewBox"), scaledViewBox, "SVG viewBox is the scaled svg size when both width and height is set and fit is false and scale <> 1");

    // Don't set width/height, but with fit (nop), without scale
    graphviz
        .width(null)
        .height(null)
        .fit(true)
        .scale(1)
        .renderDot('digraph {a -> b;}');


    test.equal(+d3.select('svg').attr("width").replace('pt', ''), originalWidthPt, "SVG width is the original width");
    test.equal(+d3.select('svg').attr("height").replace('pt', ''), originalHeightPt, "SVG height is the original height");
    test.equal(d3.select('svg').attr("viewBox"), originalViewBox, "SVG viewBox is the scaled original viewBox when svg size is unchanged, fit is true and scale is 1");

    // Don't set width/height, but with fit (nop) and scale

    viewBox = `0 0 ${originalWidthPt / scale} ${originalHeightPt / scale}`;

    graphviz
        .width(null)
        .height(null)
        .fit(true)
        .scale(scale)
        .renderDot('digraph {a -> b;}');

    test.equal(+d3.select('svg').attr("width").replace('pt', ''), originalWidthPt, "SVG width is the original width");
    test.equal(+d3.select('svg').attr("height").replace('pt', ''), originalHeightPt, "SVG height is the original height");
    test.equal(d3.select('svg').attr("viewBox"), viewBox, "SVG viewBox is scaled when svg size is unchanged and fit is true and scale is not 1");

    // Don't set width/height or fit, but with and scale

    viewBox = `0 0 ${originalWidthPt / scale} ${originalHeightPt / scale}`;

    graphviz
        .width(null)
        .height(null)
        .fit(null)
        .scale(scale)
        .renderDot('digraph {a -> b;}');

    test.equal(+d3.select('svg').attr("width").replace('pt', ''), originalWidthPt, "SVG width is the original width");
    test.equal(+d3.select('svg').attr("height").replace('pt', ''), originalHeightPt, "SVG height is the original height");
    test.equal(d3.select('svg').attr("viewBox"), viewBox, "SVG viewBox is scaled when svg size is unchanged and fit is false and scale is not 1");

    test.end();
});
