class Vue {
  constructor(options) {
    // 1. 保存传入的数据
    this.$options = options || {};
    this.$data = options.data || {};
    this.$el = typeof options.el === 'string'
      ? document.querySelector(options.el)
      : options.el;

    // 2. 把 data 中的成员转换成响应式对象（具有 getter 和 setter），并注入 Vue 实例中
    this._proxyData(this.$data);

    // 3. 调用 observer 对象（也就是 Dependency 发布者对象），监听数据的变化
    // 4. 调用 compiler 对象，解析指令(v-?)和插值表达式({{ xxx }})
  }

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
