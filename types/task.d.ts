export default Task;
/**
 * Class representing task.
 * @class
 */
declare class Task {
    /**
     * Create task.
     * @param {object}     params                             Task details.
     * @param {string}     [params.id=uuidv1()]               Task ID.
     * @param {TaskStatus} [params.status=TaskStatus.Waiting] Task status.
     * @param {Function}   params.fn                          Task function.
     */
    constructor({ id, status, fn, }?: {
        id: string;
        status: TaskStatus;
        fn: Function;
    });
    /**
     * Task ID.
     * @type {string}
     * @public
     */
    public id: string;
    /**
     * Task status.
     * @type {TaskStatus}
     * @public
     */
    public status: TaskStatus;
    /**
     * Task function.
     * @type {?Function}
     * @public
     */
    public fn: Function | null;
    /**
     * Run task and get result.
     * @param {Function} [fn=this.fn] Task executor.
     * @returns {any} Task executor result.
     * @throws {Error} Error from `QErrors` in case of internal error or anything thrown from executor.
     * @async
     * @public
     */
    public run(fn?: Function): any;
    /**
     * Unique end event name for this task.
     * @type {string}
     * @public
     */
    public get endEventName(): string;
}
import TaskStatus from "./taskstatus";
