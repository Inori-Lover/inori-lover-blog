class Pool {
  /** 队列 */
  private pendding: (() => Promise<unknown>)[] = []
  /** 资源池 */
  private pool: (() => Promise<unknown>)[] = []

  constructor(/** 资源池深度 */ private depth: number = 1) {
    //
  }

  /** 消费队列 */
  private run = (): void => {
    if (
      /** 当资源池已经满了的时候 */ this.pool.length >= this.depth ||
      /** 当队列为空时 */ !this.pendding.length
    ) {
      return
    }

    let runNum = Math.min(this.depth - this.pool.length, this.pendding.length)
    while (runNum > 0) {
      // 注意顺序，push加在尾部，配合shift保证先进先出
      this.pendding.shift()()
      runNum -= 1
    }
  }

  /** 压入任务 */
  public add = <T = unknown>(task: () => Promise<T>): Promise<T> => {
    return new Promise<T>((r, j) => {
      this.pendding.push(() =>
        task().then((...res) => {
          r(...res)
          this.run()
        }, j)
      )

      this.run()
    })
  }

  /** 分批压入任务 */
  public map = <T = unknown, Source = unknown>(
    sources: Source[],
    taskConstructor: (
      param: Source,
      index: number,
      sources: Source[]
    ) => Promise<T>
  ): Promise<T[]> => {
    /** 存放结果 */
    const result: T[] = []
    /** 指针，当前运行第几项 */
    let cursor = 0
    /** 指针最大值，缓存下来加快运行速度 */
    const maxCursor = sources.length - 1
    /** 是否已经发生过错误 */
    let hasError = false
    /** 本次map里尚在运行的任务；因为是共用了pool所以这里需要单独计数而不能直接读pool深度 */
    let currentTasksNum = 0

    /** 压入任务 */
    const add = (
      resolve: (result: T[]) => void,
      reject: (reason: unknown) => void
    ): void => {
      const currentCursor = cursor
      cursor += 1
      currentTasksNum += 1

      /** 执行任务 */
      this.add(() =>
        taskConstructor(sources[currentCursor], currentCursor, sources)
      ).then(
        (res) => {
          // 如果有错误，那就什么都不用干了，跟同步的map函数行为一致
          if (hasError) {
            return
          }

          /** 正在运行的任务数减一 */
          currentTasksNum -= 1

          /** 保存结果 */
          result[currentCursor] = res
          /** 当指针已经越过最大值且没有任务在跑，代表所有任务都跑完了 */
          if (cursor > maxCursor && !currentTasksNum) {
            /** 可以触发Promise的返回 */
            resolve(result)
          } else {
            /** 否则继续跑任务 */
            add(resolve, reject)
          }
        },
        (err) => {
          hasError = true
          reject(err)
        }
      )

      /** 因为是共用pool，所以有可能压入的时候有很多任务，但是过了一会别的任务全部完成了，有空位 */
      if (this.bufferLen > this.poolDepth) {
        /** 同步迭代，因为pool是出于避免大数组出现而做的数量限制，所以这里不考虑迭代深度爆栈的问题 */
        add(resolve, reject)
      }
    }

    return new Promise<T[]>(add)
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
