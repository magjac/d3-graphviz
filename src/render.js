import * as Viz from "viz.js";
import * as d3 from "d3-selection";

export default function(src, element) {

    var svgDoc = Viz(src,
              {
                  format: "svg",
                  engine: "dot"
              }
             );

    var svg = d3.select(element)
        .html(svgDoc)
      .select('svg');

    return svg;
};
