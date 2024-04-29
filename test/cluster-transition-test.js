import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_transition from "d3-transition";
import * as d3_graphviz from "../index.js";

it("graphviz().render() transitions a cluster graph into another and renders all cluster before nodes.", async () => {

    const window = global.window = jsdom('<div id="graph"><div id="dummy">Hello World</div></div>');
    global.document = window.document

    let graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    const dots = [
`
digraph  {
  graph[style=filled]
  subgraph "cluster_a" {
    fillcolor=purple
    a
  }
}
`,
`
digraph  {
  graph[style=filled]
  subgraph "cluster_b" {
    fillcolor=orange
    b
  }
  subgraph "cluster_c" {
    fillcolor=limegreen
    c
  }
  subgraph "cluster_d" {
    fillcolor=cyan
    d
  }
  subgraph "cluster_a" {
    fillcolor=purple
    a
  }
}
`,
    ];

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot(dots[0])
            .on("end", resolve)
            .render();

        assert.ok(graphviz._active, 'Rendering is active after the 1st rendering has been initiated');

        assert.equal(d3.selectAll('.node').size(), 1, 'Number of initial nodes');
        assert.equal(d3.selectAll('.edge').size(), 0, 'Number of initial edges');
        assert.equal(d3.selectAll('.cluster').size(), 1, 'Number of initial clusters');
        assert.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
        assert.equal(d3.selectAll('ellipse').size(), 1, 'Number of initial ellipses');
        assert.equal(d3.selectAll('path').size(), 0, 'Number of initial paths');
    });

  await new Promise(resolve => {
    graphviz
      .dot(dots[1])
      .transition(d3_transition.transition().duration(100))
      .on("end", resolve)
      .render();
  });

  assert.equal(d3.selectAll('.node').size(), 4, 'Number of nodes after 1st transition');
  assert.equal(d3.selectAll('.edge').size(), 0, 'Number of edges after 1st transition');
  assert.equal(d3.selectAll('.cluster').size(), 4, 'Number of clusters after 1st transition');
  assert.equal(d3.selectAll('polygon').size(), 5, 'Number of polygons after 1st transition');
  assert.equal(d3.selectAll('ellipse').size(), 4, 'Number of ellipses after 1st transition');
  assert.equal(d3.selectAll('path').size(), 0, 'Number of paths after 1st transition');
  assert.equal(d3.selectAll('g').size(), 9, 'Number of paths after 1st transition');

  let seenClusters = {};
  let seenNodes = {};
  d3.selectAll('g>title').each(function () {
    const titleText = this.textContent;
    if (titleText.startsWith("cluster_")) {
      const clusterName = titleText;
      seenClusters[clusterName] = true;
      const expectedNode = titleText.replace("cluster_", "");
      assert.equal(seenNodes[expectedNode], null, "Node shall not be seen before cluster");
    }
    else {
      const nodeName = titleText;
      seenNodes[nodeName] = true;
      const expectedCluster = "cluster_" + titleText;
      assert.equal(seenClusters[expectedCluster], true, "Cluster shall be seen before node");
    }
  });
});
