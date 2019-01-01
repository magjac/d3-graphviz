var tape = require("tape");
var jsdom = require("./jsdom");
var deepEqualData = require("./deepEqualData");
var d3 = require("d3-selection");
var d3_graphviz = require("../");
var stringify = require('json-stringify-safe');

tape("data extraction", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .zoom(false)
        .dot('digraph {a -> b;}');

    delete graphviz._data.parent;

    var actualData = graphviz._data;
    var expectedData = JSON.parse(JSON.stringify(basic_data))

    deepEqualData(test, actualData, expectedData, "Extracted data equals predefined data");

    graphviz.render();
    var svg = d3.select('svg');
    actualData = graphviz._extractData(svg, 0, null);
    var expectedData = JSON.parse(JSON.stringify(basic_data));
    deepEqualData(test, actualData, expectedData, "Explicitly extracted data equals predefined data");

    test.end();
});

var basic_data = {
    "tag": "svg",
    "attributes": {
        "width": "62pt",
        "height": "116pt",
        "viewBox": "0.00 0.00 62.00 116.00",
        "xmlns": "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink"
    },
    "children": [
        {
            "tag": "#text",
            "attributes": {},
            "text": "\n",
            "parent": "[Circular ~]",
            "children": [],
            "key": "#text-0",
            "id": "svg-0.#text-0"
        },
        {
            "tag": "g",
            "attributes": {
                "id": "graph0",
                "class": "graph",
                "transform": "scale(1 1) rotate(0) translate(4 112)"
            },
            "translation": {
                "x": 4,
                "y": 112
            },
            "scale": 1,
            "parent": "[Circular ~]",
            "children": [
                {
                    "tag": "#text",
                    "attributes": {},
                    "text": "\n",
                    "parent": "[Circular ~.children.1]",
                    "children": [],
                    "key": "#text-0",
                    "id": "svg-0.%0.#text-0"
                },
                {
                    "tag": "title",
                    "attributes": {},
                    "parent": "[Circular ~.children.1]",
                    "children": [
                        {
                            "tag": "#text",
                            "attributes": {},
                            "text": "%0",
                            "parent": "[Circular ~.children.1.children.1]",
                            "children": [],
                            "key": "#text-0",
                            "id": "svg-0.%0.title-0.#text-0"
                        }
                    ],
                    "key": "title-0",
                    "id": "svg-0.%0.title-0"
                },
                {
                    "tag": "#text",
                    "attributes": {},
                    "text": "\n",
                    "parent": "[Circular ~.children.1]",
                    "children": [],
                    "key": "#text-1",
                    "id": "svg-0.%0.#text-1"
                },
                {
                    "tag": "polygon",
                    "attributes": {
                        "fill": "#ffffff",
                        "stroke": "transparent",
                        "points": "-4,4 -4,-112 58,-112 58,4 -4,4"
                    },
                    "bbox": {
                        "x": -4,
                        "y": -112,
                        "width": 62,
                        "height": 116
                    },
                    "center": {
                        "x": 27,
                        "y": -54
                    },
                    "parent": "[Circular ~.children.1]",
                    "children": [],
                    "key": "path-0",
                    "id": "svg-0.%0.path-0"
                },
                {
                    "tag": "#text",
                    "attributes": {},
                    "text": "\n",
                    "parent": "[Circular ~.children.1]",
                    "children": [],
                    "key": "#text-2",
                    "id": "svg-0.%0.#text-2"
                },
                {
                    "tag": "#comment",
                    "attributes": {},
                    "comment": " a ",
                    "parent": "[Circular ~.children.1]",
                    "children": [],
                    "key": "#comment-0",
                    "id": "svg-0.%0.#comment-0"
                },
                {
                    "tag": "#text",
                    "attributes": {},
                    "text": "\n",
                    "parent": "[Circular ~.children.1]",
                    "children": [],
                    "key": "#text-3",
                    "id": "svg-0.%0.#text-3"
                },
                {
                    "tag": "g",
                    "attributes": {
                        "id": "node1",
                        "class": "node"
                    },
                    "parent": "[Circular ~.children.1]",
                    "children": [
                        {
                            "tag": "#text",
                            "attributes": {},
                            "text": "\n",
                            "parent": "[Circular ~.children.1.children.7]",
                            "children": [],
                            "key": "#text-0",
                            "id": "svg-0.%0.a.#text-0"
                        },
                        {
                            "tag": "title",
                            "attributes": {},
                            "parent": "[Circular ~.children.1.children.7]",
                            "children": [
                                {
                                    "tag": "#text",
                                    "attributes": {},
                                    "text": "a",
                                    "parent": "[Circular ~.children.1.children.7.children.1]",
                                    "children": [],
                                    "key": "#text-0",
                                    "id": "svg-0.%0.a.title-0.#text-0"
                                }
                            ],
                            "key": "title-0",
                            "id": "svg-0.%0.a.title-0"
                        },
                        {
                            "tag": "#text",
                            "attributes": {},
                            "text": "\n",
                            "parent": "[Circular ~.children.1.children.7]",
                            "children": [],
                            "key": "#text-1",
                            "id": "svg-0.%0.a.#text-1"
                        },
                        {
                            "tag": "ellipse",
                            "attributes": {
                                "fill": "none",
                                "stroke": "#000000",
                                "cx": "27",
                                "cy": "-90",
                                "rx": "27",
                                "ry": "18"
                            },
                            "center": {
                                "x": "27",
                                "y": "-90"
                            },
                            "parent": "[Circular ~.children.1.children.7]",
                            "children": [],
                            "key": "path-0",
                            "id": "svg-0.%0.a.path-0"
                        },
                        {
                            "tag": "#text",
                            "attributes": {},
                            "text": "\n",
                            "parent": "[Circular ~.children.1.children.7]",
                            "children": [],
                            "key": "#text-2",
                            "id": "svg-0.%0.a.#text-2"
                        },
                        {
                            "tag": "text",
                            "attributes": {
                                "text-anchor": "middle",
                                "x": "27",
                                "y": "-85.8",
                                "font-family": "Times,serif",
                                "font-size": "14.00",
                                "fill": "#000000"
                            },
                            "center": {
                                "x": "27",
                                "y": "-85.8",
                            },
                            "parent": "[Circular ~.children.1.children.7]",
                            "children": [
                                {
                                    "tag": "#text",
                                    "attributes": {},
                                    "text": "a",
                                    "parent": "[Circular ~.children.1.children.7.children.5]",
                                    "children": [],
                                    "key": "#text-0",
                                    "id": "svg-0.%0.a.text-0.#text-0"
                                }
                            ],
                            "key": "text-0",
                            "id": "svg-0.%0.a.text-0"
                        },
                        {
                            "tag": "#text",
                            "attributes": {},
                            "text": "\n",
                            "parent": "[Circular ~.children.1.children.7]",
                            "children": [],
                            "key": "#text-3",
                            "id": "svg-0.%0.a.#text-3"
                        }
                    ],
                    "key": "a",
                    "id": "svg-0.%0.a"
                },
                {
                    "tag": "#text",
                    "attributes": {},
                    "text": "\n",
                    "parent": "[Circular ~.children.1]",
                    "children": [],
                    "key": "#text-4",
                    "id": "svg-0.%0.#text-4"
                },
                {
                    "tag": "#comment",
                    "attributes": {},
                    "comment": " b ",
                    "parent": "[Circular ~.children.1]",
                    "children": [],
                    "key": "#comment-1",
                    "id": "svg-0.%0.#comment-1"
                },
                {
                    "tag": "#text",
                    "attributes": {},
                    "text": "\n",
                    "parent": "[Circular ~.children.1]",
                    "children": [],
                    "key": "#text-5",
                    "id": "svg-0.%0.#text-5"
                },
                {
                    "tag": "g",
                    "attributes": {
                        "id": "node2",
                        "class": "node"
                    },
                    "parent": "[Circular ~.children.1]",
                    "children": [
                        {
                            "tag": "#text",
                            "attributes": {},
                            "text": "\n",
                            "parent": "[Circular ~.children.1.children.11]",
                            "children": [],
                            "key": "#text-0",
                            "id": "svg-0.%0.b.#text-0"
                        },
                        {
                            "tag": "title",
                            "attributes": {},
                            "parent": "[Circular ~.children.1.children.11]",
                            "children": [
                                {
                                    "tag": "#text",
                                    "attributes": {},
                                    "text": "b",
                                    "parent": "[Circular ~.children.1.children.11.children.1]",
                                    "children": [],
                                    "key": "#text-0",
                                    "id": "svg-0.%0.b.title-0.#text-0"
                                }
                            ],
                            "key": "title-0",
                            "id": "svg-0.%0.b.title-0"
                        },
                        {
                            "tag": "#text",
                            "attributes": {},
                            "text": "\n",
                            "parent": "[Circular ~.children.1.children.11]",
                            "children": [],
                            "key": "#text-1",
                            "id": "svg-0.%0.b.#text-1"
                        },
                        {
                            "tag": "ellipse",
                            "attributes": {
                                "fill": "none",
                                "stroke": "#000000",
                                "cx": "27",
                                "cy": "-18",
                                "rx": "27",
                                "ry": "18"
                            },
                            "center": {
                                "x": "27",
                                "y": "-18"
                            },
                            "parent": "[Circular ~.children.1.children.11]",
                            "children": [],
                            "key": "path-0",
                            "id": "svg-0.%0.b.path-0"
                        },
                        {
                            "tag": "#text",
                            "attributes": {},
                            "text": "\n",
                            "parent": "[Circular ~.children.1.children.11]",
                            "children": [],
                            "key": "#text-2",
                            "id": "svg-0.%0.b.#text-2"
                        },
                        {
                            "tag": "text",
                            "attributes": {
                                "text-anchor": "middle",
                                "x": "27",
                                "y": "-13.8",
                                "font-family": "Times,serif",
                                "font-size": "14.00",
                                "fill": "#000000"
                            },
                            "center": {
                                "x": "27",
                                "y": "-13.8",
                            },
                            "parent": "[Circular ~.children.1.children.11]",
                            "children": [
                                {
                                    "tag": "#text",
                                    "attributes": {},
                                    "text": "b",
                                    "parent": "[Circular ~.children.1.children.11.children.5]",
                                    "children": [],
                                    "key": "#text-0",
                                    "id": "svg-0.%0.b.text-0.#text-0"
                                }
                            ],
                            "key": "text-0",
                            "id": "svg-0.%0.b.text-0"
                        },
                        {
                            "tag": "#text",
                            "attributes": {},
                            "text": "\n",
                            "parent": "[Circular ~.children.1.children.11]",
                            "children": [],
                            "key": "#text-3",
                            "id": "svg-0.%0.b.#text-3"
                        }
                    ],
                    "key": "b",
                    "id": "svg-0.%0.b"
                },
                {
                    "tag": "#text",
                    "attributes": {},
                    "text": "\n",
                    "parent": "[Circular ~.children.1]",
                    "children": [],
                    "key": "#text-6",
                    "id": "svg-0.%0.#text-6"
                },
                {
                    "tag": "#comment",
                    "attributes": {},
                    "comment": " a&#45;&gt;b ",
                    "parent": "[Circular ~.children.1]",
                    "children": [],
                    "key": "#comment-2",
                    "id": "svg-0.%0.#comment-2"
                },
                {
                    "tag": "#text",
                    "attributes": {},
                    "text": "\n",
                    "parent": "[Circular ~.children.1]",
                    "children": [],
                    "key": "#text-7",
                    "id": "svg-0.%0.#text-7"
                },
                {
                    "tag": "g",
                    "attributes": {
                        "id": "edge1",
                        "class": "edge"
                    },
                    "parent": "[Circular ~.children.1]",
                    "children": [
                        {
                            "tag": "#text",
                            "attributes": {},
                            "text": "\n",
                            "parent": "[Circular ~.children.1.children.15]",
                            "children": [],
                            "key": "#text-0",
                            "id": "svg-0.%0.a->b.#text-0"
                        },
                        {
                            "tag": "title",
                            "attributes": {},
                            "parent": "[Circular ~.children.1.children.15]",
                            "children": [
                                {
                                    "tag": "#text",
                                    "attributes": {},
                                    "text": "a->b",
                                    "parent": "[Circular ~.children.1.children.15.children.1]",
                                    "children": [],
                                    "key": "#text-0",
                                    "id": "svg-0.%0.a->b.title-0.#text-0"
                                }
                            ],
                            "key": "title-0",
                            "id": "svg-0.%0.a->b.title-0"
                        },
                        {
                            "tag": "#text",
                            "attributes": {},
                            "text": "\n",
                            "parent": "[Circular ~.children.1.children.15]",
                            "children": [],
                            "key": "#text-1",
                            "id": "svg-0.%0.a->b.#text-1"
                        },
                        {
                            "tag": "path",
                            "attributes": {
                                "fill": "none",
                                "stroke": "#000000",
                                "d": "M27,-71.8314C27,-64.131 27,-54.9743 27,-46.4166"
                            },
                            "bbox": {
                                "x": 27,
                                "y": -71.8314,
                                "width": 0,
                                "height": 25.4148
                            },
                            "center": {
                                "x": 27,
                                "y": -59.124
                            },
                            "totalLength": 100,
                            "parent": "[Circular ~.children.1.children.15]",
                            "children": [],
                            "key": "path-0",
                            "id": "svg-0.%0.a->b.path-0"
                        },
                        {
                            "tag": "#text",
                            "attributes": {},
                            "text": "\n",
                            "parent": "[Circular ~.children.1.children.15]",
                            "children": [],
                            "key": "#text-2",
                            "id": "svg-0.%0.a->b.#text-2"
                        },
                        {
                            "tag": "polygon",
                            "attributes": {
                                "fill": "#000000",
                                "stroke": "#000000",
                                "points": "30.5001,-46.4132 27,-36.4133 23.5001,-46.4133 30.5001,-46.4132"
                            },
                            "bbox": {
                                "x": 23.5001,
                                "y": -46.4133,
                                "width": 7,
                                "height": 10
                            },
                            "center": {
                                "x": 27.0001,
                                "y": -41.4133
                            },
                            "parent": "[Circular ~.children.1.children.15]",
                            "children": [],
                            "key": "path-1",
                            "id": "svg-0.%0.a->b.path-1",
                            "totalLength": 100
                        },
                        {
                            "tag": "#text",
                            "attributes": {},
                            "text": "\n",
                            "parent": "[Circular ~.children.1.children.15]",
                            "children": [],
                            "key": "#text-3",
                            "id": "svg-0.%0.a->b.#text-3"
                        }
                    ],
                    "key": "a->b",
                    "id": "svg-0.%0.a->b"
                },
                {
                    "tag": "#text",
                    "attributes": {},
                    "text": "\n",
                    "parent": "[Circular ~.children.1]",
                    "children": [],
                    "key": "#text-8",
                    "id": "svg-0.%0.#text-8"
                }
            ],
            "key": "%0",
            "id": "svg-0.%0"
        },
        {
            "tag": "#text",
            "attributes": {},
            "text": "\n",
            "parent": "[Circular ~]",
            "children": [],
            "key": "#text-1",
            "id": "svg-0.#text-1"
        }
    ],
    "key": "svg-0",
    "id": "svg-0"
}
