export default function(engine) {

    if (engine != this._options.engine && this._data != null) {
        throw Error('Too late to change engine');
    }
    this._options.engine = engine;

    return this;
};
