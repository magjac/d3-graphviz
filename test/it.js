export default function it_wrapper(decription, run) {
    it(decription, async function () {
        await new Promise(async (resolve, reject) => {
            try {
                await run.call(this);
                resolve();
            }
            catch (e) {
                reject(e);
            }
        });
    });
}

export function it_xfail(decription, run) {
    it(decription + " XFAIL", async function () {
        await new Promise(async (resolve, reject) => {
            try {
                await run.call(this);
            }
            catch (e) {
                resolve();
            }
            reject(Error("The test unexpectedly passed (XPASS)"));
        });
    });
}
