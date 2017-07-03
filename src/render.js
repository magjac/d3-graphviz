import * as Viz from "viz.js";
import * as d3 from "d3-selection";

export default function(src, element) {

    var svg = Viz(src,
              {
                  format: "svg",
                  engine: "dot"
              }
             );

    d3.select(element)
        .html(svg);
    return 42;
};
