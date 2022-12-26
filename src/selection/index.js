import {selection} from "d3-selection";
import selection_graphviz from "./graphviz.js";
import selection_selectWithoutDataPropagation from "./selectWithoutDataPropagation.js";

selection.prototype.graphviz = selection_graphviz;
selection.prototype.selectWithoutDataPropagation = selection_selectWithoutDataPropagation;
