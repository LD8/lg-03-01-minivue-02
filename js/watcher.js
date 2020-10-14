/**
 * 功能
 * 当数据变化，触发依赖的notify方法，通知所有 Watcher 实例更新视图
 * 自身实例化的时候，往 Dep 中添加自己
 */
class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;

    // 将 Watcher 实例赋值给 Dep 的静态属性 target
    Dep.target = this;
    // 在调用响应式数据的 getter 时会触发 dep.addSub(Dep.target)，从而将这个 Watcher 实例添加到依赖中
    this.oldValue = vm[key];
    // 设为空好为下一个 Watcher 实例的添加做准备
    Dep.target = null;
  }

  // 在 dep 的 notify 方法被调用时才会触发这个 update 方法
  update() {
    // 触发这个方法时，vm[key] 这个值肯定已经发生了变化
    const newValue = this.vm[this.key];

    // 如何使用这个新的值取决于传入的回调函数 cb
    this.cb(newValue);
  }
}
