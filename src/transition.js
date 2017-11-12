import {transition} from "d3-transition";

export default function(name) {

    if (name instanceof Function) {
        this._transitionFactory = name;
    } else {
        this._transition = transition(name);
    }

    return this;
};
