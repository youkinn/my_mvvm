// 编译器类
function Compiler(vm) {
    this.vm = vm;
    this.$el = document.querySelector(vm.$el);
    if (!this.$el) {
        console('el 不存在');
        return;
    }
    this.$fragment = this.transfrom(this.$el);  // app的一份copy，减少dom操作
    this.init(); // 这里会进行命令的解析以及替换，全部完成后反应到页面
    this.$el.appendChild(this.$fragment);
}

Compiler.prototype = {

    // 初始化
    init: function () {
        this.compileElement(this.$fragment);
    },

    // 返回app的copy
    transfrom: function (app) {
        var fragment = document.createDocumentFragment();
        var childNodes = app.childNodes;
        while (childNodes.length) {
            fragment.appendChild(childNodes[0]);
        }
        return fragment;
    },

    // 遍历元素节点
    compileElement: function (root) {
        var type = 0;
        var element = {};
        var regExp = /\{\{(.*)\}\}/;
        for (var i = 0, j = root.childNodes.length; i < j; i++) {
            element = root.childNodes[i];
            type = element.nodeType;
            switch (type) {
                case nodeType.ELEMENT:
                    // 递归遍历子节点
                    if (element.childNodes.length) {
                        this.compileElement(element);
                    }
                    // 遍历属性节点
                    if (element.attributes.length) {
                        this.compileAttr(element);
                    }
                    break;
                case nodeType.TEXT:
                    if (regExp.test(element.nodeValue)) {
                        this.complieTemplate(element);
                    }
                    break;
                default:
                    break;
            }
        }
    },

    // 遍历属性节点
    compileAttr: function (element) {
        var attr = '';
        for (var i = 0, j = element.attributes.length; i < j; i++) {
            attr = element.attributes[i];
            if (!util.isDirective(attr.name)) {
                continue;
            }
            switch (attr.name) {
                case directive.MODEL:
                    var that = this;
                    new Subscriber(attr.value, function (val) {
                        element.value = val;
                    });
                    util.addEvent(element, 'input', function (e) {
                        that.vm[attr.value] = e.target.value;
                    });
                    element.value = that.vm[attr.value];
                    break;
                default: ;
            }
        }
    },

    // 编译模板里边的{{}}
    complieTemplate: function (element) {
        var result = element.nodeValue.match(/\{\{\s*(\S*)\s*\}\}/);
        var tempValue = '';
        var nodeValue = element.nodeValue;
        if (result && result[1]) {
            new Subscriber(result[1], function (val) {
                element.nodeValue = val;
            });
            tempValue = nodeValue.replace(result[0], this.vm[result[1]]);
            element.nodeValue = tempValue;
        }
    }
};

var nodeType = {
    ELEMENT: 1, // 元素节点
    ATTRIBUTE: 2, // 属性节点
    TEXT: 3 // 文本节点
};

var directive = {
    MODEL: 'v-model'
};

// 工具类
var util = {

    // 是否指令
    isDirective: function (attrName) {
        return /^v-[\w]([\w\d_]*)$/.test(attrName);
    },

    // 事件注册
    addEvent: function (element, type, handle) {
        element.addEventListener(type, handle);
    }
}