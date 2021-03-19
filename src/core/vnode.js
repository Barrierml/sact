import { isArray } from "../tools/untils.js";

export const vnodeType = {
    static: 1,
    dynamic: 2,
}



export class Vnode {
    constructor(vm, a, b, c, d, istext, zid, type) {

        this.context = vm
        this.tag = istext ? "_text_" : a
        this.data = b
        if (b && b.style) {
            b.style = renStyle(b.style);
        }
        this.componentOptions = d

        this.type = type;
        this.parent = undefined
        this.text = istext ? a : undefined
        this.key = b && b.key;

        this.element = undefined

        this.achor = undefined

        this.zid = zid
        if (!istext) {
            [this.children, type] = genVdomChildren(c, vm, this)
            if (this.type === vnodeType.static) {
                this.type = type;
            }
        }
    }

    getParentEle() {
        let parent = this.parent;
        while (parent && !parent.element) {
            parent = parent.parent;
        }
        return parent && parent.element;
    }
}



export function createVnode(vm, a, b, c, type, zid) {
    const { components } = vm;
    if (Reflect.ownKeys(components).indexOf(a) > -1) { //当a是自定义组件时
        return createComponent(components[a], b, vm, c, a, zid, type);
    }
    else if (a === "slot") {
        return createSolt(vm, b, c);
    }
    else {
        return new Vnode(vm, a, b, c, undefined, false, zid, type);
    }
}

export function createComponent(Ctor, data, context, children, tag, zid, type) {
    [children, type] = genVdomChildren(children)
    let vnode = new Vnode(context,
        ("sact-component-" + (zid) + "-" + tag),
        data, undefined, {
        Ctor: Ctor,
        tag: tag,
        children,
    }, false, zid, type);
    return vnode
}
export function createSolt(vm, data, children) {
    if (vm.$slot) {
        let slotName = data.attrs && data.attrs.name;
        if (slotName) {
            return vm.$slot[slotName] || null;
        }
        else {
            return vm.$slot["default"];
        }
    }
    else {
        return children
    }
}


export function createFor(iterater, fn) {
    let res = [];
    let type = typeof iterater;
    if (Array.isArray(iterater)) {
        res = iterater.map(fn);
    }
    else if (type === "object") {
        let i = 0;
        for (let j of Reflect.ownKeys(iterater)) {
            res.push(fn(j, i));
        }
    }
    else if (type === "string") {
        for (let i of iterater) {
            res.push(fn(i));
        }
    }
    else if (typeof (iterater) === "number") {
        for (let i = 1; i <= iterater; i++) {
            res.push(fn(i));
        }
    }
    else if (type === "number") {
        for (let i = 0; i < iterater; i++) {
            res.push(fn(i));
        }
    }
    return res
}
//合并生成的列表
function genVdomChildren(list, vm, parent) {
    let res = [];
    let typeFlag = vnodeType.static;
    let achor = parent;

    if (list) {
        for (let i of list) {
            if (Array.isArray(i)) {
                let rres = [];
                [rres, typeFlag] = genVdomChildren(i, vm, parent);

                rres && rres.forEach((v) => {
                    setAchorParent(v)
                })

                res = res.concat(rres)
            }
            else if (typeof i === "string") {
                let v = new Vnode(vm, i, undefined, undefined, undefined, true);
                setAchorParent(v);
                res.push(v)
            }
            else if (i) {
                if (i.type === vnodeType.dynamic) {
                    typeFlag = vnodeType.dynamic;
                }
                setAchorParent(i)
                res.push(i);
            }
        }
        return [res.map((v) => { v.parent = parent; return v; }), typeFlag];
    }
    return [undefined, undefined]

    function setAchorParent(vnode) {
        vnode.achor = achor;
        achor = vnode;
        vnode.parent = parent;
    }
}

function renStyle(style, seen = {}) {
    let type = typeof style;
    if (isArray(style)) {
        for (let i = 0; i < style.length; i++) {
            renStyle(style[i], seen);
        }
    }
    else if (type === "object") {
        let keys = Reflect.ownKeys(style)
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            seen[key] = style[key];
        }
    }
    else if (type === "string") {
        style.split(";").forEach((v) => {
            let value = v.split(":")
            if (value.length === 2) {
                seen[value[0]] = value[1];
            }
        })
    }
    return seen;
}