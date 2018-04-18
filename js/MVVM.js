function MVVM (options){
    var vm = this;
    vm.$data = options.data;
    vm.$el = options.el;

    new Compiler(vm);
    return vm;
}