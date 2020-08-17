export default TaskStatus;
/**
 * Task statuses.
 */
export type TaskStatus = number;
/**
 * Task statuses.
 * @readonly
 * @enum {number}
 */
declare class TaskStatus {
    /**
     * Wait state.
     * @type {number}
     * @public
     */
    public static Waiting: number;
    /**
     * Running state.
     * @type {number}
     * @public
     */
    public static Active: number;
    /**
     * Done state.
     * @type {number}
     * @public
     */
    public static Done: number;
    /**
     * Error state.
     * @type {number}
     * @public
     */
    public static Error: number;
}
