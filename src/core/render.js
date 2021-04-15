import dom from "../api/runtime-dom.js";
import Sact from "../sact.js";
import { extend, getVnodeAttr, isArray, isFunc, isObj, isString, sactWarn } from "../tools/untils.js"


const body = document.querySelector("body");

function render(vnode, container) {
    if (container) { //覆盖渲染
        let rel;
        rel = renElement(vnode);
        dom.replace(container, rel);
        vnode.context.$ele = rel;
    }
    else {
        console.warn("[Sact-warn]:", vnode);
        throw new Error("渲染vnode错误！没有真实元素存在！")
    }
}


function renderCom(vnode) {
    if (!vnode.context._mounted) { //组件初始化
        renElement(vnode);
    }
    else { //抽象组件安装
        let achorVnode = vnode.achor || vnode.parent;
        if (achorVnode) {
            let achor = getRealVnode(achorVnode);
            let rel = vnode.element || renElement(vnode);

            //防止第一个元素插入的失败
            if (achor === vnode.parent.element) {
                //修复了插入第一个元素时的偏移
                dom.insert(rel, achor, achor.firstChild);
            }
            else {
                //修复了因为job队列的刷新时机所导致的已经删除锚点问题 #2021/4/15
                if (!achor.parentElement) {
                    while (!achor.parentElement) {
                        achorVnode = achorVnode.achor;
                        achor = getRealVnode(achorVnode);
                    }
                }
                dom.insert(rel, achor.parentElement, dom.next(achor));
            }
        }
    }
}

function getRealVnode(vnode) {
    while (!vnode.element) {
        vnode = vnode.achor;
    }
    return vnode.element;
}


/**
 * 传入vnode进行渲染或者patch
 * @param {*} v1 原来的vnode
 * @param {*} v2 新的vnode
 * @param {*} container element容器
 * @returns 
 */
export function patch(v1, v2, container) {
    if (v1 === v2) {
        return;
    }
    else if (v1 && !v2) {
        destroryVnode(v1);
    }
    else if (v1 && v2 && sameNode(v1, v2)) {
        if (v2.isShow) {
            callHooks(v2, "onCreated", v1.element);
            patchVnode(v1, v2);
        }
        else if (v2.isHidden) {
            callHooks(v1, "onDestrory", v1.element, () => {
                patchVnode(v1, v2);
            })
        }
        else {
            patchVnode(v1, v2);
        }
    }
    //实例第一次生成
    else if (!v1 && v2 && container instanceof Element) {
        render(v2, container);
    }
    //组件第一次创建
    else if (!v1 && v2 && !container) {
        renderCom(v2);
    }
    //transiton 过渡，先删除旧的再生成新的
    else if (v1 && v2) {
        translate(v1, v2);
    }
    else {
        console.warn("[Sact-warn]:not aivailable Vnode", v1, v2);
    }
}


//过渡，判断是先出还是先入
function translate(v1, v2) {
    if (v1.componentOptions) {
        v1.componentOptions.Ctor.destory();
    }

    if (v1.onDestrory) {
        callHooks(v1, "onDestrory", v1.element,
            () => {
                render(v2, v1.element);
            });
        console
    }
    else {
        render(v2, v1.element);
    }
}


function patchVnode(v1, v2) {
    v2.element = v1.element;
    if (v1.tag === "_text_") {
        if (v1.text !== v2.text) {
            patchText(v2.text, v1.element);
        }
    }
    else if (v1.componentOptions && v2.componentOptions) {
        patchCompent(v1, v2);
    }
    //静态节点
    // else if (v2.type === 1) {
    //     return;
    // }
    else {
        patchAttrs(v1, v2);
        prePatchChildren(v1.children, v2.children, v1.element);
    }
    patchRefs(v1, v2);
}


function getRef(vnode) {
    return vnode.componentOptions ? vnode.componentOptions.Ctor : vnode.element;
}

function patchRefs(v1, v2) {
    const ref1 = getVnodeAttr(v1, "ref");
    const ref2 = getVnodeAttr(v2, "ref");
    const el2 = getRef(v2);
    if (ref1 && ref2) {
        if (ref1 !== ref2) {
            destroryRefs(v1);
            addRefs(v2);
        }
        else {
            destroryRefs(v1, el2);
        }
    }
}


