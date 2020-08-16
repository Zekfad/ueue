import { v4 as uuidv4, } from 'uuid';

import QErrors from './qerrors';
import TaskStatus from './taskstatus';


/**
 * Class representing task.
 * @class
 */
class Task {
	/**
	 * Task ID.
	 * @type {string}
	 * @public
	 */
	id = '';

	/**
	 * Task status.
	 * @type {TaskStatus}
	 * @public
	 */
	status = '';

	/**
	 * Task function.
	 * @type {?Function}
	 * @public
	 */
	fn = null;

	/**
	 * Create task.
	 * @param {object}     params                             Task details.
	 * @param {string}     [params.id=uuidv1()]               Task ID.
	 * @param {TaskStatus} [params.status=TaskStatus.Waiting] Task status.
	 * @param {Function}   params.fn                          Task function.
	 */
	constructor({
		id,
		status = TaskStatus.Waiting,
		fn,
	} = {}) {
		Object.assign(this, {
			id: id ?? uuidv4(),
			status,
			fn,
		});
	}

	/**
	 * Run task and get result.
	 * @param {Function} [fn=this.fn] Task executor.
	 * @returns {any} Task executor result.
	 * @throws {Error} Error from `QErrors` in case of internal error or anything thrown from executor.
	 * @async
	 * @public
	 */
	async run(fn = this.fn) {
		if (fn instanceof Function) {
			try {
				let res = await fn();
				this.status = TaskStatus.Done;
				return res;
			} catch (error) {
				this.status = TaskStatus.Error;
				throw error;
			}
		}
		this.status = TaskStatus.Error;
		throw QErrors.NoFn;
	}

	/**
	 * Unique end event name for this task.
	 * @type {string}
	 * @public
	 */
	get endEventName() {
		let { id, } = this;
		return `task-end-${id}`;
	}
}

export default Task;
