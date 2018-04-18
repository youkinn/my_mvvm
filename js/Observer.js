

// 发布者类
function Publisher() {
    this.subs = [];
}
Publisher.prototype = {

    // 添加订阅者
    addSub: function (user) {
        this.subs.push(user);
    },

    // 发布消息
    publish: function (data) {
        this.subs.forEach(function (item){
            item.update(data);
        });
    }
};

// 订阅者类
function Subscriber(data) {
    this.walk(data);
}
Subscriber.currTarget = null;
Subscriber.prototype = {

    // 遍历对象的每个属性
    walk: function (data) {
        var keys = Object.keys(data);
        for (var i = 0, j = keys.length; i < j; i++) {
            this.defineReactive(data, keys[i], data[keys[i]]);
        }
    },

    // 重定义get/set，使得数据发生变化后获得通知
    defineReactive(data, key, value) {
        var center = new Publisher();
        Object.defineProperty(data, key, {
            get: function () {
                center.addSub(Subscriber.currTarget);
                Subscriber.currTarget = null;
                return value;
            },
            set: function (newVal) {
                // 对比旧的值，如果发生了改变，则发出通知
                if (value === newVal) {
                    return;
                }
                center.publish(newVal);
            }
        });
    },

    // 收到通知后处理
    update: function (data){
        console.log(data);
    }
};

// 天气数据
var data = {
    a: 1,
    b: 2
};
var user1 = new Subscriber(data);
Subscriber.currTarget = user1;

data.a;

data.a = '2018-04-18 晴';