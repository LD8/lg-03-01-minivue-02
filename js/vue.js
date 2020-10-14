class Vue {
  constructor(options) {
    // 1. 保存传入的数据
    this.$options = options || {};
    this.$data = options.data || {};
    this.$methods = options.methods || {};
    this.$el = typeof options.el === 'string'
      ? document.querySelector(options.el)
      : options.el;

    // 2. 把 data 中的成员转换成响应式对象（具有 getter 和 setter），并注入 Vue 实例中
    this._proxyData(this.$data);

    // 3. 调用 Observer 对象，将 this.$data 内部所有数据（递归）变为响应式数据，以便监听数据的变化
    new Observer(this.$data);

    // 4. 调用 Compiler 对象，解析指令(v-?)和插值表达式({{ xxx }})
    new Compiler(this);
  }

  // 将data中的数据代理到 Vue 实例中
  _proxyData(data) {
    // const d = new Proxy(data, {
    //   get(target, key) {
    //     return target[key]
    //   },
    //   set(target, key, newValue) {
    //     if (newValue === target[key]) return
    //     target[key] = newValue
    //     this.$el.textContent = data[key]
    //   },
    // })
    Object.keys(data).forEach((key) => {
      // 箭头函数，所以 this 仍然指向 Vue 实例
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key];
        },
        set(newValue) {
          if (newValue === data[key]) return;
          data[key] = newValue;
          // this.$el.textContent = data[key]
        },
      });
    });
  }
}
