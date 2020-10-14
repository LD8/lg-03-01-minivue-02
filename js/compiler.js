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
    console.log(Array.from(node.attributes))
    // 遍历所有的属性节点

      // 判断是否是指令
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
    }
  }

  // 判断元素是否是指令：以 'v-' 开头
  isDirective(attrName) {
    return attrName.startsWith('v-');
  }
}
