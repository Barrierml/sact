//自制的简易MVVM框架(主要借鉴的vue和react)
import initAll from "./core/init.js";
import { stop } from "./core/new_reactivity.js";
import { extend } from "./tools/untils.js";

export default class Sact {
  constructor(options) {
    this._init = initAll;
    this._init(options);
  }
  destory() {
    this.callHooks("beforeDestory");
    this.effects.forEach(v => {
      stop(v);
    });
    this.effects.length = 0;
  }


}
Sact.version = "0.1.1";

Sact.component = function (options) {
  if(!options.name){
    throw new Error("[Sact-warn]:you must set a name for component!")
  }
  let Ctor = function () { return new Sact({ ...options, isComponent: true }) }
  Ctor.sname = options.name;
  return Ctor;
}

Sact.link = function () {
  const setting = {};
  const _get = function (target, key, receiver) {
    if (key === "do") {
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