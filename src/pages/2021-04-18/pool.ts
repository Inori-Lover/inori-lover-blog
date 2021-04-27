class Pool {
  /** 待处理 */
  private pendding: (() => Promise<unknown>)[] = []
  /** 资源池 */
  private pool: (() => Promise<unknown>)[] = []

  constructor(/** 资源池深度 */ private depth: number = 1) {
    //
  }

  /** 补全全部资源池空位（可能情况下） */
  private run = (): void => {
    //
  }

  /** 压入任务 */
  public add = <T = unknown>(task: () => Promise<T>): Promise<T> => {
    return {} as any
  }

  /** 获取当前等待队列长度 */
  public get pendingLen() {
    return this.pendding.length
  }

  /** 获取当前设置的资源池深度 */
  public get bufferLen() {
    return this.depth
  }

  /** 获取当前设置的资源池深度，实时，可能与设置值不一致（动态扩容、缩容的情况） */
  public get poolDepth() {
    return this.pool.length
  }

  /** 修改资源池深度 @param bufferLen 深度，必须大于等于1否则抛错 */
  public changeBuffenLen = (bufferLen: number) => {
    this.depth = bufferLen
  }
}
