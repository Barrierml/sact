import Sact from "./sact.js";
import { isObj } from "./untils.js";
/**
 * 
 * @param {Sact} sact 要绑定的sact实例
 * @param {object} data 要响应式化数据
 * @param {object} options 配置
 * 当数据变化的时候自动通知sact的notify()函数
 */

export function reactivate(sact, data, options) {
    return new Proxy(data, {
        set(target, key, value, reciver) {
            let res = Reflect.set(target, key, value, reciver);
            trigger(target, key)//触发函数
            return res;
        },
        get(target, key, reciver) {
            const value = Reflect.get(target, key, reciver);
            track(target, key, sact) //收集依赖
            if (isObj(value) || Array.isArray(value)) {
                return reactivate(sact, value)
            }
            return value
        }
    })
}

const dep = new WeakMap(); //收集依赖的weakMap
//收集
function track(target, key, sact) {
    let depRes = dep.get(target);
    if (!depRes) {
        dep.set(target, (depRes = new Map()));
    }
    let deps = depRes.get(key);
    if (!deps) {
        depRes.set(key, (deps = new Set()));
    }
    if (sact && !deps.has(sact)) {
        deps.add(sact);
    }
}

//触发
function trigger(target, key) {
    let depRes = dep.get(target);
    if (depRes) {
        let sacts = depRes.get(key);
        //列表这个可能有个小bug暂时直接使用map里面的第一个吧
        if(sacts){
            for (let sact of sacts) {
                sact.notify && sact.notify(key);
            }
        }
    }
}