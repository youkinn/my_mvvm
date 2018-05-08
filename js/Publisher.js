// 发布者类
function Publisher() {
  this.subs = [];
}
Publisher.prototype = {
  
  // 通知订阅者
  notify: function(data) {
    this.subs.forEach(function(item) {
      item.update(data);
    });
  }
};

