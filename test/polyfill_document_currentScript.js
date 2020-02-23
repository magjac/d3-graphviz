module.exports = function(document) {
    Object.defineProperty(document, "currentScript", {
        get() { return {src: './node_modules/@hpcc-js/wasm/dist/index.js'}; }
    });
}
