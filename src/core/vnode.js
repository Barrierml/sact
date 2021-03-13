

class Vnode {
    constructor(vm, a, b, c, d, istext, zid) {

        this.context = vm
        this.tag = istext ? "_text_" : a
        this.data = b
        this.componentOptions = d

        this.parent = undefined
        this.text = istext ? a : undefined
        this.key = b && b.key;

        this.element = undefined

        this.zid = zid
        this.children = genVdomChildren(c, vm, this)
    }

    getParentEle() {
        let parent = this.parent;
        while (parent && !parent.element) {
            parent = parent.parent;
        }
        return parent && parent.element;
    }
}



export function createVnode(vm, a, b, c, zid) {
    const { componentList, components } = vm;
    if (componentList && componentList.includes(a)) { //当a是自定义组件时
        return createComponent(components[a], b, vm, c, a, zid);
    }
    else if (a === "slot") {
        return createSolt(vm, b, c);
    }
    else {
        return new Vnode(vm, a, b, c, undefined, false, zid);
    }
}

function createComponent(Ctor, data, context, children, tag, zid) {
    let vnode = new Vnode(context,
        ("sact-component-" + (zid) + "-" + tag),
        data, undefined, {
        Ctor: Ctor,
        tag: tag,
        children: genVdomChildren(children),
    }, false, zid);
    return vnode
}
function createSolt(vm, data, children) {
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
    if (list) {
        for (let i of list) {
            if (Array.isArray(i)) {
                res = res.concat(genVdomChildren(i, vm, parent));
            }
            else if (typeof i === "string") {
                res.push(new Vnode(vm, i, undefined, undefined, undefined, true))
            }
            else if (i) {
                res.push(i);
            }
        }
        return res.map((v) => { v.parent = parent; return v; });
    }
}