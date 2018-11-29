---
title: 关于重试

[]: # (new Date()).toJSON()
date: "2018-11-29T14:20:42.813Z"
---

今天一天下来的总结就是：搬石头砸自己脚。

关于重试这个需求其实一直都伴随着我的代码，但是以前都觉得麻烦一直选择性忽视。到了今天感觉不能继续躲了（主动 被动因素都有就是了），然后一天都坑在这上边了，完全不知道怎么着手进行。

###迭代重试
最初想出来的重试流程是把自身的变量定义传到retry函数里作为一个参数；当条件不符合以及重试数不达标时，迭代调用传入的函数。这里涉及到一个问题就是返回流程，搞了一天我都没搞好迭代的返回应该怎么处理（回家走路时想了一下觉得有一套路子可行但是代码写出来并不优雅…而且也还是有点绕…）。

###解耦重试流程
回家后洗澡继续想，慢慢地思维变得正常起来：既然之前的流程时迭代的，迭代对于自己来说有点绕，那能不能改成常规循环？怎么才能满足循环条件？

要循环调用，就意味着，循环体与循环语句必须解耦，两者需要互不干扰。

之前的写法是 函数运行->(inside)判断函数是否合规->不合规就调用函数本体 ,但是重试后合规的话，应该怎么返回，这里有点绕了- -（是的我知道我很菜

现在要解耦，那就需要 生成值的函数 与 判断值的函数 必须分开，然后由重试函数包裹进行判断重试。理解这一层后重试函数就不难实现了。

```html
<style>
  #count::after {
    content: attr(data)
  }
</style>

<div data='0' id='count'></div>

<script>
  const maybe = () => new Promise(resolve => setTimeout(function () {
    resolve(Math.random())
  }, 1000))

  const isRight = val => val > 0.999999999999

  const tryAble = async (maybe, isRight, times) => {
    let count = 0
    let flag
    while (
      count < times &&
      !flag
    ) {
      let val

      count++

      try {
        val = await maybe()
        flag = isRight(val)
      } catch (err) {
        //
      }
      document.getElementById('count').setAttribute('data', Number(count))
      console.log(val)
      console.log(flag)
    }

    document.getElementById('count').textContent = 'done at: '
  }

  tryAble(maybe, isRight, 5)
</script>
```


ps: 或许会更新注释以及添加砸自己脚的那个重试写法（的正确版本）。

晚安各位

2018年11月29日 22点23分
