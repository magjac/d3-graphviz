import * as d3 from "d3-selection";
import {zoom, zoomTransform, zoomIdentity} from "d3-zoom";
import {interpolate} from "d3-interpolate";

export default function(enable) {

    this._options.zoom = enable;

    if (this._options.zoom && !this._zoomBehavior) {
        createZoomBehavior.call(this);
    } else if (!this._options.zoom && this._zoomBehavior) {
        this._zoomSelection.on(".zoom", null);
        this._zoomBehavior = null;
    }

    return this;
}

export function createZoomBehavior() {

    function zoomed(event) {
        var g = d3.select(svg.node().querySelector("g"));
        g.attr('transform', event.transform);
    }

    var root = this._selection;
    var svg = d3.select(root.node().querySelector("svg"));
    if (svg.size() == 0) {
        return this;
    }
    this._zoomSelection = svg;
    var zoomBehavior = zoom()
        .scaleExtent(this._options.zoomScaleExtent)
        .translateExtent(this._options.zoomTranslateExtent)
        .interpolate(interpolate)
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

export function getTranslatedZoomTransform(selection) {

    // Get the current zoom transform for the top level svg and
    // translate it uniformly with the given selection, using the
    // difference between the translation specified in the selection's
    // data and it's saved previous translation. The selection is
    // normally the top level g element of the graph.
    var oldTranslation = this._translation;
    var oldScale = this._scale;
    var newTranslation = selection.datum().translation;
    var newScale = selection.datum().scale;
    var t = zoomTransform(this._zoomSelection.node());
    if (oldTranslation) {
        t = t.scale(1 / oldScale);
        t = t.translate(-oldTranslation.x, -oldTranslation.y);
    }
    t = t.translate(newTranslation.x, newTranslation.y);
    t = t.scale(newScale);
    return t;
}

export function translateZoomBehaviorTransform(selection) {

    // Translate the current zoom transform for the top level svg
    // uniformly with the given selection, using the difference
    // between the translation specified in the selection's data and
    // it's saved previous translation. The selection is normally the
    // top level g element of the graph.
    this._zoomBehavior.transform(this._zoomSelection, getTranslatedZoomTransform.call(this, selection));

    // Save the selections's new translation and scale.
    this._translation = selection.datum().translation;
    this._scale = selection.datum().scale;

    // Set the original zoom transform to the translation and scale specified in
    // the selection's data.
    this._originalTransform = zoomIdentity.translate(selection.datum().translation.x, selection.datum().translation.y).scale(selection.datum().scale);
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

export function zoomScaleExtent(extent) {

    this._options.zoomScaleExtent = extent;

    return this;
}

export function zoomTranslateExtent(extent) {

    this._options.zoomTranslateExtent = extent;

    return this;
}

export function zoomBehavior() {
  return this._zoomBehavior || null;
}

export function zoomSelection() {
  return this._zoomSelection || null;
}