function prePatchChildren(c1, c2, parent) {
    if ((c1 && c1.length > 0 && c2 && c2.length === 0) || (c1 && !c2)) {
        c1.forEach((child) => {
            destroryVnode(child)
        })
    }
    else if ((c1 && c1.length === 0 && c2 && c2.length > 0) || (!c1 && c2)) {
        renChildren(parent, c2)
    }
    else if (c1 && c1.length === 1 &&
        c2 && c2.length === 1 &&
        sameNode(c1[0], c2[0])
    ) {
        patchVnode(c1[0], c2[0]);
    }
    else if (c1 && c2) {
        patchChildren(parent, c1, c2);
    }
}


//更新文字
function patchText(vnode, rel) {
    rel.textContent = vnode;
}

//更新组件
function patchCompent(v1, v2) {
    let newOpts = v2.componentOptions;
    let oldOpts = v1.componentOptions
    let Ctor = (newOpts.Ctor = oldOpts.Ctor);
    //旧值
    let oldValue = [Ctor.$slot, Ctor.props];
    Ctor.$slot = renSlot(newOpts.children);
    Ctor.props = parsePropsData(Ctor, v2.data);
    //更换容器
    Ctor.wrapVnode = v2;
    //新值
    let newValue = [Ctor.$slot, Ctor.props]
    //shouldUpate
    if (Ctor.callHooks("shouldUpdate")(oldValue[1], newValue[1])) {
        if (shouldPacthComponent(oldValue, newValue)) {
            Ctor._patch();
            if (Ctor._isShowAttr) {
                setAttrs(Ctor.$ele, Ctor.props, Ctor);
            }
        }
    }
}
//判断是否应该刷新组件
function shouldPacthComponent([oldSlot, oldProps], [newSlot, newProps]) {
    if (!(oldSlot === newSlot)) {
        return true;
    }
    if (oldProps && newProps) {
        let oldKeys = Reflect.ownKeys(oldProps);
        let newKeys = Reflect.ownKeys(newProps);
        if (oldKeys.length !== newKeys.length) {
            return true;
        }
        for (let i = 0; i < oldKeys.length; i++) {
            let oldKey = oldKeys[i];
            let newKey = newKeys[i];
            if (!(oldProps[oldKey] === newProps[newKey])) {
                return true;
            }
        }
    }
    return false;
}
//更新属性
function patchAttrs(v1, v2) {
    let d1 = v1.data;
    let d2 = v2.data;
    let c;
    if (!sameAttrs(d1, d2, "class")) {
        c = d2["staticClass"] || ""
        dom.setAttribute(v1.element, "class", (c + " " + d2["class"]).trim())
    }
    else if (!sameAttrs(d1, d2, "staticClass")) {
        dom.setAttribute(v1.element, "class", d2["staticClass"])
    }
    constrast(d1.style, d2.style, "style", v1.element)
    constrast(d1.attrs, d2.attrs, "attrs", v1.element)
    constrast(d1.props, d2.props, "props", v1.element)
    constrast(d1.on, d2.on, "on", v1.element);
}

