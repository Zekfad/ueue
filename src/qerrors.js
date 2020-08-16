/**
 * Queue errors.
 * @enum {Error}
 * @readonly
 */
class QErrors extends null {
	/**
	 * Task executor must be a function.
	 * @type {Error}
	 * @public
	 */
	static NoFn = new Error('Task executor must be a function.');
}

Object.freeze(QErrors);

export default QErrors;
