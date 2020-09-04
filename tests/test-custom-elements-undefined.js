import { getSuite } from '../node_modules/just-test/dist/just-test.min.js';
import * as DataTier from '../src/data-tier.js';

const
	suite = getSuite({ name: 'Testing Custom Elements when Undefined yet' }),
	tie = DataTier.ties.create('testCustomsUndefined', { text: 'some text' });

class CustomElementA extends HTMLElement {
	get value() {
		return this.__value;
	}

	set value(newSrc) {
		this.__value = newSrc.toUpperCase();
		this.textContent = this.__value;
	}
}

class CustomInputA extends HTMLInputElement {
	get valueA() {
		return this.value;
	}

	set valueA(newSrc) {
		this.value = newSrc.toUpperCase();
	}
}

suite.runTest({ name: 'testing custom elements - autonomous: undefined first and adding to DOM' }, async test => {
	const e = document.createElement('custom-element-a');
	e.dataset.tie = 'testCustomsUndefined:text => value';
	if (e.value) test.fail('precondition failed - was not expecting to get any value, got "' + e.value + '"');

	document.body.appendChild(e);

	await test.waitNextMicrotask();

	if (e.value) test.fail('precondition failed - was not expecting to get any value, got "' + e.value + '"');

	customElements.define('custom-element-a', CustomElementA);

	await test.waitNextMicrotask();

	if (e.value !== tie.text.toUpperCase()) test.fail('textContent of the element expected to be ' + tie.text.toUpperCase() + ', found: ' + e.value);
});

suite.runTest({ name: 'testing custom elements - extended: undefined first and adding to DOM' }, async test => {
	const e = document.createElement('input', { is: 'custom-input-a' });
	e.dataset.tie = 'testCustomsUndefined:text => valueA';
	if (e.value) test.fail('precondition failed - was not expecting to get any value, got "' + e.value + '"');

	document.body.appendChild(e);

	await test.waitNextMicrotask();

	if (e.value) test.fail('precondition failed - was not expecting to get any value, got "' + e.value + '"');

	customElements.define('custom-input-a', CustomInputA, { extends: 'input' });

	await test.waitNextMicrotask();

	if (e.value !== tie.text.toUpperCase()) test.fail('value of the element expected to be ' + tie.text.toUpperCase() + ', found: ' + e.value);
});