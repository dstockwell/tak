import 'https://cdnjs.cloudflare.com/ajax/libs/mocha/5.2.0/mocha.min.js';
import 'https://cdnjs.cloudflare.com/ajax/libs/chai/4.1.2/chai.min.js';

export let describe;
export let it;
export let mocha = window.mocha;
export let chai = window.chai;

mocha.setup('bdd');
describe = window.describe;
it = window.it;
