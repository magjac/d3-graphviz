export default function(src, callback) {

    var graphvizInstance = this;

    this
        .dot(src, render);

    function render() {
        graphvizInstance
            .render(callback);
    }

    return this;
};
