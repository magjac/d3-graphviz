import {Graphviz} from "../graphviz";
import {timeout} from "d3-timer";

export default function(options) {

    var g = this.node().__graphviz__;
    if (g) {
        g.options(options);
        // Ensure a possible new initEnd event handler is attached before calling it
        timeout(function () {
            g._dispatch.call("initEnd", this);
        }.bind(this), 0);
    } else {
        g = new Graphviz(this, options);
    }
    return g;
}
