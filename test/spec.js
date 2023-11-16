import PromiseLane from '../src/index.js';

const p1 = () => new Promise((resolve, reject) => {
    setTimeout(resolve, 1000, 'hello')
});

const p2 = () => new Promise((resolve, reject) => {
    setTimeout(resolve, 100, 'world')
});

const promiseLane = new PromiseLane(1);

const w1 = promiseLane.add(p1);
const w2 = promiseLane.add(p2);

w1.then((v) => console.log(v));
w2.then((v) => console.log(v));
