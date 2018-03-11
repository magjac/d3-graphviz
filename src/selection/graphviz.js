import {Graphviz} from "../graphviz";

export default function(useWorker=true) {

    return new Graphviz(this, useWorker);
}
