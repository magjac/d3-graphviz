import * as d3 from "d3-selection";

export default function(name) {

  return d3.select(this.node().querySelector(name));
}
