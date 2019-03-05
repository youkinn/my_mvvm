// 订阅者类定义
function Subscriber(key, handle) {
  this.handle = handle;
  Subscriber.current = this;
}

Subscriber.current = null;

Subscriber.prototype = {

  // 订阅操作
  subscribe: function (publisher){
    publisher.subs.push(this);
  },

  // 收到消息后的操作
  update: function(data) {
    this.handle(data);
  }
};