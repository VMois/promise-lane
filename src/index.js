// TODO: Add JSDocs

export default class PromiseLane {
    constructor(concurrency) {
        this.concurrency = concurrency;
        this.current = 0
        this.stopRun = false;

        // TODO: ArrayList is slow for dequeue operations, better LinkedList
        this.queue = new Array();

        this.boundRun = this._run.bind(this);
        this.boundRun();
    }

    add(factory) {
        return new Promise((resolve, reject) => {
            this.queue.push([resolve, reject, factory])
        })
    }

    stop() {
        this.stopRun = true
    }

    _run() {
        while (this.current < this.concurrency && this.queue[0] !== undefined) {
            let [resolve, reject, factory] = this.queue.shift()
            this.current++

            factory()
            .then((value) => resolve(value))
            .catch((error) => reject(error))
            .finally(() => this.current--)
        }
        if (!this.stopRun) {
            setTimeout(this.boundRun, 0);
        }
    }
}
