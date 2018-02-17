# d3-graphviz

Renders SVG from graphs described in the [DOT](http://www.graphviz.org/content/dot-language) language using the [Viz.js](https://github.com/mdaines/viz.js/) port of [Graphviz](http://www.graphviz.org) and does animated transitions between graphs.

[![Build Status](https://travis-ci.org/magjac/d3-graphviz.svg?branch=master)](https://travis-ci.org/magjac/d3-graphviz)
[![codecov](https://codecov.io/gh/magjac/d3-graphviz/branch/master/graph/badge.svg)](https://codecov.io/gh/magjac/d3-graphviz)

## Features
* Rendering of SVG graphs from [DOT](http://www.graphviz.org/content/dot-language) source
* Animated transition of one graph into another
* Edge path tweening
* Node shape tweening
* Fade-in and fade-out of entering and exiting nodes and edges
* Animated growth of entering edges
* Panning & zooming of the generated graph

Graphviz methods all return the graphviz renderer instance, allowing the concise application of multiple operations on a given graph renderer instance via method chaining.

To render a graph, select an element, call [*selection*.graphviz](#selection_graphviz), and then render from a [DOT](http://www.graphviz.org/content/dot-language) source string. For example:

```js
d3.select("#graph")
  .graphviz()
    .renderDot('digraph {a -> b}');
```

It is also possible to call [d3.graphviz](#d3_graphviz) with a selector as the argument like so:

```js
d3.graphviz("#graph")
    .renderDot('digraph {a -> b}');
```

[<img src="images/a-b.png">](http://bl.ocks.org/magjac/a23d1f1405c2334f288a9cca4c0ef05b)

This basic example can also bee seen [here](http://bl.ocks.org/magjac/a23d1f1405c2334f288a9cca4c0ef05b).

A more colorful demo can be seen [here](http://bl.ocks.org/magjac/4acffdb3afbc4f71b448a210b5060bca).

## Installing

If you use NPM, `npm install d3-graphviz`. Otherwise, download the [latest release](https://github.com/magjac/d3-graphviz/releases/latest).

## Principles of Operation

Uses [Viz.js](https://github.com/mdaines/viz.js/) to do a layout of a graph specified in the [DOT](http://www.graphviz.org/content/dot-language) language and generates an SVG text representation, which is analyzed and converted into a data representation. Then [D3](https://d3js.org/) is used to join this data with a selected DOM element, render the SVG graph on that element and to animate transitioning of one graph into another.

## Contents

* [API Reference](#api-reference)
* [Examples](#examples)
* [Building Applications with d3-graphviz](#building-applications-with-d3-graphviz)
* [Data Format](#data-format)
* [Performance](#performance)
* [Requirements](#requirements)
* [Development](#development)
* [Credits](#credits)

## API Reference

* [Creating a Graphviz Renderer](#creating-a-graphviz-renderer)
* [Rendering](#rendering)
* [Images](#images)
* [Creating Transitions](#creating-transitions)
* [Controlling Fade-In & Fade-Out](#controlling-fade-in--fade-out)
* [Controlling Animated Growth of Entering Edges](#controlling-animated-growth-of-entering-edges)
* [Controlling Path Tweening](#controlling-path-tweening)
* [Controlling Shape Tweening](#controlling-shape-tweening)
* [Maintaining Object Constancy](#maintaining-object-constancy)
* [Customizing Graph Attributes](#customizing-graph-attributes)
* [Accessing Elements of the Generated Graph](#accessing-elements-of-the-generated-graph)
* [Large Graphs](#large-graphs)

### Creating a Graphviz Renderer

#### Creating a Graphviz Renderer on an Existing Selection

<a name="selection_graphviz" href="#selection_graphviz">#</a> <i>selection</i>.<b>graphviz</b>() [<>](https://github.com/magjac/d3-graphviz/blob/master/src/selection/graphviz.js "Source")

Returns a new graphviz renderer instance on the given *selection*.

#### Creating a Graphviz Renderer Using a Selector String or a Node

<a name="d3_graphviz" href="#d3_graphviz">#</a> <b>d3.graphviz</b>(<i>selector</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/graphviz.js "Source")

Creates a new graphviz renderer instance on the first element matching the given *selector* string. If the *selecor* is not a string, instead creates a new graphviz renderer instance on the specified node.

### Rendering

<a name="graphviz_renderDot" href="#graphviz_renderDot">#</a> <i>graphviz</i>.<b>renderDot</b>(<i>dotSrc</i>[, <i>callback</i>]) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/renderDot.js "Source")

Starts rendering of an SVG graph from the specified *dotSrc* string and appends it to the selection the grapviz renderer instance was generated on. [<i>graphviz</i>.<b>renderDot</b>](#graphviz_renderDot) returns "immediately", while the rendering is performed in the backgound. The layout stage is performed by a web worker. If *callback* is specified and not null, it is called with the `this` context as the graphviz instance, when the graphviz renderer has finished all actions.

It is also possible to do the [Graphviz](http://www.graphviz.org/content/dot-language) layout in a first separate stage and do the actual rendering of the SVG as a second step like so:

```js
d3.select("#graph")
  .graphviz()
    .dot('digraph {a -> b}')
    .render();
```

This enables doing the computational intensive layout stages for multiple graphs before doing the potentially synchronized rendering of all the graphs simultaneously.

<a name="graphviz_dot" href="#graphviz_dot">#</a> <i>graphviz</i>.<b>dot</b>(<i>dotSrc</i>[, <i>callback</i>]) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/dot.js "Source")

Starts computation of the layout of a graph from the specified *dotSrc* string and saves the data for rendering the SVG with [<i>graphviz</i>.<b>render</b>](#graphviz_render) at a later stage. [<i>graphviz</i>.<b>dot</b>](#graphviz_dot) returns "immediately", while the layout is performed by a web worker in the backgound. If *callback* is specified and not null, it is called with the `this` context as the graphviz instance, when the layout, data extraction and data processing has been finished.

<a name="graphviz_render" href="#graphviz_render">#</a> <i>graphviz</i>.<b>render</b>([<i>callback</i>]) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/dot.js "Source")

Starts rendering of an SVG graph from data saved by [<i>graphviz</i>.<b>dot</b>](#graphviz_dot) and appends it to the selection the grapviz renderer instance was generated on. [<i>graphviz</i>.<b>render</b>](#graphviz_render) returns "immediately", while the rendering is performed in the backgound. If computation of a layout, started with the [<i>graphviz</i>.<b>dot</b>](#graphviz_dot) method has not yet finsihed, the rendering task is placed in a queue and will commence when the layout is ready. If *callback* is specified and not null, it is called with the `this` context as the graphviz instance, when the graphviz renderer has finished all actions.

<a name="graphviz_engine" href="#graphviz_engine">#</a> <i>graphviz</i>.<b>engine</b>(<i>engine</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/engine.js "Source")

Sets the [Graphviz](http://www.graphviz.org) layout engine name to the specified *engine* string. The engine name must be set before attaching the [DOT](http://www.graphviz.org/content/dot-language) source. If it is changed after this, an eror is thrown. Supports all engines that [Viz.js](https://github.com/mdaines/viz.js/) supports. Currently these are:

* <b>circo</b>
* <b>dot</b> (default)
* <b>fdp</b>
* <b>neato</b> (not supported with [viz-lite.js](https://github.com/mdaines/viz.js#lite-version))
* <b>osage</b>
* <b>patchwork</b>
* <b>twopi</b>

<b>sfdp</b> is currently not supported.

<a name="graphviz_onerror" href="#graphviz_onerror">#</a> <i>graphviz</i>.<b>onerror</b>(<i>callback</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/onerror.js "Source")

If *callback* is specified and not null, it is called with the `this` context as the graphviz instance and the error message as the first argument, if the layout computation encounters an error. If *callback* is null, removes any previously registered callback.

### Images
<a name="graphviz_addImage" href="#graphviz_images">#</a> <i>graphviz</i>.<b>addImage</b>(<i>path</i>,<i>width</i>,<i>height</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/images.js "Source")

Add image references as dictated by viz.js, **must be done before renderDot() or dot()**.  
addImage can be called multiple times.

*path* may be a filename ("example.png"), relative or absolute path ("/images/example.png"), or a URL ("http://example.com/image.png")  
Dimensions(*width*,*height*) may be specified with units: in, px, pc, pt, cm, or mm. If no units are given or dimensions are given as numbers, points (pt) are used.  
  
Graphviz does not actually load image data when this option is used — images are referenced with the dimensions given, eg, in SVG by an \<image> element with width and height attributes.

```js
d3.graphviz("#graph")
    .addImage("images/first.png", "400px", "300px")
    .addImage("images/second.png", "400px", "300px")
    .renderDot('digraph { a[image="images/first.png"]; b[image="images/second.png"]; a -> b }');
```

### Creating Transitions
<a name="graphviz_transition" href="#graphviz_transition">#</a> <i>graphviz</i>.<b>transition</b>([<i>name</i>]) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/transition.js "Source")

Applies the specified transition *name* to subsequent SVG rendering. Accepts the same arguments as [<i>selection</i>.<b>transition</b>](https://github.com/d3/d3-transition#selection_transition) or a function, but returns the graph renderer instance, not the transition. If *name* is a function, it is taken to be a transition factory. A transition factory is a function that returns a transition; when the rendering starts, the factory is evaluated once, with the `this` context as the graphviz instance. To attach a preconfigured transition, first create a transition intance with [d3.transition](https://github.com/d3/d3-transition#transition), configure it and attach it with [<i>graphviz</i>.<b>transition</b>](#graphviz_transition) like so:

```js
var t = d3.transition()
    .duration(750)
    .ease(d3.easeLinear);

d3.select("#graph").graphviz()
    .transition(t)
    .renderDot('digraph {a -> b}');
```

A transition is scheduled when it is created. The above example will schedule the transition *before* the layout is computed, i.e. synchronously. But if, instead, a transition factory is used, the transition will be scheduled *after* the layout is computed, i.e. asynchronously.

<b>NOTE:</b> Transitions should be named if zooming is enabled. Transitions using the null name [will be interrupted](https://github.com/d3/d3-zoom/issues/110) by the [zoom behavior](https://github.com/d3/d3-zoom), causing the graph to be rendered incorrectly.

<a name="graphviz_active" href="#graphviz_active">#</a> <i>graphviz</i>.<b>active</b>([<i>name</i>]) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/transition.js "Source")

Returns the active transition on the generated graph's top level <b>svg</b> with the specified *name*, if any. If no *name* is specified, null is used. Returns null if there is no such active transition on the top level <b>svg</b> node. This method is useful for creating chained transitions.

### Control Flow

For advanced usage, the grahviz renderer provides methods for custom control flow.

<a name="graphviz_on" href="#graphviz_on">#</a> <i>graphviz</i>.<b>on</b>(<i>typenames</i>[, <i>listener</i>]) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/on.js "Source")

Adds or removes a *listener* to the graphviz renderer instance for the specified event *typenames*. The *typenames* is one of the following string event types:

* `initEnd` - when the graphviz renderer has finished initialization.
* `start` - when analysis of the DOT source starts.
* `layoutStart` - when the layout of the DOT source starts.
* `layoutEnd` - when the layout of the DOT source ends.
* `dataExtractEnd` - when the extraction of data from the SVG text representation ends.
* `dataProcessPass1End` - when the first pass of the processing of the extracted data ends.
* `dataProcessPass2End` - when the second pass of the processing of the extracted data ends.
* `dataProcessEnd` - when the processing of the extracted data ends.
* `renderStart` - when the rendering preparation starts, which is just before an eventual transition factory is called.
* `renderEnd` - when the rendering preparation ends.
* `transitionStart` - when the anmiated transition starts.
* `transitionEnd` - when the anmiated transition ends.
* `restoreEnd` - when possibly converted paths and shapes have been restored after the transition.
* `end` - when the graphviz renderer has finished all actions.

Note that these are *not* native DOM events as implemented by [*selection*.on](https://github.com/d3/d3-selection#selection_on) and [*selection*.dispatch](https://github.com/d3/d3-selection#selection_dispatch), but graphviz events!

The type may be optionally followed by a period (`.`) and a name; the optional name allows multiple callbacks to be registered to receive events of the same type, such as `start.foo` and `start.bar`. To specify multiple typenames, separate typenames with spaces, such as `interrupt end` or `start.foo start.bar`.

When a specified graphviz event is dispatched, the specified *listener* will be invoked with the `this` context as the graphviz instance.

If an event listener was previously registered for the same *typename* on a selected element, the old listener is removed before the new listener is added. To remove a listener, pass null as the *listener*. To remove all listeners for a given name, pass null as the *listener* and `.foo` as the *typename*, where `foo` is the name; to remove all listeners with no name, specify `.` as the *typename*.

<a name="graphviz_logEvents" href="#graphviz_logEvents">#</a> <i>graphviz</i>.<b>logEvents</b>(<i>enable</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/logEvents.js "Source")

If *enable* is true (default), adds event listeners, uing the name "log", for all available events. When invoked, each listener will print a one-line summary containing the event number and type, the time since the previous event and the time since the "start" event to the console log. For some events, additionally calculated times are printed. This method can be used for debugging or for tuning transition delay and duration. If *enable* is false, removes all event listeners named "log".

### Controlling Fade-In & Fade-Out

<a name="graphviz_fade" href="#graphviz_fade">#</a> <i>graphviz</i>.<b>fade</b>(<i>enable</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/fade.js "Source")

If *enable* is true (default), enables fade-in and fade-out of nodes and shapes, else disables fade-in and fade-out.

### Controlling Animated Growth of Entering Edges

<a name="graphviz_growEnteringEdges" href="#graphviz_growEnteringEdges">#</a> <i>graphviz</i>.<b>growEnteringEdges</b>(<i>enable</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/growEnteringEdges.js "Source")

If *enable* is true (default), enables animated growth of entering edges, else disables animated growth of entering edges.

A demo of animated growth of entering edges can be seen [here](http://bl.ocks.org/magjac/f485e7b915c9699aa181a11e183f8237)

### Controlling Path Tweening

<a name="graphviz_tweenPaths" href="#graphviz_tweenPaths">#</a> <i>graphviz</i>.<b>tweenPaths</b>(<i>enable</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/tweenPaths.js "Source")

If *enable* is true (default), enables path tweening, else disables path tweening.

<a name="graphviz_tweenPrecision" href="#graphviz_tweenPrecision">#</a> <i>graphviz</i>.<b>tweenPrecision</b>(<i>precision</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/tweenPrecision.js "Source")

Sets the precision used during path tweening to *precision* pixels. Default is 1.

### Controlling Shape Tweening

<a name="graphviz_tweenShapes" href="#graphviz_tweenShapes">#</a> <i>graphviz</i>.<b>tweenShapes</b>(<i>enable</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/tweenShapes.js "Source")

If *enable* is true (default), enables shape tweening during transitions, else disables shape tweening. If *enable* is true, also enables path tweening since shape tweening currently is performed by converting SVG ellipses and polygons to SVG paths and do path tweening on them. At the end of the transition the original SVG shape element is restored.

<a name="graphviz_convertEqualSidedPolygons" href="#graphviz_convertEqualSidedPolygons">#</a> <i>graphviz</i>.<b>convertEqualSidedPolygons</b>(<i>enable</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/convertEqualSidedPolygons.js "Source")

If *enable* is true (default), enables conversion of polygons with equal number of sides during shape tweening, else disables conversion. Not applicable when shape tweening is disabled. At the end of the transition the original SVG shape element is restored.

A demo of shape tweening can be seen [here](http://bl.ocks.org/magjac/69dc955a2e2ee085f60369c4a73f92a6).

### Controlling Panning & Zooming

<a name="graphviz_zoom" href="#graphviz_zoom">#</a> <i>graphviz</i>.<b>zoom</b>(<i>enable</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/zoom.js "Source")

If *enable* is true (default), enables panning and zooming, else disables panning and zooming. The zoom behavior is applied to the graph's top level <b>svg</b> element.

<a name="graphviz_resetZoom" href="#graphviz_resetZoom">#</a> <i>graphviz</i>.<b>resetZoom</b>([<i>transition</i>]) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/zoom.js "Source")

Restores the original graph by resetting the transformation made by panning and zooming. If *transition* is specified and not null, it is taken to be a transition instance which is applied during zoom reset.

### Maintaining [Object Constancy](https://bost.ocks.org/mike/constancy/)

In order to acheive [meaningful transitions](https://bost.ocks.org/mike/constancy/#when-constancy-matter), the D3 default join-by-index [key function](https://bost.ocks.org/mike/constancy/#key-functions) is not sufficient. Four different key modes are available that may be useful in different situations:

* <b>title</b> (default) - Uses the text of the SVG title element for each node and edge <b>g</b> element as generated by [Graphviz](http://www.graphviz.org). For nodes, this is "[<i>node_id</i>](http://www.graphviz.org/content/dot-language)" (not to be confused with the node attribute [<i>id</i>](http://www.graphviz.org/content/attrs#did)) and for edges it is "[<i>node_id</i>](http://www.graphviz.org/content/dot-language) [<i>edgeop</i>](http://www.graphviz.org/content/dot-language) [<i>node_id</i>](http://www.graphviz.org/content/dot-language)", e.g. "a -> b". For node and edge sub-elements, the <b>tag-index</b> key mode is used, see below.
* <b>id</b> - Uses the <b>id</b> attribute of the node and edge SVG <b>g</b> elements as generated by [Graphviz](http://www.graphviz.org). Note that unless the graph author specifies [<i>id</i>](http://www.graphviz.org/content/attrs#did) attributes for nodes and edges, [Graphviz](http://www.graphviz.org) generates a unique internal id that is unpredictable by the graph writer, making the <b>id</b> key mode not very useful. For node and edge sub-elements, the <b>tag-index</b> key mode is used, see below.
* <b>tag-index</b> - Uses a key composed of the [SVG element](https://www.w3.org/TR/SVG/eltindex.html) tag, followed by a dash (-) and the relative index of that element within all sibling elements with the same tag. For example: ellipse-0. Normally not very useful for other than static graphs, since all nodes and edges are siblings and are generated as SVG <b>g</b> elements.
* <b>index</b> - Uses the D3 default join-by-index key function. Not useful for other than static graphs.

<a name="graphviz_keyMode" href="#graphviz_keyMode">#</a> <i>graphviz</i>.<b>keyMode</b>(<i>mode</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/keyMode.js "Source")

Sets the key mode to the specified *mode* string. If *mode* is not one of the defined key modes above, an error is thrown. The key mode must be set before attaching the [DOT](http://www.graphviz.org/content/dot-language) source. If it is changed after this, an eror is thrown.

### Customizing Graph Attributes

<a name="graphviz_attributer" href="#graphviz_attributer">#</a> <i>graphviz</i>.<b>attributer</b>(<i>function</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/attributer.js "Source")

If the *function* is a function, it is evaluated for each SVG element, before applying attributes and transitions, being passed the current datum (*d*), the current index (*i*), and the current group (*nodes*), with *this* as the current DOM element (*nodes*[*i*]). If *function* is null, removes the attributer. For example, to set the fill color of ellipses to yellow and fade to red during transition:


```js
var t = d3.transition()
    .duration(2000)
    .ease(d3.easeLinear);

d3.select("#graph").graphviz()
    .transition(t)
    .attributer(function(d) {
        if (d.tag == "ellipse") {
            d3.select(this)
                .attr("fill", "yellow");
            d.attributes.fill = "red";
        }
    })
    .renderDot('digraph {a -> b}');
```

### Accessing Elements of the Generated Graph

<a name="selection_selectWithoutDataPropagation" href="#selection_selectWithoutDataPropagation">#</a> <i>selection</i>.<b>selectWithoutDataPropagation</b>() [<>](https://github.com/magjac/d3-graphviz/blob/master/src/selection/selectWithoutDataPropagation.js "Source")

For each selected element, selects the first descendant element that matches the specified selector string in the same ways as  [*selection*.select](https://github.com/d3/d3-selection#selection_select), but does *not* propagate any associated data from the current element to the corresponding selected element.

### Large Graphs

For very large graphs it might be necessary to increase the amount of memory available to [Viz.js](https://github.com/mdaines/viz.js/).

<a name="graphviz_totalMemory" href="#graphviz_totalMemory">#</a> <i>graphviz</i>.<b>totalMemory</b>(<i>size</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/totalMemory.js "Source")

Sets the total memory available to [Viz.js](https://github.com/mdaines/viz.js/) to *size* bytes, which should be a power of 2. See the [Viz.js API](https://github.com/mdaines/viz.js#vizsrc-options-formatsvg-enginedot-scale-images-path-width-height--totalmemory16777216-) for details.

## Examples

* [Basic Example](http://bl.ocks.org/magjac/a23d1f1405c2334f288a9cca4c0ef05b)
* [Demo](http://bl.ocks.org/magjac/4acffdb3afbc4f71b448a210b5060bca)
* [Shape Tweening Demo](http://bl.ocks.org/magjac/69dc955a2e2ee085f60369c4a73f92a6)
* [Delete Nodes and Edge Demo Application](https://bl.ocks.org/magjac/28a70231e2c9dddb84b3b20f450a215f)

## Building Applications with [d3-graphviz](https://github.com/magjac/d3-graphviz)
### SVG structure
The generated SVG graph has *exactly* the same structure as the SVG generated by [Viz.js](https://github.com/mdaines/viz.js), so applications utilizing knowledge about this structure should be able to use [d3-graphviz](https://github.com/magjac/d3-graphviz) without adaptations. If [path tweening](#controlling-path-tweening) or [shape tweening](#controlling-path-tweening) is used, some SVG elements may be converted during transitions, but they are restored to the original shape after the transition.

See this [example application](https://bl.ocks.org/magjac/28a70231e2c9dddb84b3b20f450a215f).

### <b>NOTE:</b> avoid [*selection*.select](https://github.com/d3/d3-selection#selection_select)
When selecting elements within the graph, [*selection*.select](https://github.com/d3/d3-selection#selection_select) *must not be used* if additional rendering is going to be performed on the same graph renderer instance. This is due to the fact that [*selection*.select](https://github.com/d3/d3-selection#selection_select) propagates data from the elements in the selection to the corresponding selected elements, causing already bound data to be overwritten with incorrect data and subsequent errors. Use the [<i>selection</i>.<b>selectWithoutDataPropagation</b>()](#selection_selectWithoutDataPropagation) (a [d3-graphviz](https://github.com/magjac/d3-graphviz) extension of [d3-selection](https://github.com/d3/d3-selection)) or [*selection*.selectAll](https://github.com/d3/d3-selection#selection_selectAll), which do not propagate data or [*selection*.node](https://github.com/d3/d3-selection#selection_node) and [querySelector](https://www.w3.org/TR/selectors-api/#queryselector). For example, to select the first <b>g</b> element within the first <b>svg</b> element within a specified <b>div</b> element:


```js
var div = d3.select("#graph");
var svg = d3.select(div.node().querySelector("svg"));
var g = d3.select(svg.node().querySelector("g"));
 ```

For more, read [this issue](https://github.com/d3/d3/issues/1443) and [this Stack Overflow post](https://stackoverflow.com/questions/17846806/preventing-unwanted-data-inheritance-with-selection-select).

## Data Format

The data bound to each DOM node is an object containing the following fields:
 * <b>tag</b> - The DOM node tag.
 * <b>attributes</b> - An object containing attributes as properties.
 * <b>children</b> - An array of data for the node's children.
 * <b>key</b> - The key used when binding data to nodes with the [key function](https://github.com/d3/d3-selection#joining-data). See [<i>graphviz</i>.<b>keyMode</b>](#graphviz_keyMode) for more.
 * <b>text</b> - Contains the text if the DOM node is a [Text node](https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-1312295772). A text node has the tag "<b>#text</b>", not to be confused with the tag "<b>text</b>", which is an [SVG <b>'text</b>' element](https://www.w3.org/TR/SVG/text.html#TextElement).
 * <b>comment</b> - Contains the comment if the DOM node is a [Comment node](https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-1728279322). A comment node has the tag "<b>#comment</b>".

Other fields are used internally, but may be subject to change between releases and should not by used an external application.

To inspect data:

```js
d3.select("#graph").graphviz()
    .renderDot('digraph  {a -> b}');
console.log(JSON.stringify(d3.select("svg").datum(), null, 4));
 ```

## Performance

The shape- and path-tweening operations are quite computational intensive and can be disabled with [<i>graphviz</i>.<b>tweenShapes</b>](#graphviz_tweenShapes) and [<i>graphviz</i>.<b>tweenPaths</b>](#graphviz_tweenPaths) to improve performance if they are not needed. Even if enabled, performance gains can be made by turning off conversion of equally sided polygons with [<i>graphviz</i>.<b>convertEqualSidedPolygons</b>](#graphviz_convertEqualSidedPolygons) or by reducing tween precision by setting a larger value with [<i>graphviz</i>.<b>tweenPrecision</b>](#graphviz_tweenPrecision).

In order for animated transitions to be smooth, special considerations has been made to do the computational intensive operations before transitions start. Use [*transition*.delay](#transition_delay) to reserve time for those computations.

Since the author is new to both Javascipt and D3, there are probably a lot of things that can be improved. Suggestions are welcome.

## Requirements

[d3-graphviz](https://github.com/magjac/d3-graphviz) uses a few [ES6](http://es6-features.org) language features, so it must be used with a modern browser.

## Development

In order to run the tests you need [Node.js](https://nodejs.org/en/download/package-manager/) 6.x or later.

## Credits

* [Mike Daines](https://github.com/mdaines) for [Viz.js](https://github.com/mdaines/viz.js/).
* [Mike Bostock](https://github.com/mbostock) for the [Path Tween](https://bl.ocks.org/mbostock/3916621) code and [Stroke Dash Interpolation](https://bl.ocks.org/mbostock/5649592) code.
* [Aaron Bycoffe](https://bl.ocks.org/bycoffe) for the [Element rotation with point-along-path interpolation](http://bl.ocks.org/bycoffe/c3849a0b15234d7e32fc) code.
* [Marcin Stefaniuk](https://github.com/mstefaniuk) for inspiration and learning through [graph-viz-d3-js](https://github.com/mstefaniuk/graph-viz-d3-js).
* [Ueyama Satoshi](https://github.com/gyuque) for inspiring growing edges through [livizjs](http://ushiroad.com/jsviz/).
