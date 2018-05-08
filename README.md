# my_mvvm

思路：

1.实现数据检测(Observe.js)
  → 接收一个对象，对象发生变化后，让我们可以知道。

2.实现订阅发布模式(Subscribe/Publish)
  → 发布者：检测到数据变化后，发出通知。
  → 订阅者：接收到"数据变化"通知后，调用自身的update方法更新dom。

3.实现编译器(Compiler.js), 处理页面上预置的命令( '{{}}'、指令、过滤器等 )。

4.实现MVVM实例(MVVM.js)，组合各部分功能。


实现第一步的重点是es5的Object.defineproperty方法，它允许我们重新定义对象的get/set方法。
→ Object.defineProperty(obj:Object, prop:String, descriptor:Object)
→ 思路是，在get中收集订阅者，在set中发布(数据发生变化的)通知。

// 核心代码
Object.defineProperty(obj, 'key', {
  get: function() {},
  set: function(newVal) {}
});


实现第二步的重点是订阅者/发布者类的实现。
  → 发布者发布消息
  → 订阅者接收并处理消息

理解了后，很好实现(10086的例子很不错)。
1.定义发布者类(Publisher), 内部维护一个订阅者数组(subs), 原型上添加发布通知方法(publish)。
2.定义订阅者类(Subscriber), 原型上添加订阅方法(subscribe)。


实现第三步的重点是遍历根节点('#app')上的所有节点，解析页面上的命令。

ng跟vue的设计很相近, 
→ ng: ng-repeat、ng-if、ng-click...
→ vue: v-for、v-if、v-click...

下面是思路：
1.遍历所有的元素节点(compileElement)
2.遍历所有元素节点上的属性节点(指令)，并执行相应操作(compileAttr)。如果不是指令，则跳过。
3.遍历所有的文本节点，找出所有的 {{}}, 替换变量(complieTemplate)。

类定义Compiler，原型上添加上述3个方法。主要难点是怎么跟订阅/发布模式关联起来。


nodeType:
ELEMENT: 1 // 元素节点
ATTRIBUTE: 2 // 属性节点
TEXT: 3 // 文本节点


实现第四步相对简单。定义MVVM类(接收options)，返回实例即可。





https://www.processon.com/diagraming/5af10271e4b02c126a5696fe