class Pool {
  /** 待处理 */
  private pendding = [];
  /** 资源池 */
  private pool = [];

  constructor(/** 资源池深度 */ private depth: number) {
    //
  }

  /** 补全全部资源池空位（可能情况下） */
  private run = () => {
    //
  };

  /** 压入任务 */
  public add = () => {
    //
  };

  /** 类似Promise.all行为，对象是当前时间点的pool（不包括之后压入的） */
  public all = () => {
    //
  };

  /** 获取当前等待队列长度 */
  public get pendingLen () {
    return this.pendding.length
  }

  /** 获取当前设置的资源池深度 */
  public get poolDepth () {
    return this.depth
  }

  /** 获取当前设置的资源池深度，实时，可能与设置值不一致（动态扩容、缩容的情况） */
  public get currentPoolDepth () {
    return this.pool.length
  }

  /** 修改资源池深度 */
  public changeBuffenLen = (buffer: number) => {
    this.depth = buffer;
  };
}
