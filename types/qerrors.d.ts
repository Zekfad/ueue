export default QErrors;
/**
 * *
 */
export type QErrors = Error;
/**
 * Queue errors.
 * @enum {Error}
 * @readonly
 */
declare class QErrors {
    /**
     * Task executor must be a function.
     * @type {Error}
     * @public
     */
    public static NoFn: Error;
}
