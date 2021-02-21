//自制的简易MVVM框架(主要借鉴的vue)


import initAll from "./init.js";
import raise from "./vnode.js";
import render from "./render.js";


export default class Sact {

  constructor(options) {

    this.$ele = undefined;
    initAll(this, options);

    this._render();
  }

  _render() {
    if(!this.isComponent){
      let vnode =  raise(this.$createVnode,this);
      this.$vnode = vnode;
      render(vnode, this.$ele)
    }
  }
  render(){
    
  }
}