export default function() {

    delete this._selection.node().__graphviz__;
    if (this._worker) {
        this._workerPortClose();
    }
    return this;
};
