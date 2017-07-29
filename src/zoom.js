import * as d3 from "d3-selection";
import {zoom, zoomTransform} from "d3-zoom";

export default function(enable) {

    var root = this._selection;

    function zoomed() {
        g.attr('transform', d3.event.transform);
    }

    function getTranslation(g) {
        var transform = g.node().transform;
        if  (transform && transform.baseVal.length != 0) {
            var matrix = transform.baseVal.consolidate().matrix;
            return {x: matrix.e, y: matrix.f};
        } else {
            return {x: 0, y: 0};
        }
    }
    var extent = [0.1, 10];
    var zoomBehavior = zoom()
        .scaleExtent(extent)
        .on("zoom", zoomed);
    var svg = d3.select(root.node().querySelector("svg"));
    var g = d3.select(svg.node().querySelector("g"));
    svg.call(zoomBehavior);
    var oldTranslation = this._translation;
    var newTranslation = getTranslation(g);
    this._translation = newTranslation;
    var diffTranslation = newTranslation;
    diffTranslation.x -= oldTranslation.x;
    diffTranslation.y -= oldTranslation.y;
    zoomBehavior.translateBy(svg, diffTranslation.x, diffTranslation.y);

    return this;
};