//diff算法核心 比较子数组
function patchChildren(parentEle, c1, c2) {
    vnodesTigger(c1, "onBeforeMove");
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = c1.length - 1;
    let newEndIdx = c2.length - 1;
    let oldStartNode = c1[0];
    let newStartNode = c2[0];
    let oldEndNode = c1[oldEndIdx];
    let newEndNode = c2[newEndIdx];
    // 头尾相比较,拿到中间不同的数组
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (sameNode(oldStartNode, newStartNode)) {
            patchVnode(oldStartNode, newStartNode);
            oldStartNode = c1[++oldStartIdx];
            newStartNode = c2[++newStartIdx];
        }
        else if (sameNode(oldEndNode, newEndNode)) {
            patchVnode(oldEndNode, newEndNode);
            oldEndNode = c1[--oldEndIdx];
            newEndNode = c2[--newEndIdx];
        }
        else {
            break;
        }
    }
    let c3, c4;
    //这里需要相减一是因为等号上面会多处理一次，上标会多出来一
    if (--oldStartIdx < oldEndIdx) {
        c3 = c1.slice(oldStartIdx + 1, oldEndIdx + 1);
    }
    if (--newStartIdx < newEndIdx) {
        c4 = c2.slice(newStartIdx + 1, newEndIdx + 1);
    }
    if (!c3) { c3 = [] }
    if (!c4) { c4 = [] }
    let achor;
    if (oldStartIdx === -1) {//说明需要添加的元素在头部
        achor = c1[oldEndIdx + 1] && c1[oldEndIdx + 1].element;//选取被截取列表的随后的一个元素
    }
    else {
        achor = dom.next(c1[oldStartIdx].element); //正常情况锚点选取被截取列表的前一个元素
    }
    for (let nc of c4) {
        let finded = false;
        for (let oc of c3) {
            if (!oc.patched && sameNode(nc, oc)) {
                //找到就移动元素
                dom.insert(oc.element, parentEle, achor);
                patchVnode(oc, nc);
                oc.patched = true;
                achor = dom.next(nc.element);
                finded = true;
                break;
            }
        }
        //没有找到就新建插入
        if (!finded) {
            let rel = renElement(nc)
            dom.insert(rel, parentEle, achor);
            achor = dom.next(nc.element);
        }
    }
    //删除未处理到的dom
    for (let oc of c3) {
        if (!oc.patched) {
            destroryVnode(oc)
        }
    }
    vnodesTigger(c1, "onMove");
}


function sameNode(v1, v2) {
    return (v1.tag === v2.tag && v1.key === v2.key)
}
//比较属性并更改
function constrast(la, na, key, rel) {
    let hasText = []
    if (na && la) {
        for (let newAttr of Reflect.ownKeys(na)) {
            if (!sameAttrs(na, la, newAttr)) {
                if (key === "attrs") {
                    dom.setAttribute(rel, newAttr, na[newAttr]);
                }
                else if (key === "on") {
                    resetBindListener(rel, newAttr, na[newAttr], la[newAttr]);
                }
                else if (key === "style") {
                    rel.style[newAttr] = na[newAttr];
                }
                else {
                    rel[newAttr] = na[newAttr];
                }
                hasText.push(newAttr);
            }
        }
        for (let oldAttr of Reflect.ownKeys(la)) {
            if (!sameAttrs(na, la, oldAttr) && !hasText.includes(oldAttr)) {
                if (key === "attrs") {
                    dom.removeAttribute(rel, oldAttr);
                }
                else if (key === "on") {
                    unBindListener(rel, oldAttr, la[oldAttr]);
                }
                else if (key === "style") {
                    rel.style[oldAttr] = null;
                }
                else {
                    rel[oldAttr] = null;
                }
            }
        }
    }
}
//重置绑定事件
function resetBindListener(rel, Name, newValue, oldValue) {
    unBindListener(rel, Name, oldValue);
    bindLisenter(rel, { [Name]: newValue })
}

function unBindListener(rel, Name, oldValue) {
    rel.removeEventListener(Name, oldValue._wrapper);
}


function sameAttrs(obj1, obj2, name) {
    return obj1[name] === obj2[name];
}

function renElement(vnode) {

    //文本
    if (vnode.tag === "_text_") {
        vnode.element = document.createTextNode(vnode.text);
        return vnode.element;
    }

    //组件
    if (vnode.componentOptions) {
        vnode.element = renComponent(vnode, vnode.componentOptions)
        callHooks(vnode, "onCreated", vnode.element)
        addRefs(vnode);
        return vnode.element;
    }

    //正常元素
    const { tag, data, children, key } = vnode;
    const rel = (vnode.element = dom.create(tag));

    if (data) {
        setAttrs(rel, data, vnode["context"]);
    }
    if (children) {
        renChildren(rel, children);
    }
    if (key) {
        dom.setAttribute(rel, "key", key);
    }

    vnode.element = rel;
    addRefs(vnode);

    callHooks(vnode, "onCreated", rel);
    return rel;
}

