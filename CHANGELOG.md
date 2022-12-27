# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [5.0.2] – 2022-12-27

### Fixed
*  Failed to resolve entry for package "d3-graphviz" #263

## [5.0.1] – 2022-12-27

### Fixed
*  Failed to resolve entry for package "d3-graphviz" (partial fix) #263

## [5.0.0] – 2022-12-26

**Note:** This release contains breaking changes compared to version 4.5.0.

### Changed

* Like [D3
v7](https://github.com/d3/d3/blob/main/CHANGES.md#changes-in-d3-70),
d3-graphviz now ships as a pure ES module and requires Node.js 14 or
higher. This is a **breaking change**. For more, please read [Sindre
Sorhus’s
FAQ](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). For
background and details, see [this D3
issue](https://github.com/d3/d3/issues/3469).
* Upgrade to [D3 version
  7](https://github.com/d3/d3/blob/main/CHANGES.md#changes-in-d3-70)
  (version 3 of its
  [microlibraries](https://github.com/d3/d3#installing)).
* Upgrade @hpcc-js/wasm to 2.5.0 (Graphviz 7.0.5)

## [4.5.0] – 2022-12-11

### Changed
* Upgrade @hpcc-js/wasm to 1.16.6 (Graphviz 7.0.1)

## [4.4.0] – 2022-09-12

### Changed
* Upgrade @hpcc-js/wasm to 1.16.1 (Graphviz 6.0.1)

## [4.3.0] – 2022-09-10

### Changed
* Upgrade @hpcc-js/wasm to 1.15.7 (Graphviz unchanged at 5.0.1)  (thanks @mrdrogdrog)

## [4.2.0] – 2022-09-06

### Changed
* Upgrade Graphviz to version 5.0.1 through @hpcc-js/wasm version 1.15.4 (thanks @mrdrogdrog)

## [4.1.1] – 2022-04-09

### Fixed
* Cannot read property 'graphvizVersion' of undefined #224

## [4.1.0] – 2022-02-06

### Added
* New `zoom` [event](README.md#graphviz_on), thanks to [Tucker Gordon](https://github.com/tuckergordon).
* New method [*graphviz*.**graphvizVersion**()](README.md#graphviz_graphvizVersion) which returns the [Graphviz](https://graphviz.org) version.

### Changed
* Upgrade Graphviz to version 2.50.0 through @hpcc-js/wasm version 1.12.8

## [4.0.0] – 2021-04-02

**Note:** This release contains breaking changes compared to version 3.2.0.

### Changed

* Upgrade to [D3 version
  6](https://github.com/d3/d3/blob/master/CHANGES.md#changes-in-d3-60). This
  is a **breaking change**. d3-graphviz version 4 *requires* D3
  version 6 (more specifically version 2 of its
  [microlibraries](https://github.com/d3/d3#installing)) and is no
  longer compatible with D3 version 5 or lower (microlibraries version
  1). For more info see the [D3 6.0 migration
  guide](https://observablehq.com/@d3/d3v6-migration-guide)
* Make [d3-selection](https://github.com/d3/d3-selection) a [peer
  dependency](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#peerdependencies)
  since d3-graphviz adds new methods on the d3-selection object.

## [3.2.0] – 2021-03-28

### Changed
* Upgrade Graphviz to version 2.47.0 through @hpcc-js/wasm version 1.4.1
* Upgrade d3 dependencies to the latest version of d3 version v4 and v5:
 * Upgrade d3-format to version 1.4.5
 * Upgrade d3-zoom to version 1.8.3
 * Upgrade d3-selection to version 1.4.2

### Fixed
* Can't disable zoom once enabled #180

## [3.1.0] – 2020-05-19

### Added
* New option *useSharedWorker* that enables the use of a [shared web worker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker). The default is still to use a [dedicated web worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker).
* New method [*graphviz*.**destroy**()](README.md#graphviz_destroy) to remove the Graphviz render from the element it was created on and release any resources it is holding.

### Fixed
* Styles added with the attributer are removed after transition #159
* Logging events with logEvents() throws "Error: unknown type: function" in certain contexts #160

## [3.0.6] – 2020-05-09

### Changed
* Upgraded [Graphviz](https://gitlab.com/graphviz/graphviz) to version [2.44.0](https://gitlab.com/graphviz/graphviz/-/releases/2.44.0) through [@hpcc-js/wasm](https://github.com/hpcc-systems/hpcc-js-wasm) version [0.3.13](https://github.com/hpcc-systems/hpcc-js-wasm/releases/tag/v0.3.13).

### Fixed
* resetZoom() does not work after rendering the second graph if transition is not used #151
* The production build contains code instrumented for code coverage #156
* "uncaught exception: r.charAt is not a function" with @hpcc-js/wasm version 0.3.12 and later #154

## [3.0.5] – 2020-04-06

### Changed
* Upgraded [Graphviz](https://gitlab.com/graphviz/graphviz) to version [2.42.4](https://gitlab.com/graphviz/graphviz/-/releases/2.42.4) through [@hpcc-js/wasm](https://github.com/hpcc-systems/hpcc-js-wasm) version [0.3.11](https://github.com/hpcc-systems/hpcc-js-wasm/releases/tag/v0.3.11), including fixes for:
  * svg output displays TITLE of %3 if graph had no name ([Graphviz issue #1376](https://gitlab.com/graphviz/graphviz/issues/1376))
  * SVG error for "g.transform.scale " in graphviz version 2.43 ([Graphviz issue #1605](https://gitlab.com/graphviz/graphviz/issues/1605))
  * XML errors in generated SVG when URL attribute contains ampersand (&) ([Graphviz issue #1687](https://gitlab.com/graphviz/graphviz/issues/1687))

## [3.0.4] – 2020-03-14

### Fixed
* TypeError: this.layoutSync is not a function when drawing node or edge and a worker is used and @hpcc-js/wasm is bundled in v3.x #142

## [3.0.3] – 2020-03-11

### Fixed
* TypeError: this.layoutSync is not a function when drawing node or edge and a worker is used in v3.x. #139

## [3.0.2] – 2020-03-10

### Fixed
* Error when tween shapes but not fade. #136

## [3.0.1] – 2020-03-08

### Fixed
*  Graph with an edge with style=tapered does not render when growing edges are enabled. #119

## [3.0.0] – 2020-03-03

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

[Unreleased]: https://github.com/magjac/d3-graphviz/compare/v5.0.2...HEAD
[5.0.2]: https://github.com/magjac/d3-graphviz/compare/v5.0.1...v5.0.2
[5.0.1]: https://github.com/magjac/d3-graphviz/compare/v5.0.0...v5.0.1
[5.0.0]: https://github.com/magjac/d3-graphviz/compare/v4.5.0...v5.0.0
[4.5.0]: https://github.com/magjac/d3-graphviz/compare/v4.4.0...v4.5.0
[4.4.0]: https://github.com/magjac/d3-graphviz/compare/v4.3.0...v4.4.0
[4.3.0]: https://github.com/magjac/d3-graphviz/compare/v4.2.0...v4.3.0
[4.2.0]: https://github.com/magjac/d3-graphviz/compare/v4.1.1...v4.2.0
[4.1.1]: https://github.com/magjac/d3-graphviz/compare/v4.1.0...v4.1.1
[4.1.0]: https://github.com/magjac/d3-graphviz/compare/v4.0.0...v4.1.0
[4.0.0]: https://github.com/magjac/d3-graphviz/compare/v3.2.0...v4.0.0
[3.2.0]: https://github.com/magjac/d3-graphviz/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/magjac/d3-graphviz/compare/v3.0.6...v3.1.0
[3.0.6]: https://github.com/magjac/d3-graphviz/compare/v3.0.5...v3.0.6
[3.0.5]: https://github.com/magjac/d3-graphviz/compare/v3.0.4...v3.0.5
[3.0.4]: https://github.com/magjac/d3-graphviz/compare/v3.0.3...v3.0.4
[3.0.3]: https://github.com/magjac/d3-graphviz/compare/v3.0.2...v3.0.3
[3.0.2]: https://github.com/magjac/d3-graphviz/compare/v3.0.1...v3.0.2
[3.0.1]: https://github.com/magjac/d3-graphviz/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/magjac/d3-graphviz/compare/v2.6.1...v3.0.0
