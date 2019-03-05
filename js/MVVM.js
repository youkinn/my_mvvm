function MVVM(options) {
    var vm = this;
    vm.$data = options.data;
    vm.$el = options.el;

    proxy(vm);
    new Observer(vm.$data);
    new Compiler(vm);
    return vm;
}

// 将vm上属性的读写代理到vm.$data
function proxy(vm) {
    var keys = Object.keys(vm.$data);
    var key = '';
    var value = '';
    for (var i = 0, j = keys.length; i < j; i++) {
        key = keys[i];
        value = vm.$data[key];
        Object.defineProperty(vm, key, {
            get: function (a) {
                return vm.$data[key];
            },
            set: function (newVal) {
                if (value === newVal) {
                    return;
                }
                vm.$data[key] = newVal;
            }
        });
    }
}
