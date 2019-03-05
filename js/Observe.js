/**
 * 数据类
 * @param {*} data
 *
 *
 */
function Observe(data) {
  if (typeof data !== "object") {
    console.log("data 不是对象");
    return;
  }
  this.walk(data);
}

Observe.prototype = {
  // 遍历对象的每个属性
  walk: function(data) {
    var keys = Object.keys(data);
    for (var i = 0, j = keys.length; i < j; i++) {
      this.defineReactive(data, keys[i], data[keys[i]]);
    }
  },

  // 重定义get/set，使得数据发生变化后获得通知
  defineReactive(data, key, value) {
    var center = new Publisher();
    Object.defineProperty(data, key, {
      get: function() {
        if (Subscriber.current) {
          Subscriber.current.subscribe(center);
          Subscriber.current = null;
        }
        return value;
      },
      set: function(newVal) {
        // 对比旧的值，如果发生了改变，则发出通知
        if (value === newVal) {
          return;
        }
        center.notify(newVal);
        // observe(newVal);
        value = newVal;
      }
    });
  }
};
