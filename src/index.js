/**
 * @typedef {function(): Promise<any>} PromiseFactory
 */

/**
 * Represents a class that manages the execution of promises with concurrency control.
 */
export default class PromiseLane {

    /**
     * Initializes an instance of PromiseLane
     * @param {number} concurrency - The maximum number of promises that can be executed concurrently.
     */
    constructor(concurrency) {
        this.concurrency = concurrency;
        this.current = 0

        // TODO: ArrayList is slow for dequeue operations, better to use LinkedList
        this.queue = new Array();

        this.boundRun = this._run.bind(this);
    }

    /**
     * Adds a promise factory to the queue to be executed as soon as possible.
     * @param {PromiseFactory} factory - A function that, when called, returns a Promise to be executed.
     * @returns {Promise} a Promise that settles when the promise generate by a factory executes eventually.
     */
    add(factory) {
        return new Promise((resolve, reject) => {
            this.queue.push([resolve, reject, factory])
            this.boundRun();
        })
    }

    /**
     * Executes promises from the queue based on the concurrency limit.
     * @private
     */
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
