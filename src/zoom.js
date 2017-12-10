import * as d3 from "d3-selection";
import {zoom, zoomTransform, zoomIdentity} from "d3-zoom";

export default function(enable) {

    this._zoom = enable;

    if (this._zoom && !this._zoomBehavior) {
        createZoomBehavior.call(this);
    }

    return this;
}

export function createZoomBehavior() {

    function zoomed() {
        g.attr('transform', d3.event.transform);
    }

    var root = this._selection;
    var svg = d3.select(root.node().querySelector("svg"));
    if (svg.size() == 0) {
        return this;
    }
    this._zoomSelection = svg;
    var extent = [0.1, 10];
    var zoomBehavior = zoom()
        .scaleExtent(extent)
        .interpolate(d3.interpolate)
        .on("zoom", zoomed);
    this._zoomBehavior = zoomBehavior;
    var g = d3.select(svg.node().querySelector("g"));
    svg.call(zoomBehavior);
    if (!this._active) {
        translateZoomBehaviorTransform.call(this, g);
    }
    this._originalTransform = zoomTransform(svg.node());

    return this;
};

export function getTranslation(g) {
    var transform = g.node().transform;
    if  (transform && transform.baseVal.length != 0) {
        var matrix = transform.baseVal.consolidate().matrix;
        return {x: matrix.e, y: matrix.f};
    } else {
        return {x: 0, y: 0};
    }
}

export function getTranslatedZoomTransform(selection) {

    // Get the current zoom transform for the top level svg and
    // translate it uniformly with the given selection, using the
    // difference between the translation specified in the selection's
    // data and it's saved previous translation. The selection is
    // normally the top level g element of the graph.
    var oldTranslation = this._translation;
    var newTranslation = selection.datum().translation;
    var dx = newTranslation.x - oldTranslation.x;
    var dy = newTranslation.y - oldTranslation.y;
    return zoomTransform(this._zoomSelection.node()).translate(dx, dy);
}

export function translateZoomBehaviorTransform(selection) {

    // Translate the current zoom transform for the top level svg
    // uniformly with the given selection, using the difference
    // between the translation specified in the selection's data and
    // it's saved previous translation. The selection is normally the
    // top level g element of the graph.
    this._zoomBehavior.transform(this._zoomSelection, getTranslatedZoomTransform.call(this, selection));

    // Save the selections's new translation.
    this._translation = selection.datum().translation;

    // Set the original zoom transform to the translation specified in
    // the selection's data.
    this._originalTransform = zoomIdentity.translate(selection.datum().translation.x, selection.datum().translation.y);
}

export function resetZoom(transition) {

    // Reset the zoom transform to the original zoom transform.
    var selection = this._zoomSelection;
    if (transition) {
        selection = selection
            .transition(transition);
    }
    selection
        .call(this._zoomBehavior.transform, this._originalTransform);

    return this;
}
