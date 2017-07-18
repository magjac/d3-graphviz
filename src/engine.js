export default function(engine) {

/*
    if (!this._engines.has(engine)) {
        throw Error('Illegal engine: ' + engine);
    }
*/
    if (engine != this._engine && this._data != null) {
        throw Error('Too late to change engine');
    }
    this._engine = engine;

    return this;
};
