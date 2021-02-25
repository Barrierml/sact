import { isObj } from "../tools/untils.js";
/**
 * 
 * @param {} sact 要绑定的sact实例
 * @param {} data 要响应式化数据
 * @param {} options 配置
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
        if (sacts) {
            for (let sact of sacts) {
                //将sact塞进队列,保证多次更改数据只会渲染一次
                queueNotion(sact);
            }
        }
    }
}

export function clearDep(sact){
    for(let id of Reflect.ownKeys(dep)){
        for(let key of Reflect.ownKeys(id)){
            if(id[key].has(sact)){
                id[key].delete(sact);
            }
        }
    }
}

//下面是异步刷新
//通过opentick开启队列缓冲，resetTick来清空队列
const queue = [];
let waiting = false;
let has = {};
let flushing = false;
export function openTick() { //开启数据收集
    waiting = true;
}
export function resetTick(){ //释放数据
    waiting = true
    nextTick(flushSchedulerQueue)
}
//将不同的sact放入队列
function queueNotion(sact) {
    let id = sact.cid;
    
    if(!flushing){
        if (!has[id]){
            has[id] = true;
            queue.push(sact)
        }
    }
    if (!waiting) {
        resetTick();
    }
}
//通知所有sact刷新
function flushSchedulerQueue() {
    flushing = true;
    let sact;
    for (let index = 0; index < queue.length; index++) {
        sact = queue[index];
        sact.notify && sact.notify();
    }
    //清楚数据等待下次收集
    queue.length = 0;
    waiting = false;
    flushing = false;
    has = {}
}

const callbacks = []
let pending = false



//使用nextTick 来进行异步操作
function flushCallbacks() {
    pending = false
    const copies = callbacks.slice(0)
    callbacks.length = 0
    for (let i = 0; i < copies.length; i++) {
        copies[i]()
    }
}
let timerFunc
if (typeof Promise !== 'undefined') {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
  }
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
export function nextTick(cb, ctx) {
    callbacks.push(() => {
        if (cb) {
            cb.call(ctx)
        }
    })
    if (!pending) {
        pending = true
        timerFunc()
    }
}