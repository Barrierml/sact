//自制的简易MVVM框架(主要借鉴的vue)


import initAll from "./core/init.js";
import render, { _patch } from "./core/render.js";
import { clearDep } from "./core/reactivity.js"
import { extend } from "./tools/untils.js";

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
    this.callHooks("beforeMount");
    if(this.render){
      this.$vnode = this._render();
      render(this.$vnode, this.$ele);
      this.callHooks("mounted");
    }
    else{
      throw new Error("渲染函数无效,请检查您输入的参数，是否存在有效的ele或者template",this.$options);
    }
  }

  patch() {
    if (!this.isComponent) {
      this.callHooks("beforeUpdate");
    }
    let oldVnode = this.$vnode;
    this.$vnode = this._render(this.props);
    if (this.$vnode) {
      this.$vnode.warpSact = this;
    }
    _patch(oldVnode, this.$vnode);
    this.callHooks("updated");
  }


  notify() {
    this.patch();
  }

  destory() {
    this.callHooks("beforeDestory");
    clearDep(this);
  }
}
Sact.__proto__.component = function (options) {
  return function () { return new Sact({ ...options, isComponent: true }) }
}

Sact.__proto__.use = function (plugin) {
  pluginList.push(plugin);
}



Sact.__proto__.link = function () {
  const setting = {};
  const _get = function (target, key, receiver) {
    if(key === "do"){
      return new Sact(setting);
    }
    return function (value) {
      if (!setting[key]) {
        setting[key] = value;
      }
      else {
        extend(setting[key], value)
      }
      return this;
    }
  }
  return new Proxy({}, { get: _get })
}