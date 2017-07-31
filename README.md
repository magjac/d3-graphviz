# d3-graphviz

Renders SVG from graphs described in the [DOT](http://www.graphviz.org/content/dot-language) language using the [Viz.js](https://github.com/mdaines/viz.js/) port of [Graphviz](http://www.graphviz.org) and does animated transitions between graphs.

## Features
* Rendering of SVG graphs from [DOT](http://www.graphviz.org/content/dot-language) source
* Animated transition of one graph into another
* Edge path tweening
* Node shape tweening
* Fade-in and fade-out of entering and exiting nodes and edges

Graphviz methods all return the graphviz renderer instance, allowing the concise application of multiple operations on a given graph renderer instance via method chaining.

To render a graph, select an element, call [*selection*.graphviz](#selection_graphviz), and then render from a [DOT](http://www.graphviz.org/content/dot-language) source string. For example:

```js
d3.select("#graph")
  .graphviz()
    .renderDot('digraph {a -> b}');
```

It is also possible to call [d3.graphviz](#d3_graphviz) with a selection as the argument like so:

```js
d3.graphviz(d3.select("#graph"))
    .renderDot('digraph {a -> b}');
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
* [Customizing Graph Attributes](#customizing-graph-attributes)
* [Large Graphs](#large-graphs)
* [Data Format](#data-format)
* [Credits](#credits)

### Creating a Graphviz Renderer on a selection

<a name="selection_graphviz" href="#selection_graphviz">#</a> <i>selection</i>.<b>graphviz</b>() [<>](https://github.com/magjac/d3-graphviz/blob/master/src/selection/graphviz.js "Source")

Returns a new graphviz renderer instance on the given *selection*.

<a name="d3_graphviz" href="#d3_graphviz">#</a> <b>d3.graphviz</b>(<i>selection</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/graphviz.js "Source")

Returns a new graphviz renderer instance on the given *selection*.

### Rendering

<a name="graphviz_renderDot" href="#graphviz_renderDot">#</a> <i>graphviz</i>.<b>renderDot</b>(<i>dotSrc</i>, [<i>selector</i>]) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/renderDot.js "Source")

Renders an SVG graph from the specified *dotSrc* string and appends it to the selection the grapviz renderer instance was generated on, or if no such selection exists, on the first element that matches the specified *selector* string. If the *selector* is given when the graphviz renderer instance is already attached to a selection, an error is thrown.

It is also possible to do the [Graphviz](http://www.graphviz.org/content/dot-language) layout in a first separate stage and do the actual rendering of the SVG as a second step like so:

```js
d3.select("#graph")
  .graphviz()
    .dot('digraph {a -> b}')
    .render();
```

This enables doing the computational intensive layout stages for multiple graphs before doing the potentially synchronized rendering of all the graphs simultaneously.

<a name="graphviz_dot" href="#graphviz_dot">#</a> <i>graphviz</i>.<b>dot</b>(<i>dotSrc</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/dot.js "Source")

Computes the layout of a graph from the specified *dotSrc* string and saves the data for rendering the SVG with [<i>graphviz</i>.<b>render</b>](#graphviz_render) at a later stage.

<a name="graphviz_render" href="#graphviz_render">#</a> <i>graphviz</i>.<b>render</b>([<i>selector</i>]) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/dot.js "Source")

Renders an SVG graph from data saved by [<i>graphviz</i>.<b>dot</b>](#graphviz_dot) and appends it to the selection the grapviz renderer instance was generated on, or if no such selection exists, on the first element that matches the specified *selector* string. If the *selector* is given when the graphviz renderer instance is already attached to a selection, an error is thrown.

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

If *enable* is true (default), enables path tweening, else disables path tweening.

<a name="graphviz_tweenPrecision" href="#graphviz_tweenPrecision">#</a> <i>graphviz</i>.<b>tweenPrecision</b>(<i>precision</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/tweenPrecision.js "Source")

Sets the precision used during path tweening to *precision* pixels. Default is 1.

### Controlling Shape Tweening

<a name="graphviz_tweenShapes" href="#graphviz_tweenShapes">#</a> <i>graphviz</i>.<b>tweenShapes</b>(<i>enable</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/tweenShapes.js "Source")

If *enable* is true (default), enables shape tweening during transitions, else disables shape tweening. If *enable* is true, also enables path tweening since shape tweening currently is performed by converting SVG ellipses and polygons to SVG paths and do path tweening on them. At the end of the transition the original SVG shape element is restored.

### Maintaining [Object Constancy](https://bost.ocks.org/mike/constancy/)

In order to acheive [meaningful transitions](https://bost.ocks.org/mike/constancy/#when-constancy-matter), the D3 default join-by-index [key function](https://bost.ocks.org/mike/constancy/#key-functions) is not sufficient. Four different key modes are available that may be useful in different situations:

* <b>title</b> (default) - Uses the text of the SVG title element for each node and edge <b>g</b> element as generated by [Graphviz](http://www.graphviz.org). For nodes, this is "[<i>node_id</i>](http://www.graphviz.org/content/dot-language)" (not to be confused with the node attribute [<i>id</i>](http://www.graphviz.org/content/attrs#did)) and for edges it is "[<i>node_id</i>](http://www.graphviz.org/content/dot-language) [<i>edgeop</i>](http://www.graphviz.org/content/dot-language) [<i>node_id</i>](http://www.graphviz.org/content/dot-language)", e.g. "a -> b". For node and edge sub-elements, the <b>tag-index</b> key mode is used, see below.
* <b>id</b> - Uses the <b>id</b> attribute of the node and edge SVG <b>g</b> elements as generated by [Graphviz](http://www.graphviz.org). Note that unless the graph author specifies [<i>id</i>](http://www.graphviz.org/content/attrs#did) attributes for nodes and edges, [Graphviz](http://www.graphviz.org) generates a unique internal id that is unpredictable by the graph writer, making the <b>id</b> key mode not very useful. For node and edge sub-elements, the <b>tag-index</b> key mode is used, see below.
* <b>tag-index</b> - Uses a key composed of the [SVG element](https://www.w3.org/TR/SVG/eltindex.html) tag, followed by a dash (-) and the relative index of that element within that all sibling elements with the same tag. For example: ellipse-0. Normally not very useful for other than static graphs, since all nodes and edges are siblings and are generated as SVG <b>g</b> elements.
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

### Large Graphs

For very large graphs it might be necessary to increase the amount of memory available to [Viz.js](https://github.com/mdaines/viz.js/).

<a name="graphviz_totalMemory" href="#graphviz_totalMemory">#</a> <i>graphviz</i>.<b>totalMemory</b>(<i>size</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/totalMemory.js "Source")

Sets the total memory available to [Viz.js](https://github.com/mdaines/viz.js/) to *size* bytes, which should be a power of 2. See the [Viz.js API](https://github.com/mdaines/viz.js#vizsrc-options-formatsvg-enginedot-scale-images-path-width-height--totalmemory16777216-) for details.

### Data Format

The data bound to each DOM node is an object containing the following fields:
 * <b>tag</b> - The DOM node tag.
 * <b>attributes</b> - An object containing attributes as properties.
 * <b>children</b> - An array of data for the node's children.
 * <b>key</b> - The key used when binding data to nodes with the [key function](https://github.com/d3/d3-selection#joining-data). See [<i>graphviz</i>.<b>keyMode</b>](#graphviz_keyMode) for more.
 * <b>text</b> - Contains the text if the DOM node is a [Text node](https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-1312295772). A text node has the tag "<b>#text</b>", not to be confused with the tag "<b>text</b>", which is an [SVG <b>'text</b>' element](https://www.w3.org/TR/SVG/text.html#TextElement).
 * <b>comment</b> - Contains the comment if the DOM element is a [Comment node](https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-1728279322). A comment node has the tag "<b>#comment</b>".
 * <b>translation</b> - An object containing the x and y translation coordinates as properties if the element contains a [<b>transform</b>](https://www.w3.org/TR/SVG/coords.html#TransformAttribute) attribute which is not the identity transform.

To inspect data:

```js
d3.select("#graph").graphviz()
    .renderDot('digraph  {a -> b}');
console.log(JSON.stringify(d3.select("svg").datum(), null, 4));
 ```

### Credits

* [Mike Daines](https://github.com/mdaines) for [Viz.js](https://github.com/mdaines/viz.js/).
* [Mike Bostock](https://github.com/mbostock) for the [Path Tween](https://bl.ocks.org/mbostock/3916621) code.
* [Marcin Stefaniuk](https://github.com/mstefaniuk)  for inspiration and learning through [graph-viz-d3-js](https://github.com/mstefaniuk/graph-viz-d3-js).
