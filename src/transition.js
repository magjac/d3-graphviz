import {transition} from "d3-transition";
import {active as d3_active} from "d3-transition";

export default function(name) {

    if (name instanceof Function) {
        this._transitionFactory = name;
    } else {
        this._transition = transition(name);
    }

    return this;
};

export function active(name) {

    var root = this._selection;
    var svg = root.selectWithoutDataPropagation("svg");
    if (svg.size() != 0) {
        return d3_active(svg.node(), name);
    } else {
        return null;
    }
};
