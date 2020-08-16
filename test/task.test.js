const
	assert = require('assert'),

	{ Task, } = require('..');


describe('Task', () => {

	describe('#constructor', () => {

		it('should create new task', () => {

			assert.ok(new Task());

		});

	});

	describe('#run', () => {

		it('should throw if arguments are invalid', done => {

			new Task()
				.run()
				.catch(() => done());

		});

	});

});
