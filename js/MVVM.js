function MVVM(options) {
  var vm = this;
  var data = (vm.$data = options.data);
  vm.$el = options.el;

  // 实现 vm.xxx -> vm.$data.xxx
  Object.keys(data).forEach(function(key) {
    vm._proxyData(key);
  });

  if (options.methods) {
    initMethods(options.methods, vm);
  }

  observe(data);

  new Compiler(vm);

  return vm;
}

MVVM.prototype = {
  _proxyData: function(key, setter, getter) {
    var me = this;
    setter =
      setter ||
      Object.defineProperty(me, key, {
        configurable: false,
        enumerable: true,
        get: function proxyGetter() {
          return me.$data[key];
        },
        set: function proxySetter(newVal) {
          me.$data[key] = newVal;
        }
      });
  }
};

function observe(data) {
  return new Observe(data);
}

function initMethods(methods, vm) {
  for (var p in methods) {
    if (!methods.hasOwnProperty) {
      continue;
    }
    vm[p] = methods[p];
  }
}
