

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
        this.subs.forEach(function (item) {
            item.update(data);
        });
    }
};

// 订阅者类
function Subscriber(exp, callback) {
    this.exp = exp;
    this.callback = callback;
    Subscriber.currTarget = this;
}
Subscriber.prototype = {
    // 收到通知后处理
    update: function (data) {
        this.callback.call(this, data);
    }
};
Subscriber.currTarget = null;

// 这里不用类也Ok，主要是执行defineReactive
function Observer(data) {
    this.walk(data);
}
Observer.prototype = {

    // 遍历对象的每个属性
    walk: function (data) {
        var keys = Object.keys(data);
        for (var i = 0, j = keys.length; i < j; i++) {
            this.defineReactive(data, keys[i], data[keys[i]]);
        }
    },

    // 重定义get/set，使得数据发生变化后获得通知
    defineReactive(data, key, value) {
        /**
         * 充当数据统筹中心，一旦data里边的数据发生变化，负责通知所有订阅它的用户
         * 理论上data上有多少个属性，就会产生多少个数据中心
         *  */
        var center = new Publisher();
        Object.defineProperty(data, key, {
            // 负责收集订阅者
            get: function (a) {
                // Subscriber.currTarget在实例化的时候被赋值为订阅者自身，不用这名字其实也ok，不过为了方便访问而已
                if (Subscriber.currTarget) {
                    center.addSub(Subscriber.currTarget);
                    Subscriber.currTarget = null;
                }
                return value;
            },

            // 负责在数据发生变化时，进行广播
            set: function (newVal) {
                // 对比旧的值，如果发生了改变，则发出通知
                if (value === newVal) {
                    return;
                }
                center.publish(newVal);
            }
        });
    }
};
