onmessage = function(event) {
    if (event.data.vizURL) {
        importScripts(event.data.vizURL);
    }
    var svg = Viz(event.data.dot, event.data.options);

    if (svg) {
        postMessage({
            type: "done",
            svg: svg,
        });
    } else {
        postMessage({
            type: "skip",
        });
    }
};
