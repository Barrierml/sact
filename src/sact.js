//自制的简易MVVM框架(主要借鉴的vue)


import initAll from "./core/init.js";
import render, { _patch } from "./core/render.js";


export default class Sact {

  constructor(options) {

    this.$ele = undefined;
    initAll(this, options);
    //首次渲染
    !this.isComponent && this.render();
  }

  render() {
    this.$vnode = this._render();
    this.callHooks("beforeMount");
    render(this.$vnode, this.$ele);
    this.callHooks("mounted");
  }

  patch() {
    let oldVnode = this.$vnode;
    this.$vnode = this._render();
    this.callHooks("beforeUpdate");
    _patch(oldVnode, this.$vnode);
    this.callHooks("update");
  }


  notify() {
    this.patch();
  }

  destory(){
    this.callHooks("beforeDestory");
  }

  static component(options) {
    return function () { return new Sact({ ...options, isComponent: true }) }
  }
}