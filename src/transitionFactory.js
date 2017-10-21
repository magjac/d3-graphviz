import {transition} from "d3-transition";

export default function(name) {

    this._transitionFactory = name;

    return this;
};
