---
title: 一些想补的基础：new机制，原型

[]: # (new Date()).toJSON()
date: "2018-12-17T08:45:57.887Z"
---

# 原型
其实阮一峰在他自己的(博客)[http://www.ruanyifeng.com/blog/2011/06/designing_ideas_of_inheritance_mechanism_in_javascript.html]里边说的挺好的了,当初看这个文章就觉得有点牛皮但是也就那样，没有进一步去多想。最近想了解这方面的东西的时候又一下子没想起来自己绕了挺大的圈子。

js在设计之初以简单为原则，所以拒绝引入完整的oop套路，简化成为new操作直接调用 constructor 而不是像传统的oop一样是调用整个class定义。这带来的一个问题就是：在oop思想里边，我们除了要定义对象本身的、不共享的东西，还要定义对象共享的东西，直接new constructor 造成的问题就是只能定义自己的东西了，一个 constructor new 出来的多个对象之间没法共享内容。怎么办？原型就是解决这个问题的。每一个对象本身都会有一个原型，在调用方法查询属性的时候，依次往上查询原型，直到最后一级原型null。

原型这个词比较难受的地方就在于：你会很容易觉得这是一个父级属性（对象？随便你怎么说），但实际上并不是，原型是一个同级的属性来的。如果你错误地认为他是一个父级属性，那么带来的一个问题是：你的原型永远都是最始源的null，因为你的原型是父级的原型，那么的你的父级的原型怎么来？你的祖父级原型？祖父级的原型呢？这样循环下去得到的答案就是这个原型只能是最始源的null，修改原型就是修改null。

认识到原型是自己的属性后，下一个问题就是：原型链怎么来？我怎么确定父级是哪位？这就是属性`__proto__`的作用了: `__proto__`的作用是指示你的父级原型是谁。

# 手动new
理解了上边后剩下的事情其实就是随意读一下规范看规范有没有别的坑没摸到的程度了，我的等级还没那么高所以就直接看网上的博文了解了。

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
