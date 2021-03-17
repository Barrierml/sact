import { isFunc, isPromise } from "../tools/untils.js"

export function callWithErrorHandling(fn, instance, type, args) {
    let res
    try {
        res = args ? fn(...args) : fn()
    } catch (err) {
        handleError(err, instance, type)
    }
    return res
}

export function callWithAsyncErrorHandling(fn, instance, type, args) {
    if (isFunc(fn)) {
        const res = callWithErrorHandling(fn, instance, type, args)
        if (res && isPromise(res)) {
            res.catch(err => {
                handleError(err, instance, type)
            })
        }
        return res
    }
    const values = []
    for (let i = 0; i < fn.length; i++) {
        values.push(callWithAsyncErrorHandling(fn[i], instance, type, args))
    }
    return values
}

export function handleError(err, instance, type, throwInDev = true) {
    const contextVNode = instance ? instance.$vnode : null
    logError(err, type, contextVNode, throwInDev)
}

function logError(err, type, contextVNode, throwInDev = true) {
    console.error(err)
}