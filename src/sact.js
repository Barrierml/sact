//自制的简易MVVM框架(主要借鉴的vue)


import initAll from "./init.js";
import render, { _patch } from "./render.js";


export default class Sact {

  constructor(options) {

    this.$ele = undefined;
    initAll(this, options);
    //首次渲染
    !this.isComponent && this.render();
  }

  render() {
    this.$vnode = this._render();
    render(this.$vnode, this.$ele);
  }

  patch() {
    let oldVnode = this.$vnode;
    this.$vnode = this._render();
    _patch(oldVnode, this.$vnode);
  }


  notify() {
    this.patch();
  }

  static component(options) {
    return function () { return new Sact({ ...options, isComponent: true }) }
  }
}