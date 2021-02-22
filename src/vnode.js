import { extend, isObj } from "./untils.js";

//生成函数语法对应的vnode
export default function raise(fn, vm) {
    vm._c_ = (a, b, c, zid) => createVnode(vm, a, b, c, zid);
    vm._f_ = (i, f) => createFor(i, f)
    return fn.apply(vm);
}

class Vnode {
    constructor(vm, a, b, c, d, istext,zid) {

        this.context = vm
        this.tag = istext ? "_text_" : a
        this.data = b
        this.componentOptions = d

        // this.parent = undefined
        this.text = istext ? a : undefined
        this.key = b?.key;
        this.element = undefined

        this.zid = zid
        this.children = genVdomChildren(c, vm)
    }
}



function createVnode(vm, a, b, c, zid) {
    const { componentList, components } = vm;
    if (componentList && componentList.includes(a)) { //当a是自定义组件时
        return createComponent(components[a], b, vm, c, a, zid);
    }
    else {
        return new Vnode(vm, a, b, c, undefined, false, zid);
    }
}

function createComponent(Ctor, data, context, children, tag, zid) {
    Ctor = Ctor();
    //留下组件的渲染方法的接口
    Ctor._render = () => raise(Ctor.$createVnode, extend(Ctor, { props: parsePropsData(data) }));
    let vnode = new Vnode(context,
        ("sact-component-" + (zid) + "-" + tag),
        data, undefined, {
        Ctor: Ctor,
        tag: tag,
        children: children,
    },false,zid);
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
function genVdomChildren(list, vm) {
    let res = [];
    if (list) {
        for (let i of list) {
            if (Array.isArray(i)) {
                res = res.concat(genVdomChildren(i));
            }
            else if (typeof i === "string") {
                res.push(new Vnode(vm, i, undefined, undefined, undefined, true))
            }
            else if (i !== null) {
                res.push(i);
            }
        }
        return res;
    }
}