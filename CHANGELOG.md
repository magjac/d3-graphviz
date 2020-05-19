# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.1.0]

### Added
* New option *useSharedWorker* that enables the use of a [shared web worker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker). The default is still to use a [dedicated web worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker).
* New method [*graphviz*.**destroy**()](README.md#graphviz_destroy) to remove the Graphviz render from the element it was created on and release any resources it is holding.

### Fixed
* Styles added with the attributer are removed after transition #159
* Logging events with logEvents() throws "Error: unknown type: function" in certain contexts #160

## [3.0.6]

### Changed
* Upgraded [Graphviz](https://gitlab.com/graphviz/graphviz) to version [2.44.0](https://gitlab.com/graphviz/graphviz/-/releases/2.44.0) through [@hpcc-js/wasm](https://github.com/hpcc-systems/hpcc-js-wasm) version [0.3.13](https://github.com/hpcc-systems/hpcc-js-wasm/releases/tag/v0.3.13).

### Fixed
* resetZoom() does not work after rendering the second graph if transition is not used #151
* The production build contains code instrumented for code coverage #156
* "uncaught exception: r.charAt is not a function" with @hpcc-js/wasm version 0.3.12 and later #154

## [3.0.5]

### Changed
* Upgraded [Graphviz](https://gitlab.com/graphviz/graphviz) to version [2.42.4](https://gitlab.com/graphviz/graphviz/-/releases/2.42.4) through [@hpcc-js/wasm](https://github.com/hpcc-systems/hpcc-js-wasm) version [0.3.11](https://github.com/hpcc-systems/hpcc-js-wasm/releases/tag/v0.3.11), including fixes for:
  * svg output displays TITLE of %3 if graph had no name ([Graphviz issue #1376](https://gitlab.com/graphviz/graphviz/issues/1376))
  * SVG error for "g.transform.scale " in graphviz version 2.43 ([Graphviz issue #1605](https://gitlab.com/graphviz/graphviz/issues/1605))
  * XML errors in generated SVG when URL attribute contains ampersand (&) ([Graphviz issue #1687](https://gitlab.com/graphviz/graphviz/issues/1687))

## [3.0.4]

### Fixed
* TypeError: this.layoutSync is not a function when drawing node or edge and a worker is used and @hpcc-js/wasm is bundled in v3.x #142

## [3.0.3]

### Fixed
* TypeError: this.layoutSync is not a function when drawing node or edge and a worker is used in v3.x. #139

## [3.0.2]

### Fixed
* Error when tween shapes but not fade. #136

## [3.0.1]

### Fixed
*  Graph with an edge with style=tapered does not render when growing edges are enabled. #119

## [3.0.0]

**Note:** This release contains breaking changes compared to version 2.6.1.

### Changed
* Replaced [Viz.js](https://github.com/mdaines/viz.js/) with [@hpcc-js/wasm](https://github.com/hpcc-systems/hpcc-js-wasm).
* The `<script>` tag must be changed to load [@hpcc-js/wasm](https://unpkg.com/@hpcc-js/wasm/dist/index.min.js). See the [README](README.md#defining-the-hpcc-jswasm-script-tag).
* Upgraded Graphviz to version 2.42.2.
  * Be aware of https://gitlab.com/graphviz/graphviz/issues/1605 though.
* If the use of a web worker is disabled there is a slight change of behavior; the initialization of the Graphviz renderer is now *always* asynchronous, not just when using a web worker. This means that the rendered graph will not be available directly after e.g. `d3.select("#graph").graphviz().renderDot('digraph {a -> b}');`. Synchronous rendering when not using a web worker is however still possible once initialization is completed. Use [<b>.on</b>("initEnd", <i>listener</i>)](README.md#graphviz_on) for that.

### Fixed
* The old "initEnd" event handler is called when re-creating a graphviz renderer instance. #123
* The "initEnd" event handler is never called if .dot or .renderDot is chained directly after creation. #124

## 2.x & 1.x
See the [release notes](https://github.com/magjac/d3-graphviz/releases).

[Unreleased]: https://github.com/magjac/d3-graphviz/compare/v3.1.0...HEAD
[3.1.0]: https://github.com/magjac/d3-graphviz/compare/v3.0.6...v3.1.0
[3.0.6]: https://github.com/magjac/d3-graphviz/compare/v3.0.5...v3.0.6
[3.0.5]: https://github.com/magjac/d3-graphviz/compare/v3.0.4...v3.0.5
[3.0.4]: https://github.com/magjac/d3-graphviz/compare/v3.0.3...v3.0.4
[3.0.3]: https://github.com/magjac/d3-graphviz/compare/v3.0.2...v3.0.3
[3.0.2]: https://github.com/magjac/d3-graphviz/compare/v3.0.1...v3.0.2
[3.0.1]: https://github.com/magjac/d3-graphviz/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/magjac/d3-graphviz/compare/v2.6.1...v3.0.0
