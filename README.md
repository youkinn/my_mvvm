# my_mvvm

思路：

1.实现一个观察者模式(Observer.js), 让我们可以知道数据发生了变化。
2.实现一个编译器(Compiler.js), 处理页面上预置的命令( '{{}}'、指令、过滤器等 )。
3.实现一个监视器(Watcher.js), 接收到"数据变化"这个通知后，调用自身的update方法更新dom。
4.实现一个MVVM实例(MVVM.js)，组合各部分功能，作为入口。


实现第一步的重点是es5的Object.defineproperty方法，它允许我们重新定义对象的get/set方法。
→ Object.defineProperty(obj:Object, prop:String, descriptor:Object)
→ 思路是，在get中收集订阅者，在set中发布(数据发生变化的)通知。

// 核心代码
Object.defineProperty(obj, 'key', {
  get: function() {
      // todo
  },
  set: function(newVal) {
      // 对比旧的值，如果发生了改变，则发出通知
      notify();
  }
});


实现第二步的重点是遍历所有节点，解析页面上的命令。

思路：
1.遍历所有元素节点上的属性节点(因为指令挂载在元素上)，并执行相应操作。
2.遍历所有的文本节点，找出所有的 {{}}, 替换变量。

参照ng跟vue，我们可以自行设计一些命令。这里不那么复杂，我们先只实现数据绑定({{}})。
→ ng: ng-repeat、ng-if、ng-click、etc
→ vue: v-for、v-if、v-click、etc

nodeType:
ELEMENT: 1 // 元素节点
ATTRIBUTE: 2 // 属性节点
TEXT: 3 // 文本节点
