export default function(options) {

    if (typeof options == 'undefined') {
        return Object.assign({}, this._options);
    } else {
        for (var option of Object.keys(options)) {
            this._options[option] = options[option];
        }
        return this;
    }
};
