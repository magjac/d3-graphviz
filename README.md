# d3-graphviz

Renders and does animated transitions of SVG graphs described in the [DOT](http://www.graphviz.org/content/dot-language) language using the [Viz.js](https://github.com/mdaines/viz.js/) port of [Graphviz](http://www.graphviz.org).

## Features
* Rending of SVG graphs from [DOT](http://www.graphviz.org/content/dot-language) strings
* Animated transitions between graphs
* Edge path tweening
* Node shape tweening

To render a graph, select an element, call [*selection*.graphviz](#selection_graphviz), and then render from a [DOT](http://www.graphviz.org/content/dot-language) string. For example:

```js
d3.select("#graph")
  .graphviz()
    .renderDot('digraph {a -> b}');
```

[<img src="images/a-b.png">](http://bl.ocks.org/mbostock/ad70335eeef6d167bc36fd3c04378048)

## Installing

If you use NPM, `npm install d3-graphviz`. Otherwise, download the [latest release](https://github.com/magjac/d3-graphviz/releases/latest).

## API Reference

* [Creating a Graphviz Renderer](#creating-a-graphviz-renderer)
* [Rendering](#renderering)
* [Transitions](#transition)
* [Controlling Path Tweening](#controlling-path-tweening)
* [Controlling Shape Tweening](#controlling-shape-tweening)

<a name="selection_graphviz" href="#selection_graphviz">#</a> <i>selection</i>.<b>graphviz</b>() [<>](https://github.com/magjac/d3-graphviz/blob/master/src/selection/graphviz.js "Source")

Returns a new graphviz renderer instance on the given *selection*.

<a name="graphviz_renderDot" href="#graphviz_renderDot">#</a> <i>graphviz</i>.<b>renderDot</b>(<i>dotSrc</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/renderDot.js "Source")

Renders a graph from the specified *dotSrc* string and appends to the selection. Returns the graph render instance.

<a name="graphviz_transition" href="#graphviz_transition">#</a> <i>graphviz</i>.<b>transition</b>([<i>name</i>]) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/transition.js "Source")

Applies the specified transition *name* to subsequent rendering. Accepts the same arguments as [<i>selection</i>.<b>transition</b>](https://github.com/d3/d3-transition#selection_transition), but returns the graph renderer instance, not the transition. To attach a configured transition, first create a transition intance with [d3.transition](https://github.com/d3/d3-transition#transition), configure it and attach it with [<i>graphviz</i>.<b>transition</b>](#graphviz_transition) like so:

```js
var t = d3.transition()
    .duration(750)
    .ease(d3.easeLinear);

d3.select("#graph").graphviz
    .transition(t)
    .renderDot('digraph {a -> b}');
```

<a name="graphviz_tweenPaths" href="#graphviz_tweenPaths">#</a> <i>graphviz</i>.<b>tweenPaths</b>(<i>enable</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/tweenPaths.js "Source")

If *enable* is true, enables path tweening (default), else disables path tweening. Returns the graph renderer instance.

<a name="graphviz_tweenShapes" href="#graphviz_tweenShapes">#</a> <i>graphviz</i>.<b>tweenShapes</b>(<i>enable</i>) [<>](https://github.com/magjac/d3-graphviz/blob/master/src/tweenShapes.js "Source")

If *enable* is true, enables shape tweening (default), else disables shape tweening. Returns the graph renderer instance.
