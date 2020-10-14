/**
 * 功能
 * 手机依赖，添加观察者（watcher)
 * 通知所有观察者该更新了
 */
class Dep {
  constructor() {
    this.subs = [];
  }

  addSub(sub) {
    if (sub && sub.update) {
      this.subs.push(sub);
    }
  }

  notify() {
    this.subs.forEach((sub) => sub.update());
  }
}
