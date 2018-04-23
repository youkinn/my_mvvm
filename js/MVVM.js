function MVVM(options) {
  debugger;
  var vm = this;
  vm.$data = options.data;
  vm.$el = options.el;

  observe(vm.$data);

  new Compiler(vm);

  return vm;
}

function observe(data) {
  return new Observe(data);
}
