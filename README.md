### 思路：

1. 实现一个数据变化检测机制(Observer.js), 让我们可以知道数据发生了变化并自动更新dom。
2. 实现一个编译器(Compiler.js), 处理页面上预置的命令( '{{}}'、指令、过滤器等 )。
3. 实现一个MVVM实例(MVVM.js)，组合各部分功能，作为入口。

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



#### 页面渲染&指令解析

编译主要分下面2个阶段：
1. 第一次页面解析
2. 解析完成后，如果数据发生变化，自动更新dom

##### 第一阶段负责页面解析，主要包括
1.遍历所有元素节点上的属性节点(因为指令挂载在元素上)，并执行相应操作(比如遇到v-model我们将其换算为其注册input事件)。
诸多指令需要一一处理，不累赘。
2.遍历所有的文本节点，找出所有的 {{}}, 替换变量。

**！！关键点是：在合适的时机实例化订阅者**

##### 第二个阶段则主要依赖于第一个阶段实例化的订阅者传入的回调进行dom的更新

参照ng跟vue，我们可以自行设计一些命令。这里不那么复杂，我们先只实现数据绑定({{}}跟v-model)。其他的有时间再尝试。
→ ng: ng-repeat、ng-if、ng-click、etc
→ vue: v-for、v-if、v-click、etc

nodeType:
ELEMENT: 1 // 元素节点
ATTRIBUTE: 2 // 属性节点
TEXT: 3 // 文本节点
