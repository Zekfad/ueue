declare module 'ueue' {
    export = {
        Q,
        Task,
    };
}

/**
 * <p>Create queue manager.</p>
 */
declare class Q extends EventEmitter {
    /**
     * <p>Add task to queue.</p>
     * @param taskFn - <p>Task executor.</p>
     * @returns <p>Task result.</p>
     */
    public add(taskFn: (...params: any[]) => any): Promise;
    /**
     * <p>Add multiple tasks to queue.
     * This will be resolved when last task in a list will be resolved.
     * In case if any task failed this will be rejected.</p>
     * @param taskFns - <p>Task executors.</p>
     * @returns <p>Tasks results.</p>
     */
    public addBunch(...taskFns: ((...params: any[]) => any)[]): Promise;
    /**
     * <p>Check whatever queue has running tasks.</p>
     */
    public hasRunningTasks(): boolean;
}

declare enum QErrors {
    /**
     * <p>Task executor must be a function.</p>
     */
    NoFn
}

/**
 * <p>Create task.</p>
 * @param params - <p>Task details.</p>
 * @param [params.id = uuidv1()] - <p>Task ID.</p>
 * @param [params.status = TaskStatus.Waiting] - <p>Task status.</p>
 * @param params.fn - <p>Task function.</p>
 */
declare class Task {
    constructor(params: {
        id?: string;
        status?: TaskStatus;
        fn: (...params: any[]) => any;
    });
    /**
     * <p>Task ID.</p>
     */
    public id: string;
    /**
     * <p>Task status.</p>
     */
    public status: TaskStatus;
    /**
     * <p>Task function.</p>
     */
    public fn: (...params: any[]) => any;
    /**
     * <p>Run task and get result.</p>
     * @param [fn = this.fn] - <p>Task executor.</p>
     * @returns <p>Task executor result.</p>
     */
    public run(fn?: (...params: any[]) => any): any;
    /**
     * <p>Unique end event name for this task.</p>
     */
    public endEventName: string;
}

declare enum TaskStatus {
    /**
     * <p>Wait state.</p>
     */
    Waiting,
    /**
     * <p>Running state.</p>
     */
    Active,
    /**
     * <p>Done state.</p>
     */
    Done,
    /**
     * <p>Error state.</p>
     */
    Error
}

