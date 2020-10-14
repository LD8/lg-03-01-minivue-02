/**
 * 负责编译模板，解析指令/插值表达式
 * 负责页面的首次渲染
 * 当数据变化后重新渲染视图
 *
 * 这里简化了操作，没有使用虚拟 DOM 进行操作
 */

class Compiler {
  // 编译器接收一个 Vue 实例作为参数
  constructor(vm) {
    // 存储参数方便下面使用
    this.el = vm.$el;
    this.vm = vm;
    this.compile(this.el);
  }

  // 判断该节点是否为 文本 节点
  // 节点都有 nodeType 属性， 3 为文本节点
  isTextNode(node) {
    return node.nodeType === 3;
  }

  // 判断该节点是否为 元素 节点
  // 节点都有 nodeType 属性， 1 为元素节点
  isElementNode(node) {
    return node.nodeType === 1;
  }

  // 遍历 el 这个 DOM 对象下的所有节点，判断是文本节点（解析插值表达式）还是元素节点（解析指令）
  compile(el) {
    // 获取所有子节点
    const { childNodes } = el;

    // 转换伪数组为数组 Array.from()，然后进行遍历，注意使用箭头函数不改变 this 的指向
    Array.from(childNodes).forEach((node) => {
      // 什么节点，运行什么方法进行编译
      if (this.isTextNode(node)) this.compileText(node);
      if (this.isElementNode(node)) this.compileElement(node);

      // 判断该 node 是否还有子节点（用 node.childNodes 和个数来判断）
      if (node.childNodes && node.childNodes.length) this.compile(node);
    });
  }

  // 解析元素中的指令
  compileElement(node) {
    // console.log(Array.from(node.attributes));
    // 遍历所有的属性节点
    Array.from(node.attributes).forEach((attr) => {
      // 判断是否是指令
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        // 去掉"v-"只保留 'text' / 'model'
        attrName = attrName.substr(2);
        // console.log(attrName);
        // 取得指令对应的值，也就是data中的key
        const key = attr.value;
        this.update(node, key, attrName);
      }
    });
  }

  update(node, key, attrName) {
    if (attrName.startsWith('on')) {
      this.onUpdater(node, this.vm.$methods[key], attrName.substr(3));
    } else {
      const updater = this[`${attrName}Updater`];
      updater && updater.call(this, node, this.vm[key], key);
    }
  }

  textUpdater(node, value, key) {
    node.textContent = value;
    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue;
    });
  }

  modelUpdater(node, value, key) {
    // 设置表单元素的值使用表单node的value参数赋值
    node.value = value;
    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue;
    });
    // 双向绑定
    node.addEventListener('input', () => {
      this.vm[key] = node.value;
    });
  }

  // ------------------------- 作业 v-html -------------------------
  htmlUpdater(node, value) {
    // 将html字符串转换成dom，并从dom中获取所有子节点
    const children = new DOMParser()
      .parseFromString(value, 'text/html')
      .body.childNodes;

    // 遍历所有子节点并 append 在 node 上
    Array.from(children)
      .forEach((child) => node.appendChild(child));
  }

  // ------------------------- 作业 v-on -------------------------
  onUpdater(node, method, eventName) {
    // 为节点增加事件
    node.addEventListener(eventName, method);
    // 移除无用属性使节点更干净
    node.removeAttribute(`v-on:${eventName}`);
  }

  // 解析插值表达式
  compileText(node) {
    // console.dir(node); // 将 node 以对象的形式打印出来

    const value = node.textContent;
    // console.log(text)

    // 用 RegEx 匹配 {{ msg }}
    const reg = /\{\{(.+?)\}\}/;

    if (reg.test(value)) {
      // 遍历上面 if 中匹配到的所有的值，进行替换
      const key = RegExp.$1.trim();
      // console.log(key)
      // node.textContent = this.vm[key]
      // 上面不行是因为会替换掉所有 node 中的内容，起不到「插值」的作用
      node.textContent = value.replace(reg, this.vm[key]);

      // 创建 Watcher 实例，注册更新
      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue;
      });
    }
  }

  // 判断元素是否是指令：以 'v-' 开头
  isDirective(attrName) {
    return attrName.startsWith('v-');
  }
}
