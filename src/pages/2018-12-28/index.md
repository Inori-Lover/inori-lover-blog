---
title: 关于imm*类数据不可变库的一些想法

[]: # (new Date()).toJSON()
date: "2018-12-28T14:09:08.498Z"
---

# 缘由
今天老大喊我把之前rn写的App优化一下……不同tab之间的的切换太卡了，给了一个思路是上一个`immutable-js`，我这边的意思是让我先看一下代码，毕竟我还没写过rn……

# 为何会有imm*
[immutable-js](https://github.com/facebook/immutable-js)，通过导出自定义数据结构构造器，构造得到的对象仅有的各个方法均为返回新对象的方法，不提供任何手段来直接修改对象内容。当然，为了避免`JSON.parse(JSON.stringify))`等deepClone手段的低效，`immutable-js`通过使用特定的数据结构来储存、修改、衍生常用结构，达到用最小消耗来隔离两个数据对象的目的。

[immer](https://github.com/mweststrate/immer)，与前者不同的是，immer并没有使用各种奇怪的奇怪的数据结构来优化数据对象的隔离消耗，而是使用高阶函数包裹修改操作，把传入对象包裹一层添加`get`|`set`来隔离修改操作对传入对象的影响，同时循环将原对象以及记录到的修改操作循环assign到[`{}`](https://github.com/mweststrate/immer/blob/master/src/common.js#L39)上作为return值返回。

> vue的老铁肯定觉得很熟悉（

介绍完最主流的两个不可变数据实现库后再回头看看当初fb员工提出`immutable-js`时提到的**why**。

不可变数据带来两个最大的优势，
第一个就是数据都是不可变后，修改操作不再会产生潜在的影响，修改操作进行时的心智负担变小了；
第二个就是避免了`shadowDiff`, 有效解决了`PureComponent`的问题，为降低`shouldComponentUpdate`消耗提供了一条思路。（当然原介绍中用的不是`PureComponent`，当时还是ES5函数的时代，用的是`mixin`。`mixin`是直到ES6 Class声明写法流行后才被抛弃同时定性为有害，想想也是惨233

# redux
要说`shouldComponentUpdate`肯定会联想到`react-redux`，他提供的高阶组件`connect`其中一个作用就是修改了组件的`shouldComponentUpdate`强制为浅对比，也就是所有组件都变成了`PureComponent`。同时也是基于这个原因，redux的各大教程最大的一条注意事项就是：修改state时需要返回一个全新对象，要`===`判断为假的那种全新，反则修改后有可能不会触发刷新。

# redux + imm* ?
那么进入redux时代后，imm*类库的存在意义有何变化？回看前文提到的不可变数据结构，两大优势其中之一已经被redux无意间消去，只剩下减少心智负担这一条。但是认真一想：state修改极少会遇到引用类型数据，就算有，也是不会复用的那种、仅限自己层叠的数据结构，极少遇到不同state-key之间共享同一块数据的情况(或者根本没有？反正我没写过这么奇葩的state结构)。那么这个时候的心智负担会有多大？就算是以贴合原生API为卖点的`immer`也是以降低层叠结构修改繁复作为主要宣传场景，而当下大家也找到另一种绕开层叠数据的手段：不层叠就完事了。每一个model里边的数据都尽量做到完全扁平，这样借助es6解构语法返回新对象并不会比点操作符修改繁杂多少，甚至熟悉之后会觉得更加简单明了。

# imm*类库可以降低性能消耗？
都是返回新对象……

有人会反驳说`immutable-js`会复用数据结构……我只想说怎么复用也是要把修改的存上去，用完就丢的场景这个复用实在……

# 最后

一组代码作为体验pure与否的差距。令我比较惊讶的是函数组件……我原本以为函数组件是打死不刷新的，看来应该是只要触发了props变动就一定会rerend。

代码使用tsx书写，因为染色问题个别地方写得比较别扭……

```javascript
type Props = {value: { deep: Record<'num', number> }}
type State = {value: { deep: Record<'num', number> }, pure: boolean}

const textFunc = (text: string, value: State['value']|string) => `${text}: ${typeof value !== 'string' ? value.deep.num : value}`

const FuncComponent = ({ value }: Props) => (
  <>{ textFunc('FuncComponent', value) }</>
)

type NormalComponentProps = Props & {pure: boolean}
class NormalComponent extends Component<NormalComponentProps> {

  public shouldComponentUpdate (nextProps: NormalComponentProps) {
    return !nextProps.pure || this.props === nextProps
  }

  render () {
    const { value } = this.props
    return textFunc('NormalComponent', value)
  }
}

class PureComponent extends React.PureComponent<Props> {
  render () {
    const { value } = this.props
    return textFunc('PureComponent', value)
  }
}

class App extends Component<{}, State> {

  readonly state: State = {
    value: {
      deep: {
        num: 0
      }
    },
    pure: false,
  }

  private clickHandle = () => {
    const { value } = this.state
    const { deep } = value
    const { num } = deep
    value.deep = {
      num: num + 1,
    }
    this.setState({
      value,
    })
  }

  private pureToggleHandle = () => {
    const { pure } = this.state
    this.setState({
      pure: !pure,
    })
  }

  render() {
    const { value, pure } = this.state

    return (
      <>
        <div>{ textFunc('state is', JSON.stringify(this.state)) }</div>

        <button onClick={this.clickHandle}>plus 1</button> | <button onClick={this.pureToggleHandle}>pure?</button>

        <hr/>
        <FuncComponent value={value} />
        <hr/>
        <NormalComponent value={value} pure={pure} />
        <hr/>
        <PureComponent value={value} />
      </>
    );
  }
}
```
晚安，& 提前祝 新年好
2018年12月29日00点54分
