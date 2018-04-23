// 发布者类
function Publisher() {
  this.subs = [];
}
Publisher.prototype = {
  
  // 发布消息
  publish: function(data) {
    this.subs.forEach(function(item) {
      item.update(data);
    });
  }
};

