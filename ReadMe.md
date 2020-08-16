# Queue - ueue is silent

[![npm version](https://img.shields.io/npm/v/ueue?style=for-the-badge)](https://www.npmjs.com/package/ueue)![node version](https://img.shields.io/node/v/ueue?style=for-the-badge)[![Build status - Linux/OSX](https://img.shields.io/travis/Zekfad/ueue?style=for-the-badge&logo=linux&logoColor=white)](https://travis-ci.org/github/Zekfad/ueue)[![Build status - Windows](https://img.shields.io/appveyor/build/Zekfad/ueue?style=for-the-badge&logo=windows&logoColor=white)](https://ci.appveyor.com/project/Zekfad/ueue)[![Codecov](https://img.shields.io/codecov/c/gh/Zekfad/ueue?style=for-the-badge)](https://codecov.io/gh/Zekfad/ueue)


Event-driven queue manager.

## Features


## Install

Install via yarn:

```
yarn add ueue
```

Install via npm:

```
npm i ueue
```

## Docs

[Read the docs on GitHub pages.](https://zekfad.github.io/ueue/)

## Example

### Import

#### CommonJS

```js
const { Q, } = require('ueue');
```

#### ES6

```js
import { Q, } from 'ueue';
```

### Use

#### Create queue

```js
const q = new Q();
```

#### Enqueue things

Consider following script:

```js
const sleep = function (ms) {
	return new Promise(res => {
		setTimeout(() => res(), ms);
	});
};

q
	.add(() => 'Test 1')
	.then(console.log);

q
	.add(async () => (await sleep(1000), 'Test 2'))
	.then(console.log);

q.addBunch(
	async () => (await sleep(100), '1'),
	async () => (await sleep(100), '2')
).then(console.log);

q.addBunch(
	async () => (await sleep(100), '1'),
	async () => {
		await sleep(100);
		throw '2';
	},
	async () => (await sleep(100), '3')
).catch(console.log);

console.log('Test 0');
```

And following output:

```log
Test 0
Test 1
Test 2
[ { result: '1' }, { result: '2' } ]
[ { result: '1' }, { error: '2' }, { result: '3' } ]
```
