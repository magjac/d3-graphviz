import {transition} from "d3-transition";

export default function(name) {

    this._transition = transition(name);

    return this;
};
