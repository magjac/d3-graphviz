import {Graphviz} from "../graphviz";

export default function(options) {

    var g = this.node().__graphviz__;
    if (g) {
        g.options(options);
        g._dispatch.call("initEnd", this);
    } else {
        g = new Graphviz(this, options);
    }
    return g;
}
