//自制的简易MVVM框架(主要借鉴的vue)


import initAll from "./core/init.js";
import render, { _patch } from "./core/render.js";
import { clearDep } from "./core/reactivity.js"
import { VariableNotFoundError } from "./core/error.js"

const pluginList = [];
export default class Sact {
  //使用的插件
  constructor(options) {
    this.$ele = undefined;
    initAll(this, options);
    //首次渲染
    !this.isComponent && this.render();
  }

  getplug() {
    return pluginList;
  }

  render() {
    this.$vnode = VariableNotFoundError(() => this._render());
    this.callHooks("beforeMount");
    render(this.$vnode, this.$ele);
    this.callHooks("mounted");
  }

  patch() {
    let oldVnode = this.$vnode;
    this.$vnode = this._render(this.props);
    if (this.$vnode) {
      this.$vnode.warpSact = this;
    }
    this.callHooks("beforeUpdate");
    _patch(oldVnode, this.$vnode);
    this.callHooks("update");
  }


  notify() {
    this.patch();
  }

  destory() {
    this.callHooks("beforeDestory");
    clearDep(this);
  }
}
Sact.component = function (options) {
  return function () { return new Sact({ ...options, isComponent: true }) }
}

Sact.use = function (plugin) {
  pluginList.push(plugin);
}