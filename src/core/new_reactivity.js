import { isObj, hasOwn, isIntegerKey, isArray, isMap } from "../tools/untils.js";
import { queueJob } from "./scheduler.js";

//watch 就是一个单纯的


//重构的reactive
const ITERATE_KEY = Symbol('')
const MAP_KEY_ITERATE_KEY = Symbol('')
let effectId = 0;
//effect的栈
const effectStack = [];
let activeEffect;
/**
 * Effect 一个副作用函数，使用此函数时会产生一些副作用，比如说函数内获取用户的信息，去渲染一个用户信息页面
 * 这也是它的主要用途，它会在执行的中间打开一个运行栈，在依赖中收集所有用到的数据，然后当这些依赖的数据发生
 * 变化的时候，就会再次调用它自己，来达到（数据变化—>重新渲染视图）这个循环。
 * @param {*} fn 副作用的函数
 * @param {*} opts 参数 
 */
export function effect(fn, opts) {
    if (isEffect(fn)) {
        fn = fn.raw
    }
    if (!opts) {
        opts = {};
    }
    const _effect = createEffect(fn, opts);
    if (!opts.lazy) {
        _effect()
    }
    return _effect;
}

/**
 * 将fn与参数包装成一个新的Effect
 * @param {*} fn 
 * @param {*} opts 
 */
function createEffect(fn, opts) {
    let effect = function _createEffect() {
        console.log(...arguments)
        if (!effect.active) {
            return options.scheduler ? undefined : fn()
        }
        //队列内不存在就加入队列
        if (effectStack.indexOf(effect) === -1) {
            cleanup(effect)
            try {
                effectStack.push(effect);
                activeEffect = effect;
                return fn(...arguments);
            }
            finally {
                effectStack.pop();
                activeEffect = effectStack[effectStack.length - 1]
            }
        }
    }

    //初始化属性
    effect.id = effectId++;
    effect.raw = fn;
    effect.opts = opts;
    effect._isEffect = true;
    effect.active = true;
    effect.deps = [];
    return effect;
}

export function stop(effect) {
    if (effect.active) {
        cleanup(effect)
        if (effect.options.onStop) {
            effect.options.onStop()
        }
        effect.active = false
    }
}

function cleanup(effect) {
    const { deps } = effect
    if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
            deps[i].delete(effect)
        }
        deps.length = 0
    }
}

function isEffect(effect) {
    return effect && effect._isEffect
}


const dep = new WeakMap(); //收集依赖的weakMap

//收集
export function track(target, key) {

    if (activeEffect === undefined) {
        //不存在则不需要收集
        return;
    }

    let depRes = dep.get(target);
    if (!depRes) {
        dep.set(target, (depRes = new Map()));
    }

    let deps = depRes.get(key);
    if (!deps) {
        depRes.set(key, (deps = new Set()));
    }

    if (!deps.has(activeEffect)) {
        deps.add(activeEffect);
        activeEffect.deps.push(deps)
        //触发收集钩子
        if (activeEffect.opts.onTrack) {
            activeEffect.opts.onTrack(
                activeEffect,
                target,
                key
            )
        }
    }
}

//触发
export function trigger(target, type, key, newValue, oldValue) {
    const depsMap = dep.get(target);
    if (!depsMap) {
        return;
    }
    const effects = new Set();
    const add = (needAddEffects) => {
        if (needAddEffects) {
            needAddEffects.forEach(effect => {
                if (effect !== activeEffect) {
                    effects.add(effect);
                }
            });
        }
    }

    if (key !== void 0) {
        add(depsMap.get(key))
    }

    switch (type) {
        case setType.ADD:
          if (!isArray(target)) {
            add(depsMap.get(ITERATE_KEY))
          } else if (isIntegerKey(key)) {
            // new index added to array -> length changes
            add(depsMap.get('length'))
          }
          break
        case setType.DELETE:
          if (!isArray(target)) {
            add(depsMap.get(ITERATE_KEY))
          }
          break
      }


    const run = (effect) => {
        let job = () => { };
        if (effect.opts.onTrigger) {
            effect.opts.onTrigger({
                effect,
                target,
                key,
                type,
                newValue,
                oldValue
            })
        }
        if (effect.opts.scheduler) {
            job = () => effect.opts.scheduler(effect)
        } else {
            job = () => effect()
        }
        job.id = effect.id;
        queueJob(effect);
    }
    effects.forEach(run)
}

export function recordInstanceBoundEffect(effect, instance) {
    if (instance) {
        (instance.effects || (instance.effects = [])).push(effect)
    }
}


// -----------------------------------------------------------------------
const proxyMap = new WeakMap(); // 保存代理的原数据

/**
 * 将数据响应化
 * @param {*} data 
 */
export function reactive(target) {
    if (!isObj(target)) {
        console.warn("[Sact-warn]:target must a object",target)
        throw new Error("reactive 传入的参数必须是个对象！")
    }
    const existingProxy = proxyMap.get(target)
    if (existingProxy) {
        return existingProxy
    }
    let proxy = new Proxy(target, {
        get: createGetter,
        set: createSetter,
        deleteProperty: createDeleter,
    })
    proxyMap.set(target, proxy)
    return proxy;
}

/**
 * 数据收集者
 * @param {*} params 
 */
function createGetter(target, key, reciver) {
    let res = Reflect.get(target, key, reciver);
    track(target, key);
    return isObj(res) ? reactive(res) : res;
}




const setType = {
    SET: 1,
    ADD: 1 << 1,
    DELETE: 1 << 2,
}
/**
 * 设置属性时
 * @param {} params 
 */
function createSetter(target, key, value, reciver) {
    const oldValue = target[key];
    const hadKey = hasOwn(target, key)
    const res = Reflect.set(target, key, value, reciver);
    if (!hadKey) {
        trigger(target, setType.ADD, key, value)
    } else if (value !== oldValue) {
        trigger(target, setType.SET, key, value, oldValue)
    }
    return res;
}

/**
 * 删除属性时
 * @param {*} target 
 * @param {*} key 
 * @returns 
 */

function createDeleter(target, key) {
    let res = Reflect.deleteProperty(target, key);
    trigger(target, setType.delete, key);
    return res;
}
