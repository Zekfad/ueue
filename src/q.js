import EventEmitter from 'events';

import QErrors from './qerrors';
import Task from './task';
import TaskStatus from './taskstatus';


/**
 * Class representing Queue.
 * @class
 * @extends EventEmitter
 */
class Q extends EventEmitter {
	/**
	 * Tasks queue.
	 * @type {Task[]}
	 * @private
	 */
	q = [];

	/**
	 * Create queue manager.
	 */
	constructor() {
		super();

		this.on('new-task', this.onNewTask.bind(this));
	}

	/**
	 * Add task to queue.
	 * @param {Function} taskFn Task executor.
	 * @returns {Promise} Task result.
	 * @throws Error if no valid function provided.
	 * @async
	 * @public
	 */
	add(taskFn) {
		return this.pushTask(taskFn)[1];
	}

	/**
	 * Add multiple tasks to queue.
	 * This will be resolved when last task in a list will be resolved.
	 * In case if any task failed this will be rejected.
	 * @param {...Function} taskFns Task executors.
	 * @returns {Promise} Tasks results.
	 * @throws Error if no valid function provided.
	 * @async
	 * @public
	 */
	addBunch(...taskFns) {
		if (
			taskFns.length <= 0 ||
			taskFns.some(taskFn => !(taskFn instanceof Function))
		)
			throw QErrors.NoFn;

		const
			lastTaskIndex = taskFns.length - 1,
			results = [],
			tasks = [];

		return new Promise((resolve, reject) => {
			taskFns.forEach((taskFn, index) => {
				let [ task, taskHandler, ] = this.pushTask(taskFn);
				tasks.push(task);

				taskHandler = taskHandler
					.then(result => {
						results.push({ result, });
					})
					.catch(error => {
						results.push({ error, });
					});

				if (index === lastTaskIndex) {
					taskHandler.then(() => {
						if (tasks.some(qTask => qTask.status === TaskStatus.Error))
							reject(results);
						else
							resolve(results);
					});
				}
			});
		});
	}

	/**
	 * Internal method to push task to queue.
	 * @param {Task|Function} task Task or task function to add.
	 * @returns {Array<Task, Promise>} Task instance and resolver Promise.
	 * @private
	 */
	pushTask(task) {
		if (!(task instanceof Task)) {
			if (task instanceof Function) {
				task = new Task({
					fn: task,
				});
			} else
				throw QErrors.NoFn;
		}

		this.emit('new-task', task);

		const resolver = new Promise((resolve, reject) => {
			this.once(task.endEventName, (error, result) => {
				if (task.status === TaskStatus.Error)
					reject(error);
				else
					resolve(result);
			});
		});

		return [ task, resolver, ];
	}

	/**
	 * Check whatever queue has running tasks.
	 * @returns {boolean}
	 * @public
	 */
	hasRunningTasks() {
		let { q, } = this;

		return q.some(qTask => qTask.status === TaskStatus.Active);
	}

	/**
	 * @param {Task} task Task.
	 * @returns {boolean} Whatever if task has been started immediately.
	 * @private
	 * @callback
	 */
	onNewTask(task) {
		let { q, } = this;
		q.push(task);

		return this.tryToRunTask(task);
	}

	/**
	 * Remove task from queue and start next in queue.
	 * @param {Task} task Ended task.
	 * @returns {boolean} Whatever any another task has run.
	 * @private
	 * @callback
	 */
	onTaskDone(task) {
		this.q = this.q.filter(qTask => qTask !== task);

		return this.tryToRunTask();
	}

	/**
	 * Try to run task if there's no already running tasks.
	 * @param {Task} [task=this.q[0]] Task to run. Will we set to first in queue if not specified.
	 * @returns {boolean} Whatever if any task has ran.
	 * @private
	 */
	tryToRunTask(task = this.q[0]) {
		if (!task)
			return false;

		if (!this.hasRunningTasks()) {
			task.status = TaskStatus.Active;
			task.run()
				.then(result => {
					this.emit(task.endEventName, false, result);
				})
				.catch(error => {
					this.emit(task.endEventName, error, false);
				})
				.then(() => {
					this.onTaskDone(task);
				});
			return true;
		}

		return false;
	}
}

export default Q;
