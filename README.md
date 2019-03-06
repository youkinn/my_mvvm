### 思路：

1. 实现一个数据变化检测机制(Observer.js), 让我们可以知道数据发生了变化并自动更新dom。
2. 实现一个编译器(Compiler.js), 处理页面上预置的命令( '{{}}'、指令、过滤器等 )。
3. 实现一个MVVM实例(MVVM.js)，组合各部分功能，作为入口。

<br/>

#### 数据变化检测
实现数据变化检测机制主要有2个关键点：
1. 订阅发布模式
2. es5的Object.defineproperty方法。
     Object.defineProperty(obj:Object, prop:String, descriptor:Object)

核心代码：
```
Object.defineProperty(obj, 'key', {
  var publisher = new Publisher();
  get: function() {
      // 收集订阅者
  },
  set: function(newVal) {
      // 对比旧的值，如果发生了改变，则发出通知所有的订阅者
      notify();
  }
});
```
<br/>

#### 页面渲染&指令解析

编译主要分下面2个阶段：
1. 第一次页面解析
2. 解析完成后，如果数据发生变化，自动更新dom

##### 第一阶段负责页面解析，主要包括
1. 遍历所有元素节点上的属性节点(因为指令挂载在元素上)，并执行相应操作(比如遇到v-model我们将其换算为其注册input事件)。
2. 遍历所有的文本节点，找出所有的 {{}}, 替换变量。

**！！关键点是：在合适的时机实例化订阅者**

##### 第二个阶段则主要依赖于第一个阶段实例化的订阅者传入的回调进行dom的更新

参照ng跟vue，我们可以自行设计一些命令。这里不那么复杂，我们先只实现数据绑定({{}}跟v-model)。
- ng: ng-repeat、ng-if、ng-click、etc
- vue: v-for、v-if、v-click、etc

<br/>

#### nextTick与虚拟dom

- 到这里为止，上面的内容其实以及足够完成数据绑定。思考下面的场景：
- 在极短时间内对页面上的一个元素发生多次改变(实际上我们只需要最终的结果而已)。
- 思考：作为一个优化，能否将短时间内的多次更新->缩减到1次。ok，这样就引出了上面的2个概念：
- 首先利用一定的手段将dom转成虚拟dom(对象模拟)，在一次周期(tick)内发生的所有变化，都先在构建的虚拟对象上操作，完了后再反应到真实dom。

##### 第一个问题是：一次周期(tick)怎么设计？

##### 第二个问题是：虚拟dom怎么构建，以及如何比较之间的变化？

首先看看vue中的实现：
1. 对于给定的一段html，它会先将其转成类似下面的一个render函数，并挂载在vm实例上。
2. 监听到data里边对象的变化后，调用render函数生成新的虚拟Dom。
3. 将生成的虚拟dom，与老的虚拟dom，传入patch进行比较，得到一个差值，然后，更新到页面。

```
<div id="app">
    <input type="text" v-model="message" >
    <p>{{message}}</p>
    <p>{{message}}</p>
</div>
                ↓
(function anonymous() {
  with (this) {
    return _c("div", { attrs: { id: "app" } }, [
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model",
            value: message,
            expression: "message"
          }
        ],
        attrs: { type: "text" },
        domProps: { value: message },
        on: {
          input: function($event) {
            if ($event.target.composing) return;
            message = $event.target.value;
          }
        }
      }),
      _v(" "),
      _c("p", [_v(_s(message))]),
      _v(" "),
      _c("p", [_v(_s(message))])
    ]);
  }
});

// 监视变化
vm._watcher = new Watcher(vm, function () {
   vm._update(vm._render(), hydrating);
}, noop);

// 新旧节点比较
vm.$el = vm.__patch__(prevVnode, vnode);
```

这里引出1个新问题 **diff比较算法的实现问题**。

##### ok，接下来尝试自己实现。首先，理下思路：
1. 解决构造函数问题，决定VNode实例具体要挂载哪些属性。
2. 数据变化后，我们需要一个类似render的功能函数来生成新的dom**(难点)**。
3. 还需要一个diff函数，来比较新旧虚拟dom的差异**(难点)**。
4. 将差异运用到页面上。

<br/>

- 构造函数

先从几个简单的字段开始：
1. 标签名(nodeName)
2. 节点类型(nodeType)
3. 节点文字(nodeValue)
4. 节点属性(props)
5. 子虚拟节点(children)
6. 对应的dom节点(el)

```
function VNode(nodeName, nodeType, nodeValue, props, children, el) {
    this.nodeName = nodeName;
    this.nodeType = nodeType;
    this.nodeValue = nodeValue;
    this.props = props;
    this.children = children;
    this.el = el;
}
```

- render函数
