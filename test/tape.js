import assert from "assert";

export default function tape(decription, run) {
    it(decription, async function () {
        var mocha_this = this;
        try {
            await new Promise((resolve, reject) => {
                let test = {
                    equal(a, b, c) {
                        try {
                            assert.equal(a, b, c);
                        }
                        catch (e) {
                            reject(e);
                        }
                    },
                    notEqual(a, b, c) {
                        try {
                            assert.notEqual(a, b, c);
                        }
                        catch (e) {
                            reject(e);
                        }
                    },
                    deepEqual(a, b, c) {
                        try {
                            assert.deepStrictEqual(a, b, c);
                        }
                        catch (e) {
                            reject(e);
                        }
                    },
                    notDeepEqual(a, b, c) {
                        try {
                            assert.notDeepStrictEqual(a, b, c);
                        }
                        catch (e) {
                            reject(e);
                        }
                    },
                    deepLooseEqual(a, b, c) {
                        try {
                            assert.deepEqual(a, b, c);
                        }
                        catch (e) {
                            reject(e);
                        }
                    },
                    ok(a, b, c) {
                        try {
                            assert.ok(a, b, c);
                        }
                        catch (e) {
                            reject(e);
                        }
                    },
                    notOk(value, message) {
                        try {
                            assert.ok(!value, message);
                        }
                        catch (e) {
                            reject(e);
                        }
                    },
                    throws(a, b, c) {
                        try {
                            assert.throws(a);
                        }
                        catch (e) {
                            reject(e);
                        }
                    },
                    doesNotThrow(a, b, c) {
                        try {
                            assert.doesNotThrow(a);
                        }
                        catch (e) {
                            reject(e);
                        }
                    },
                    timeoutAfter(a) {
                        if (a == undefined) {
                            return mocha_this.timeout();
                        }
                        mocha_this.timeout(a);
                    },
                    end() {
                        resolve();
                    }
                };
                run(test);
            });
        }
        catch (e) {
            throw e;
        }
    });
}
