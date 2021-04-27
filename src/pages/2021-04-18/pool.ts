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
    taskConStructor: (param: Source) => Promise<T>,
    config?: { continueOnError?: boolean }
  ): Promise<T[]> => {
    const continueOnError = config?.continueOnError || false
    const result: T[] = []
    let cursor = 0
    const maxCursor = sources.length - 1
    // 空余的pool位置
    let mapPoolDepth = Math.max(this.bufferLen - this.poolDepth, 1)
    const add = (
      resolve: (result: T[]) => void,
      reject: (reason: unknown) => void
    ): void => {
      const currentCursor = cursor
      cursor += 1

      this.add(() => taskConStructor(sources[currentCursor])).then(
        (res) => {
          result[currentCursor] = res
          if (currentCursor === maxCursor) {
            resolve(result)
          } else {
            add(resolve, reject)
          }
        },
        (err) => {
          if (continueOnError) {
            if (currentCursor === maxCursor) {
              resolve(result)
            } else {
              add(resolve, reject)
            }
          } else {
            reject(err)
          }
        }
      )
    }

    return new Promise<T[]>((r, j) => {
      while (mapPoolDepth > 0) {
        add(r, j)
        mapPoolDepth -= 1
      }
    })
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
