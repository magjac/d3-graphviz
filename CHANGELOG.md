# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
* Graphviz upgraded version 2.42.2.
  * Be aware of https://gitlab.com/graphviz/graphviz/issues/1605 though.
* If the use of a web worker is disabled there is a slight change of behavior; the initialization of the Graphviz renderer is now *always* asynchronous, not just when using a web worker. This means that the rendered graph will not be available directly after e.g. `d3.select("#graph").graphviz().renderDot('digraph {a -> b}');`. Synchronous rendering when not using a web worker is however still possible once initialization is completed. Use [<b>.on</b>("initEnd", <i>listener</i>)](README.md#graphviz_on) for that.

### Fixed
* The old "initEnd" event handler is called when re-creating a graphviz renderer instance. #123
* The "initEnd" event handler is never called if .dot or .renderDot is chained directly after creation. #124

## 2.x & 1.x
See the [release notes](https://github.com/magjac/d3-graphviz/releases).

[Unreleased]: https://github.com/magjac/d3-graphviz/compare/v3.0.4...HEAD
[3.0.4]: https://github.com/magjac/d3-graphviz/compare/v3.0.3...v3.0.4
[3.0.3]: https://github.com/magjac/d3-graphviz/compare/v3.0.2...v3.0.3
[3.0.2]: https://github.com/magjac/d3-graphviz/compare/v3.0.1...v3.0.2
[3.0.1]: https://github.com/magjac/d3-graphviz/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/magjac/d3-graphviz/compare/v2.6.1...v3.0.0
