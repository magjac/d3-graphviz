import Worker from "tiny-worker";

function workerCodeWrapperTemplate () {
    self.port = {
        start: function () {
        },
    };

    workerCode();

    self.onmessage = function (event) {
        self.callback(event);
    }

    self.onconnect({ports: [{
        addEventListener: function (eventType, callback) {
            self.callback = callback;
        },
        postMessage: function (message) {
            self.postMessage(message);
        },
        start: function () {
        },
    }]});

}

export default class {
    constructor(url) {
        const workerCodeString = Buffer.from(
            url.replace(/^data:application\/javascript;base64,/, ''),
            'base64'
        ).toString();
        const workerCodeWrapperString = '(' +
              workerCodeWrapperTemplate.toString().replace('workerCode()', workerCodeString) +
              ')()';
        const workerCodeWrapper = new Function(workerCodeWrapperString);

        this._worker = new Worker(workerCodeWrapper);

        this.port = {
            start: function() {
            },
            postMessage: this._worker.postMessage.bind(this._worker),
            close: this._worker.terminate.bind(this._worker),
        }

        this._worker.onmessage = function (message) {
            this.port.onmessage(message);
        }.bind(this)
    }

}