//添加ref
function addRefs(vnode) {
    const ref = getVnodeAttr(vnode, "ref");
    if (ref) {
        const el = vnode.componentOptions ? vnode.componentOptions.Ctor : vnode.element;
        const { context } = vnode;

        let oldRef = context.$refs[ref];
        if (oldRef && isArray(oldRef)) {
            oldRef.push(el);
        }
        else if (oldRef) {
            context.$refs[ref] = [oldRef, el];
        }
        else {
            context.$refs[ref] = el;
        }
    }
}

function renComponent(vnode, option) {
    let { Ctor, children } = option;
    const { key, data } = vnode;

    //渲染的时候再实例化Ctor;
    //这样可以减少很大一部分的内存占用
    Ctor = option.Ctor = Ctor();
    Ctor.wrapVnode = vnode;

    //传入store
    if (vnode.context.$store) {
        Ctor.$store = vnode.context.$store;
    }

    //传入props和插槽
    let props = parsePropsData(Ctor, data);
    Ctor.$slot = renSlot(children);

    //开始渲染
    let ele = null;
    Ctor._patch();
    Ctor._mounted = true;

    ele = Ctor.$ele;

    if (Ctor.$vnode) {
        Ctor.$vnode.parent = vnode;
    }

    if (Ctor._isShowAttr) {
        setAttrs(ele, props, Ctor);
    }

    if (key) {
        dom.setAttribute(ele, "key", key);
    }

    return ele;
}


//生成插槽
function renSlot(children) {
    let res = {};
    if (Array.isArray(children)) {
        res["default"] = children;
    }
    else {
        return undefined;
    }
    return res;
}


//转换变量名
function toCamelCase(name) {
    let l = name.split("-");
    if (l.length > 1) {
        let res = l[0];
        for (let i = 1; i < l.length; i++) {
            res += l[i].slice(0, 1).toUpperCase() + l[i].slice(1)
        }
        return res;
    }
    else {
        return name;
    }
}
//传入父组件的参数
function parsePropsData(Ctor, data) {

    //装载props
    let props = {};
    let propsCheck = Ctor.$propsCheck;
    let res = {};
    for (let i of Reflect.ownKeys(data)) {
        let attrs = data[i];
        //style 与 class除外
        if (i === "style" || i === "staticClass") {
            res[i] = attrs;
        }
        else if (isObj(attrs)) {
            for (let key of Reflect.ownKeys(attrs)) {
                let attr = attrs[key];
                key = toCamelCase(key);
                if (Ctor._propsTransfrom && attr === "") {
                    attr = true;
                }
                props[key] = attr;
            }
        }
        else {
            props[i] = attrs;
        }
    }

    //检查props
    if (propsCheck && Ctor._propsCheck) {
        for (let prop of Reflect.ownKeys(propsCheck)) {
            let checker = propsCheck[prop];
            res[prop] = checkProps(checker, props[prop], prop, Ctor.name)
        }
    }
    else if (!Ctor._propsCheck) {
        res = props;
    }
    else if (Reflect.ownKeys(props).length > 0) {
        sactWarn(`this component '${Ctor.name}' not defined props,
                    but this component was feeded in some props '${Reflect.ownKeys(props)}',this props will be not available,
                    beacuse those maybe will cause some wrong. we do not recommond`)
    }
    Ctor.props = res;
    return res;
}

//检查props正确性
function checkProps(checker, attr, key, cname) {
    let { type, validator, required } = checker;

    if (attr === undefined || attr === null) {
        return checker.default || attr;
    }

    //先判断是否为必须
    if (required && attr === undefined) {
        throw new Error(`\n[Sact-warn]:this component '${cname}',` +
            `it's prop [${key}] is required ,` +
            `but it was not feeded in a availalbe value,` +
            `please check this!`
        )
    }

    //自定义检查函数
    if (isFunc(validator) && validator(attr)) {
        return attr;
    }
    //正常类型检查
    let type_error = `\n[Sact-warn]:this component '${cname}', it's prop [${key}] should be '${String(type)}',but it was feeded in '${typeof attr}',please check this!`

    if (isString(type)) {
        if (type === "any") {
            return attr;
        }
        if (typeof attr !== type) {
            throw new TypeError(type_error)
        }
        else {
            return attr;
        }
    }
    else if (isFunc(type)) {
        if (attr instanceof type) {
            return attr;
        }
        else {
            throw new TypeError(type_error)
        }
    }
    else if (isArray(type)) {
        for (let t of type) {
            if (isString(t)) {
                if (typeof attr === t) {
                    return attr;
                }
            }
            else if (isFunc(t)) {
                if (attr instanceof t) {
                    return attr;
                }
            }
        }
        throw new TypeError(type_error)
    }
    else {
        throw new Error(`[Sact-warn]:this component '${cname}', invalidated type '${type}'`)
    }
}


