importScripts("../node_modules/viz.js/viz.js");

onmessage = function(event) {
    var svg = Viz(event.data.dot, event.data.options);

    postMessage({
        type: "done",
        svg: svg
    });
};
