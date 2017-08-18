import {selection} from "d3-selection";
import selection_graphviz from "./graphviz";
import selection_selectWithoutDataPropagation from "./selectWithoutDataPropagation";

selection.prototype.graphviz = selection_graphviz;
selection.prototype.selectWithoutDataPropagation = selection_selectWithoutDataPropagation;
