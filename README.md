# d3-graphviz

Renders SVG from graphs described in the [DOT](http://www.graphviz.org/content/dot-language) language using the [Viz.js](https://github.com/mdaines/viz.js/) port of [Graphviz](http://www.graphviz.org) and does animated transitions between graphs.

## Features
* Rendering of SVG graphs from [DOT](http://www.graphviz.org/content/dot-language) source
* Animated transition of one graph into another
* Edge path tweening
* Node shape tweening

To render a graph, select an element, call [*selection*.graphviz](#selection_graphviz), and then render from a [DOT](http://www.graphviz.org/content/dot-language) source string. For example:

```js
d3.select("#graph")
  .graphviz()
    .renderDot('digraph {a -> b}');
```

It is also possible to create a graph renderer first and append it to an element afterwards like so:

```js
d3.graphviz()
    .renderDot('digraph {a -> b}', "#graph");
```

[<img src="images/a-b.png">](http://bl.ocks.org/mbostock/ad70335eeef6d167bc36fd3c04378048)

## Installing

If you use NPM, `npm install d3-graphviz`. Otherwise, download the [latest release](https://github.com/magjac/d3-graphviz/releases/latest).

## Principles of operation

Uses [Viz.js](https://github.com/mdaines/viz.js/) to do a layout of a graph specified in the [DOT](http://www.graphviz.org/content/dot-language) language and generate an SVG text representation, which is analyzed and converted into a data representation that is joined with a selected DOM element and used to render the SVG graph on that element and to animate transitioning of one graph into another.

## API Reference

* [Creating a Graphviz Renderer](#creating-a-graphviz-renderer)
* [Rendering](#renderering)
* [Creating Transitions](#creating-transitions)
* [Controlling Path Tweening](#controlling-path-tweening)
* [Controlling Shape Tweening](#controlling-shape-tweening)
* [Maintaining Object Constancy](#maintaining-object-constancy)
* [Credits](#credits)

### Creating a Graphviz Renderer

<a name="selection_graphviz" href="#selection_graphviz">#</a> <i>selection</i>.<b>graphviz</b>() [<>](https://github.com/magjac/d3-graphviz/blob/master/src/selection/graphviz.js "Source")

Returns a new graphviz renderer instance on the given *selection*.

### Rendering

<a name="graphviz_renderDot" href="#graphviz_renderDot">#</a> <i>graphviz</i>.<b>renderDot</b>(<i>dotSrc</i>, [<i>selector</i>]) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/renderDot.js "Source")

Renders an SVG graph from the specified *dotSrc* string and appends it to the selection the grapviz renderer instance was generated on, or if no such selection exists, on the first element that matches the specified *selector* string. If the *selector* is given when the graphviz renderer instance is already attached to a selection, an error is thrown. Returns the graph render instance.

It is also possible to do the [Graphviz](http://www.graphviz.org/content/dot-language) layout in a first separate stage and do the actual rendering of the SVG as a second step like so:

```js
d3.select("#graph")
  .graphviz()
    .dot('digraph {a -> b}')
    .render();
```

This enables doing the computational intensive layout stages for multiple graphs before doing the potentially synchronized rendering of all the graphs simultaneously.

<a name="graphviz_dot" href="#graphviz_dot">#</a> <i>graphviz</i>.<b>dot</b>(<i>dotSrc</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/dot.js "Source")

Computes the layout of a graph from the specified *dotSrc* string and saves the data for rendering the SVG with [<i>graphviz</i>.<b>render</b>](#graphviz_render) at a later stage. Returns the graph render instance.

<a name="graphviz_render" href="#graphviz_render">#</a> <i>graphviz</i>.<b>render</b>([<i>selector</i>]) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/dot.js "Source")

Renders an SVG graph from data saved by [<i>graphviz</i>.<b>dot</b>](#graphviz_dot) and appends it to the selection the grapviz renderer instance was generated on, or if no such selection exists, on the first element that matches the specified *selector* string. If the *selector* is given when the graphviz renderer instance is already attached to a selection, an error is thrown. Returns the graph render instance.

<a name="graphviz_engine" href="#graphviz_engine">#</a> <i>graphviz</i>.<b>engine</b>(<i>engine</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/engine.js "Source")

Set the [Graphviz](http://www.graphviz.org) layout engine name as specified by the *engine* string. The engine name must be set before attaching the [DOT](http://www.graphviz.org/content/dot-language) source. If it is changed after this, an eror is thrown. Returns the graph render instance. Supports all engines that [Viz.js](https://github.com/mdaines/viz.js/) supports. Currently these are:

* <b>circo</b>
* <b>dot</b> (default)
* <b>fdp</b>
* <b>neato</b> (not supported with [viz-lite.js](https://github.com/mdaines/viz.js#lite-version))
* <b>osage</b>
* <b>patchwork</b>
* <b>twopi</b>

<b>sfdp</b> is currently not supported.

### Creating Transitions
<a name="graphviz_transition" href="#graphviz_transition">#</a> <i>graphviz</i>.<b>transition</b>([<i>name</i>]) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/transition.js "Source")

Applies the specified transition *name* to subsequent SVG rendering. Accepts the same arguments as [<i>selection</i>.<b>transition</b>](https://github.com/d3/d3-transition#selection_transition), but returns the graph renderer instance, not the transition. To attach a configured transition, first create a transition intance with [d3.transition](https://github.com/d3/d3-transition#transition), configure it and attach it with [<i>graphviz</i>.<b>transition</b>](#graphviz_transition) like so:

```js
var t = d3.transition()
    .duration(750)
    .ease(d3.easeLinear);

d3.select("#graph").graphviz()
    .transition(t)
    .renderDot('digraph {a -> b}');
```

### Controlling Path Tweening

<a name="graphviz_tweenPaths" href="#graphviz_tweenPaths">#</a> <i>graphviz</i>.<b>tweenPaths</b>(<i>enable</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/tweenPaths.js "Source")

If *enable* is true (default), enables path tweening, else disables path tweening. Returns the graph renderer instance.

<a name="graphviz_tweenPrecision" href="#graphviz_tweenPrecision">#</a> <i>graphviz</i>.<b>tweenPrecision</b>(<i>precision</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/tweenPrecision.js "Source")

Set the precision used during path tweening to *precision* pixels. Default is 1.Returns the graph render instance.

### Controlling Shape Tweening

<a name="graphviz_tweenShapes" href="#graphviz_tweenShapes">#</a> <i>graphviz</i>.<b>tweenShapes</b>(<i>enable</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/tweenShapes.js "Source")

If *enable* is true (default), enables shape tweening during transitions, else disables shape tweening. If *enable* is true, also enables path tweening since shape tweening currently is performed by converting SVG ellipses and polygons to SVG paths and do path tweening on them. At the end of the transition the original SVG shape element is restored.

### Maintaining [Object Constancy](https://bost.ocks.org/mike/constancy/)

In order to acheive [meaningful transitions](https://bost.ocks.org/mike/constancy/#when-constancy-matter), the D3 default join-by-index [key function](https://bost.ocks.org/mike/constancy/#key-functions) is not sufficient. Four different key modes are available that may be useful in different situations:

* <b>title</b> (default) - Uses the text of the SVG title element for each node and edge <b>g</b> element as generated by [Graphviz](http://www.graphviz.org). For nodes, this is "[<i>node_id</i>](http://www.graphviz.org/content/dot-language)" (not to be confused with the node attribute [<i>id</i>](http://www.graphviz.org/content/attrs#did)) and for edges it is "[<i>node_id</i>](http://www.graphviz.org/content/dot-language) [<i>edgeop</i>](http://www.graphviz.org/content/dot-language) [<i>node_id</i>](http://www.graphviz.org/content/dot-language)", e.g. "a -> b". For node and edge sub-elements, the key <b>tag-index</b> key mode is used, see below.
* <b>id</b> - Uses the <b>id</b> attribute of the node and edge SVG <b>g</b> elements as generated by [Graphviz](http://www.graphviz.org). Note that unless the graph author specifies [<i>id</i>](http://www.graphviz.org/content/attrs#did) attributes for nodes and edges, [Graphviz](http://www.graphviz.org) generates a unique internal id that is unpredictable by the graph writer, making the key mode <b>id</b> not very useful. For node and edge sub-elements, the key mode <b>tag-index</b> is used, see below.
* <b>tag-index</b> - Uses a key composed of the [SVG element](https://www.w3.org/TR/SVG/eltindex.html) tag, followed by a dash (-) and the relative index of that element within that all sibling elements with the same tag. For example: ellipse-0. Normally not very useful for other than static graphs, since all nodes and edges are siblings and are generated as SVG <b>g</b> elements.
* <b>index</b> - Uses the D3 default join-by-index key function. Not useful for other than static graphs.

<a name="graphviz_keyMode" href="#graphviz_keyMode">#</a> <i>graphviz</i>.<b>keyMode</b>(<i>mode</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/keyMode.js "Source")

Set the key mode to the specified *mode* string. If *mode* is not one of the defined key modes above, an error is thrown. Returns the graph renderer instance. The key mode must be set before attaching the [DOT](http://www.graphviz.org/content/dot-language) source. If it is changed after this, an eror is thrown.

### Credits

* [Mike Daines](https://github.com/mdaines) for [Viz.js](https://github.com/mdaines/viz.js/).
* [Mike Bostock](https://github.com/mbostock) for the [Path Tween](https://bl.ocks.org/mbostock/3916621) code.
* [Marcin Stefaniuk](https://github.com/mstefaniuk)  for inspiration and learning through [graph-viz-d3-js](https://github.com/mstefaniuk/graph-viz-d3-js).
