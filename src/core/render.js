import dom from "../api/runtime-dom.js";
import { openTick, resetTick } from "./reactivity.js"
import { extend, isObj } from "../tools/untils.js"



export default function render(vnode, container) {
    if (container) { //覆盖渲染
        let rel;
        rel = renElement(vnode);
        dom.replace(container, rel);
    }
    else { //出现这种情况只能是自定义render之前是空，现在有渲染结果了
        let warp = vnode.warpSact.wrapVnode;
        let parentEle = warp.getParentEle();
        let rel = vnode.element || renElement(vnode);
        let index = warp.parent.children.indexOf(warp) - 1;
        let achor = warp.parent.children[index].element;
        dom.insert(rel, parentEle, dom.next(achor));
    }
}


export function _patch(v1, v2) {
    if (v1 === v2) {
        return;
    }
    else if (v1 && !v2) {
        destroryVnode(v1);
    }
    else if (sameNode(v1, v2)) {
        patchVnode(v1, v2);
    }
    else {
        render(v2, v1.element);
    }
}

function patchVnode(v1, v2) {
    if (v1.tag === "_text_") {
        if (v1.text !== v2.text) {
            patchText(v2.text, v1.element);
        }
    }
    else if (v1.componentOptions && v2.componentOptions) {
        patchCompent(v1, v2);
    }
    else {
        patchAttrs(v1, v2);
        prePatchChildren(v1.children, v2.children, v1.element);
    }
    v2.element = v1.element;
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
    //保存旧值
    let oldValue = [Ctor.$slot, Ctor.props];
    Ctor.$slot = renSlot(newOpts.children);
    Ctor.props = parsePropsData(Ctor, v2.data);
    //生成新值
    let newValue = [Ctor.$slot, Ctor.props]
    if (shouldPacthComponent(oldValue, newValue)) {
        Ctor.patch();
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
    if (!sameAttrs(d1, d2, "style")) {
        setStyle(v1.element, d2["style"]);
    }
    constrast(d1.attrs, d2.attrs, "attrs", v1.element)
    constrast(d1.props, d2.props, "props", v1.element)
    constrast(d1.on, d2.on, "on", v1.element);
}

//diff算法核心 比较子数组
function patchChildren(parentEle, c1, c2) {
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
}


function sameNode(v1, v2) {
    return (v1.tag === v2.tag && v1.key === v2.key)
}
function isComponent(v1, v2) {
    return (v1.componentOptions && v2.componentOptions)
}

//判断
function sameData(d1, d2, key) {
    if (d1 && d2) {
        for (let newAttr of Reflect.ownKeys(d2)) {
            if (!sameAttrs(d1, d2, newAttr)) {
                if (key === "attrs") {
                    dom.setAttribute(rel, newAttr, na[newAttr]);
                }
                else {
                    rel[newAttr] = na[newAttr];
                }
                hasText.push(newAttr);
            }
        }
        return true;
    }
    return false;
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
                    unBindListener(rel, newAttr, la[newAttr]);
                }
                else {
                    rel[newAttr] = null;
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
        return renComponent(vnode, vnode.componentOptions);
    }
    //正常元素
    let { tag, data, children, key } = vnode;
    let rel = (vnode.element = document.createElement(tag));
    if (data) {
        setAttrs(rel, data, vnode["context"]);
    }
    if (children) {
        renChildren(rel, children);
    }
    if (key) {
        dom.setAttribute(rel, "key", key)
    }
    vnode.element = rel;
    return rel;
}
function renComponent(vnode, option) {
    let { Ctor, children } = option;
    let { key, data } = vnode;
    //渲染的时候再实例化Ctor;
    //这样可以减少很大一部分的内存占用
    Ctor = option.Ctor = Ctor();
    Ctor.wrapVnode = vnode;
    //传入props和插槽
    let props = parsePropsData(Ctor, data);
    Ctor.$slot = renSlot(children);
    //开始渲染
    let ele = null;
    Ctor.callHooks("beforeMount");
    let node = Ctor.$vnode = Ctor._render(props);
    if (node) {
        ele = Ctor.$ele = Ctor.$vnode.element = vnode.element = renElement(node);
        dom.setAttribute(ele, vnode.tag, "")
        if (key) {
            dom.setAttribute(ele, "key", key)
        }
    }
    Ctor.callHooks("mounted");
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

//传入父组件的参数
function parsePropsData(Ctor, data) {
    let Cprops = Ctor.props;
    let res = extend({}, Cprops);
    let { attrs, on, props } = data;
    for (let i of [attrs, on, props]) {
        if (isObj(i)) {
            for (let j of Reflect.ownKeys(i)) {
                //如果原来的props存在并且是函数的情况下传入新参数
                res[j] = i[j]
            }
        }
    }
    Ctor.props = res;
    return res;
}

function destroryVnode(vnode) {
    if (vnode.componentOptions) {
        vnode.componentOptions.Ctor.destory();
    }
    dom.remove(vnode.element);
}

function renChildren(rel, children) {
    if (Array.isArray(children)) {
        for (let child of children) {
            let res = renElement(child);
            if (Array.isArray(res)) {
                res.map((v) => {
                    rel.appendChild(v);
                })
            }
            else if (res) {
                rel.appendChild(res);
            }
        }
    }
}
function setAttrs(rel, data, self) {
    let c = "";
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
    if(Array.isArray(style)){
        for(let i = 0;i<style.length;i++){
            if(typeof style[i] === "object"){
                setStyle(rel,style[i]);
            }
            else{
                throw new Error(`${i} 并不是一个对象！`);
            }
        }
    }
    else if (type === "object") {
        let keys = Reflect.ownKeys(style)
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            rel.style[key] = style[key];
        }
    }
    else if (type === "string") {
        rel.style = style;
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
            openTick();
            lisenters[key](...arguments);
            resetTick();
        };
        rel.addEventListener(key, handler)
    }
}
function setDomAttrs(rel, attrs) {
    for (let i of Reflect.ownKeys(attrs)) {
        dom.setAttribute(rel, i, attrs[i])
    }
}