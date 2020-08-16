const
	assert = require('assert'),

	{
		Q,
		Task,
	} = require('..');


const sleep = function (ms) {
	return new Promise(res => setTimeout(() => res(), ms));
};

describe('Q', () => {

	const q = new Q();

	describe('#constructor', () => {

		it('should create new queue', () => {

			assert.ok(new Q());

		});

	});

	describe('#add (actually #pushTask)', () => {


		it('should add tasks to queue', done => {

			q.add(() => { done() });

		});

		it('should resolve tasks in queue with correct order', done => {

			const correctOrder = [
					'a',
					'b',
					'c',
				],
				order = [];

			q.add(() => { order.push('a') });
			q.add(() => { order.push('b') });
			q.add(() => {
				order.push('c');
				done(assert.deepEqual(order, correctOrder));
			});

		});

		it('should reject if task fails', done => {

			q
				.add(() => { throw new Error() })
				.then(() => done(new Error()))
				.catch(() => done());

		});

		it('should throw if arguments are invalid', () => {

			assert.throws(() => {
				q.add(new Error());
			});

		});

		it('should work with async functions as well', done => {

			const correctOrder = [
					'a',
					'b',
					'c',
				],
				order = [];

			q.add(async () => { await sleep(10); order.push('a') });
			q.add(() => { order.push('b') });
			q.add(async () => {
				await sleep(10);
				order.push('c');
				done(assert.deepEqual(order, correctOrder));
			});

		});

	});

	describe('#pushTask', () => {

		it('should work with Task instances as well', done => {

			q.pushTask(new Task({ fn: () => done(), }));

		});

	});

	describe('#addBunch', () => {

		it('should resolve tasks in queue with correct order', done => {

			const correctRes = [
				{ result: 'a', },
				{ error: 'b', },
				{ result: 'c', },
			];

			q.addBunch(
				async () => (await sleep(10), 'a'),
				() => { throw 'b' },
				() => 'c'
			).catch(res => {
				done(assert.deepEqual(res, correctRes));
			});

		});

		it('should resolve tasks in queue with correct order', done => {

			const correctOrder = [
					'a',
					'b',
					'c',
				],
				order = [];

			q.addBunch(
				() => { order.push('a') },
				() => { order.push('b') },
				() => {
					order.push('c');
					done(assert.deepEqual(order, correctOrder));
				}
			);

		});

		it('should throw if arguments are invalid', () => {

			assert.throws(() => {
				q.addBunch();
			});

			assert.throws(() => {
				q.addBunch(new Error());
			});

		});

	});

});
