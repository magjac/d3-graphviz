export default function(src) {

    var graphvizInstance = this;

    this
        .dot(src, render);

    function render() {
        graphvizInstance
            .render();
    }

    return this;
};