function clearVnode(vnode) {
    if (vnode.componentOptions) {
        vnode.componentOptions.Ctor.destory();
    }
    vnode.children && vnode.children.forEach(e => destroryVnode(e));
    dom.remove(vnode.element);
    destroryRefs(vnode);
}


function destroryVnode(vnode) {
    if (vnode.onDestrory) {
        callHooks(vnode, "onDestrory", vnode.element, () => clearVnode(vnode));
    }
    else {
        clearVnode(vnode);
    }
}


function destroryRefs(vnode, replace) {
    const ref = getVnodeAttr(vnode, "ref");
    if (ref) {
        const el = vnode.componentOptions ? vnode.componentOptions.Ctor : vnode.element;
        const { context } = vnode;

        let oldRef = context.$refs[ref];
        if (oldRef && isArray(oldRef)) {
            const index = oldRef.indexOf(el);
            if (index > -1) {
                replace ? oldRef.splice(index, 1, replace) : oldRef.splice(index, 1);
            }
        }
        else if (oldRef) {
            replace ? context.$refs[ref] = replace : Reflect.deleteProperty(context.$refs, ref);
        }
    }
}


function isComponent(vnode) {
    return vnode.componentOptions;
}


function renChildren(rel, children) {
    if (Array.isArray(children)) {
        for (let child of children) {
            let res = renElement(child);
            if (res) {
                rel.appendChild(res);
            }
            else if (res !== undefined) {
                console.log(child, res);
                throw new Error("非法vnode！")
            }
        }
    }
}
function setAttrs(rel, data, self) {
    let c = "";
    if (!rel) {
        return;
    }
    for (let i of Reflect.ownKeys(data)) {
        switch (i) {
            case "attrs":
                setDomAttrs(rel, data[i])
                break;
            case "on":
                bindLisenter(rel, data[i], self)
                break;
            case "props":
                setPropsAttrs(rel, data[i])
                break;
            default:
                {
                    if (i === "staticClass") {
                        c += data[i] + " ";
                    }
                    else if (i === "class") {
                        c += data[i] + " ";
                    }
                    else if (i === "style") {
                        setStyle(rel, data[i]);
                    }
                    else {
                        dom.setAttribute(rel, i, data[i])
                    }
                }
        }
        if (c !== "") {
            dom.setAttribute(rel, "class", c.trim());
        }
    }
}


function setStyle(rel, style) {
    let type = typeof style;
    if (type === "object") {
        let keys = Reflect.ownKeys(style)
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            rel.style[key] = style[key];
        }
    }
}

function setPropsAttrs(rel, props) {
    for (let i of Reflect.ownKeys(props)) {
        rel[i] = props[i];
    }
}
function bindLisenter(rel, lisenters) {
    let keys = Reflect.ownKeys(lisenters)
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let handler = lisenters[key]._wrapper = function () {
            if (typeof lisenters[key] !== "function") {
                throw new Error(`${key} 不是一个合法的函数，请检查！`)
            }
            lisenters[key](...arguments);
        };
        rel.addEventListener(key, handler)
    }
}
function setDomAttrs(rel, attrs) {
    for (let i of Reflect.ownKeys(attrs)) {
        dom.setAttribute(rel, i, attrs[i])
    }
}


function vnodesTigger(vnodes, name) {
    vnodes.forEach(v => {
        callHooks(v, name, v.element)
    });
}


//触发vnode的生命周期函数
function callHooks(vnode, name, ...args) {
    if (vnode[name]) {
        vnode[name](...args)
    }
}

