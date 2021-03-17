import { isArray, isFunc, isMap, isObj, isSet, remove } from "../tools/untils.js";
import { callWithAsyncErrorHandling, callWithErrorHandling } from "./error.js";
import { effect,stop } from "./new_reactivity.js";

const INITIAL_WATCHER_VALUE = {};
let currentInstance;
export function watch(source, cb, options,instance = currentInstance) {
    return doWatch(source, cb, options,instance)
}

function doWatch(source, cb, options, instance = currentInstance) {

    let getter;
    let forceTrigger = false;

    let deep = false;
    // 获取源
    if (isObj(source)) {
        getter = () => source
        deep = true
    } else if (isArray(source)) {
        getter = () =>
            source.map(s => {
                if (isObj(s)) {
                    return traverse(s)
                } else if (isFunc(s)) {
                    return callWithErrorHandling(s, instance, "watch cleanup error", [
                        instance && (instance.proxy)
                    ])
                }
            })
    } else if (isFunc(source)) {
        if (cb) {
            getter = () =>
                callWithErrorHandling(source, instance, "watch cleanup error", [
                    instance && (instance.proxy)
                ])
        } else {
            // no cb -> simple effect
            getter = () => {
                if (instance && instance.isUnmounted) {
                    return
                }
                if (cleanup) {
                    cleanup()
                }
                return callWithErrorHandling(
                    source,
                    instance,
                    ErrorCodes.WATCH_CALLBACK,
                    [onInvalidate]
                )
            }
        }
    } else {
        getter = {}
    }
    // 如果deep开启，就将里面的值全部获取一遍
    if (cb && deep) {
        const baseGetter = getter
        getter = () => traverse(baseGetter())
    }

    //创建onstop
    let cleanup;
    const onInvalidate = (fn) => {
        cleanup = runner.opts.onStop = () => {
            callWithErrorHandling(fn, instance, "watch cleanup error")
        }
    }


    let oldValue = isArray(source) ? [] : INITIAL_WATCHER_VALUE;
    //创建effect任务
    const job = () => {
        if (!runner.active) {
            return
        }
        if (cb) {
            //通过effect获取新的值
            const newValue = runner()
            if (deep || forceTrigger || newValue !== oldValue) {
                if (cleanup) {
                    cleanup()
                }
                callWithAsyncErrorHandling(cb, instance, "watch callback error", [
                    newValue,
                    oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue,
                    onInvalidate
                ])
                //运行完callback后将新的值设为旧值
                oldValue = newValue
            }
        } else {
            runner()
        }
    }

    let scheduler = job;
    const runner = effect(getter, {
        lazy: true,
        scheduler
    })

    recordInstanceBoundEffect(runner, instance)


    if (cb) {
        oldValue = runner()
    }
    else {
        runner()
    }

    return () => {
        stop(runner)
        if (instance) {
            remove(instance.effects, runner)
        }
    }
}



// 将value里面所有的值get一遍
function traverse(value, seen = new Set()) {
    if (!isObj(value) || seen.has(value)) {
        return value
    }
    seen.add(value)
    if (isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            traverse(value[i], seen)
        }
    } else if (isSet(value) || isMap(value)) {
        value.forEach((v) => {
            traverse(v, seen)
        })
    } else {
        for (const key in value) {
            traverse(value[key], seen)
        }
    }
    return value
}