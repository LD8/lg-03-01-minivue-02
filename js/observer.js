/**
 * 负责把 data 选项中的属性转换成响应式数据
 * data 中的某个属性也是对象，则把该属性也转换成响应式数据
 * 数据变化->发送通知 notify
 */

class Observer {
  constructor(data) {
    this.walk(data);
  }

  // 遍历所有 data 中的对象
  walk(data) {
    if (!data || typeof data !== 'object') return;
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key]);
    });
  }

  // 将某一个对象编程响应式数据
  defineReactive(obj, key, value) {
    // if (typeof value === 'object') this.walk(value);
    // 这里无需判断，在this.walk函数中已经判断过了
    this.walk(value);

    const self = this;
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 这里不能返回 obj[key]，因为会造成死递归
        // 先在 vue 实例中调用数据的 getter 然后在这里继续调用 -> 死循环
        return value;
      },
      set(newValue) {
        if (newValue === value) return;
        // 同样这里也不能使用 obj[key] = newValue
        self.walk(newValue);
        value = newValue;
        // 发送通知
      },
    });
  }
}
