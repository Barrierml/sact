import { extend, isObj } from "./untils.js";

//生成函数语法对应的vnode
export default function raise(fn, vm) {
    vm._c_ = (a, b, c) => createVnode(vm, a, b, c);
    vm._f_ = (i, f) => createFor(i, f)
    return fn.apply(vm);
}

class Vnode {
    constructor(vm, a, b, c, d) {

        this.context = vm
        this.tag = a
        this.data = b
        this.componentOptions = d

        this.parent = undefined
        this.text = undefined
        this.element = undefined

        this.children = genVdomChildren(c)
    }
}



function createVnode(vm, a, b, c) {
    const { componentList, components } = vm;
    if (componentList && componentList.includes(a)) { //当a是自定义组件时
        return createComponent(components[a], b, vm, c, a);
    }
    else {
        return new Vnode(vm, a, b, c, undefined);
    }
}

function createComponent(Ctor, data, context, children, tag) {
    let vnode = new Vnode(context,
        ("sact-component-" + (Ctor.cid) + tag),
        data, undefined, {
        Ctor: Ctor,
        tag: tag,
        children: children,
        _render: raise(Ctor.$createVnode, extend(Ctor, { props: parsePropsData(data) })),
    });
    return vnode
}

function parsePropsData(data) {
    let res = {};
    let { attrs, on, props } = data;
    for (let i of [attrs, on, props]) {
        if (isObj(i)) {
            for (let j of Reflect.ownKeys(i)) {
                res[j] = attrs[j];
            }
        }
    }
    return res;
}

function createFor(iterater, fn) {
    let res = [];
    if (Array.isArray(iterater)) {
        res = iterater.map(fn);
    }
    else if (typeof (iterater) === "object") {
        let i = 0;
        for (let j of Reflect.ownKeys(iterater)) {
            res.push(fn(j, i));
        }
    }
    else if (typeof (iterater) === "string") {
        for (let i of iterater) {
            res.push(fn(i));;
        }
    }
    return res
}
//合并生成的列表
function genVdomChildren(list) {
    let res = [];
    if (list) {
        for (let i of list) {
            if (Array.isArray(i)) {
                res = res.concat(genVdomChildren(i));
            }
            else if(i !== null){
                res.push(i);
            }
        }
        return res;
    }
}