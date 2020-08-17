export default Q;
/**
 * Class representing Queue.
 * @class
 * @extends EventEmitter
 */
declare class Q {
    /**
     * Tasks queue.
     * @type {Task[]}
     * @private
     */
    private q;
    /**
     * Add task to queue.
     * @param {Function} taskFn Task executor.
     * @returns {Promise} Task result.
     * @throws Error if no valid function provided.
     * @async
     * @public
     */
    public add(taskFn: Function): Promise<any>;
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
    public addBunch(...taskFns: Function[]): Promise<any>;
    /**
     * Internal method to push task to queue.
     * @param {Task|Function} task Task or task function to add.
     * @returns {Array<Task, Promise>} Task instance and resolver Promise.
     * @private
     */
    private pushTask;
    /**
     * Check whatever queue has running tasks.
     * @returns {boolean}
     * @public
     */
    public hasRunningTasks(): boolean;
    /**
     * New task handler.
     * @param {Task} task Task.
     * @returns {boolean} Whatever if task has been started immediately.
     * @private
     */
    private onNewTask;
    /**
     * Remove task from queue and start next in queue.
     * @param {Task} task Ended task.
     * @returns {boolean} Whatever any another task has run.
     * @private
     */
    private onTaskDone;
    /**
     * Try to run task if there's no already running tasks.
     * @param {Task} [task=this.q[0]] Task to run. Will we set to first in queue if not specified.
     * @returns {boolean} Whatever if any task has ran.
     * @private
     */
    private tryToRunTask;
}
