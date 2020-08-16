/**
 * Task statuses.
 * @readonly
 * @enum {number}
 */
class TaskStatus extends null {
	/**
	 * Wait state.
	 * @type {number}
	 * @public
	 */
	static Waiting = 0;
	/**
	 * Running state.
	 * @type {number}
	 * @public
	 */
	static Active = 1;
	/**
	 * Done state.
	 * @type {number}
	 * @public
	 */
	static Done = 2;
	/**
	 * Error state.
	 * @type {number}
	 * @public
	 */
	static Error = 3;
}

Object.freeze(TaskStatus);

export default TaskStatus;
