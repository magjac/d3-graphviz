var fs_promises = require("fs").promises;

global.fetch = function(filename) {
    return fs_promises.open(filename, 'r').then((filehandle) => {
        return filehandle.readFile().then(data => {
            return {
                ok: true,
                arrayBuffer: () => data,
            };
        });
    });
}
