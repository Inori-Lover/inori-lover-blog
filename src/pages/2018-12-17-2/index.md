---
title: 一些想补的基础：new机制，原型

[]: # (new Date()).toJSON()
date: "2018-12-17T08:45:57.887Z"
---

# 原型
其实阮一峰在他自己的(博客)[http://www.ruanyifeng.com/blog/2011/06/designing_ideas_of_inheritance_mechanism_in_javascript.html]里边说的挺好的了,当初看这个文章就觉得有点牛皮但是也就那样，没有进一步去多想。最近想了解这方面的东西的时候又一下子没想起来自己绕了挺大的圈子。

js在设计之初以简单为原则，所以拒绝引入完整的oop套路，简化成为new操作直接调用 constructor 而不是像传统的oop一样是调用整个class定义。这带来的一个问题就是：在oop思想里边，我们除了要定义对象本身的、不共享的东西，还要定义对象共享的东西，直接把new操作等同执行constructor函数造成的问题就是无法无法继承了，每个new操作都只是一个函数的返回值而已，为了实现继承机制，js添加了原型链的机制。

每个对象都有各自的原型，原型也会有自己的原型，直到最后的原型：`null`。对对象进行取值时，会按着原型链一层一层往上查找自身没有的属性（方法）。为了记录自己的原型，每个对象都会有一个内置属性`[[Prototype]]`记录下自身的原型，常见的原型获取手段`__proto__`读写的也是这个内置属性。

> 附带说一句虽然这个属性虽然很广泛但严格意义上并不是标准属性，读写这个内置属性的标准做法应该是使用ES6(ES5.1 ?)中`Object.getPrototypeOf`和`Object.setPrototypeOf`方法。

原型链这个概念比较麻烦的是new操作中指定原型：对`constructor`进行new操作得到的对象的`__proto__`属性是`constructor.prototype`。这里冒出来的`prototype`是？

# prototype
`prototype`是js里内置constructor的一个属性，内容均为特殊的`ƒ () { [native code] }`（js引擎原生内容），而对这类内置constructor直接进行new操作得到的对象也同样会有这么一个属性，方便进行继承构造。

# 手动new
正确理解上边的内容后自己实现new操作已经扫清一大半障碍了，剩下的事情其实就是随意读一下规范看规范有没有别的坑没摸到的程度了。

```javascript
function cunstomNew (constructor) {

  if (!/Function/i.test(Object.prototype.toString.call(constructor))) {
    console.log('constructor must be a function')
    return
  }

  var that = {}
  constructor.bind(that)()
  that.__proto__ = constructor.prototype
  that.constructor = constructor

  return that
}

var a = function () { this.a = 'a' }

var b = cunstomNew(a)

```


午安
2018年12月17日18点06分
