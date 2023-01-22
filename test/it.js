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
