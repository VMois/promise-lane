// TODO: Add JSDocs

export default class PromiseLane {
    constructor(concurrency) {
        this.concurrency = concurrency;
        this.current = 0

        // TODO: ArrayList is slow for dequeue operations, better to use LinkedList
        this.queue = new Array();

        this.boundRun = this._run.bind(this);
    }

    add(factory) {
        return new Promise((resolve, reject) => {
            this.queue.push([resolve, reject, factory])
            this.boundRun();
        })
    }

    _run() {
        while (this.current < this.concurrency && this.queue[0] !== undefined) {
            let [resolve, reject, factory] = this.queue.shift();
            this.current++

            // Run a factory, get a promise and execute it
            factory()
            .then((value) => resolve(value))
            .catch((error) => reject(error))
            .finally(() => this.current--);
        }

        // If no items are in a queue, 
        // no need to send _run at the end of event loop
        if (this.queue[0] === undefined) {
            return;
        }
        
        // Calls check funct
        setTimeout(this.boundRun, 0);
    }
}
