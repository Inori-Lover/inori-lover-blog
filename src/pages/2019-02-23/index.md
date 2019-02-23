---
title: 怎么切割emoji😮

[]: # (new Date()).toJSON()
date: "2019-02-23T06:42:58.788Z"
---

### 缘由
在写小程序的时候会发现有些后台提交的文章会导致小程序崩溃冻住，或者处理函数发生错误没法走下去。一开始没注意因为是真的小概率事件而且复现条件不明，直到有一天发生这个需求：我需要把文章一部分切割出来作为分享URL参数丢出来，这个问题可以稳定复现了：某一篇文章点击分享按钮没反应。经过一番debug后才发现是emoji切割产生的废弃字符导致下面这类代码出错了：

```javascript
encodeURIComponent('😮'[0])
```

### 掩盖
由于第一次碰到类似的问题，js也没找到什么原生的api可以用于安全切割emoji字符串，只能暂时跟运营商量先把emoji往后移动，只要我需要切割的部分不包含就完事大吉了。经过两个汉堡的艰难谈判之后我取得了一个版本的宽容期。

### 社区方案
[emoji-aware](https://www.npmjs.com/package/emoji-aware)是第一个我能找到的支持emoji切割的方案，它不仅支持普通emoji还支持了高位复合emoji(如：'👨‍👩‍👧‍👦')，查看源码之后发现是一个先转成array对array进行切割后再复合的[思路](https://github.com/beaugunderson/emoji-aware/blob/master/emoji-aware.js#L5)，为了支持高位emoji还特意写了一个parse。正觉得还行的时候发现该库的第一行有一条Note:

> *Note:* Lodash's `toArray` (as of 4.0.0) and `split` (as of 4.9.0) functions
now correctly split strings that contain emoji; so if that's all you need to do
then [Lodash](https://lodash.com/) is a great fit.

嗯嗯，是你了。

### 最后：Lodash
绕了一圈发现绝大部分的emoji字符串切割都是使用同一个思路，先把字符串展开成数组，对数组进行切割后复合为字符串来代替直接对字符串进行操作。这个操作思路的最大好处是可以自定义一个展开数组的逻辑来支持定制需求（在这里就是对高位unicode字符的正确支持），剩下的事情就是常规操作，可以坐下慢慢秀。

下边就是从Lodash里边抽出来的关于toArray的代码, 由于Lodash里边的toArray还包含了很多其他类型对象的支持但是这些对于我来说其实并没用所以这里就做了精简，结合切割需求直接把最后的需求一起实现(copy-parse)了。

> 代码转最后附录

### 求助？
其实在最早的时候上网查说阮一峰老师有一篇博文提到了如何切割emoji以及检测是否有被剪切坏的emoji，但是实在没找到这篇文章？

另最后贴的一个链接里边是关于diss阮一峰老师的。。。。

emm，总体来说我还是很尊敬这位互联网老兵的贴出来只不过是刚好里边涉及到了关于这次的主题 编码 的。

### 推荐阅读
1. [JavaScript has a Unicode problem · Mathias Bynens](https://mathiasbynens.be/notes/javascript-unicode)
2. [Emoji 简介](http://www.ruanyifeng.com/blog/2017/04/emoji.html)
3. [阮一峰的文章有哪些常见性错误](https://www.v2ex.com/t/343634?p=1)


### 附录
```javascript
//@ts-check
/** come from https://github.com/lodash/lodash/blob/4.17.11/lodash.js#L755 */

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}


/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

var toArray = stringToArray
/**
 * 安全的字符串切割
 *
 * @private
 * @param {string} str 待切割的字符串
 * @param {number} start 切割起始位置
 * @param {number} len 切割长度
 * @returns {string} 返回切割好的字符串
 */
function safeSubstring (str, start, len) {
  return toArray(str).splice(start, len).join('')
}

/**
 * @example
 * var test = safeSubstring('我爱大家👨‍👩‍👧‍👦哦~', 0 , 5)
 * console.clear()
 * console.log([
 *  test,
 *  encodeURI(test),
 *  decodeURI(encodeURI(test)),
 * ])
 */

```
