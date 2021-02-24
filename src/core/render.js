import dom from "../api/runtime-dom.js";
import { openTick, resetTick } from "./reactivity.js"
import raise from "./vnode.js"
import { isObj } from "../tools/untils.js"
//覆盖渲染
export default function render(vnode, container) {
    let rel;
    rel = renElement(vnode);
    dom.replace(container, rel);
}


export function _patch(v1, v2) {
    if (sameNode(v1, v2)) {
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
        if (v1.children && !v2.children) {
            for (let child of v1.children) {
                dom.remove(child.element);
            }
        }
        else if (!v1.children && v2.children) {
            for (let child of v2.children) {
                v2.children.push(renElement(child));
            }
        }
        else if (v1.children?.length === 1 &&
            v2.children?.length === 1 &&
            sameNode(v1.children[0], v2.children[0])
        ) {
            patchVnode(v1.children[0], v2.children[0]);
        }
        else if(v1.children && v2.children) {
            patchChildren(v1, v2);
        }
    }
    v2.element = v1.element;
}

//更新文字
function patchText(vnode, rel) {
    rel.textContent = vnode;
}

//更新组件
function patchCompent(v1, v2) {
    let p1 = v1.data;
    let p2 = v2.data;
    let Ctor1 = v1.componentOptions.Ctor;
    if (p1, p2) {
        //props不同则调用ctor进行自我更新
        Ctor1.patch();
        v2.componentOptions.Ctor = Ctor1;
    }
}

//更新属性
function patchAttrs(v1, v2) {
    let d1 = v1.data;
    let d2 = v2.data;
    if (!sameAttrs(d1, d2, "class")) {
        dom.setAttribute(v1.element, "class", d2["class"])
    }
    if (!sameAttrs(d1, d2, "style")) {
        dom.setAttribute(v1.element, "style", d2["style"])
    }
    constrast(d1.attrs, d2.attrs, "attrs", v1.element)
    constrast(d1.props, d2.props, "props", v1.element)
}

//diff算法核心 比较子数组
function patchChildren(v1, v2) {
    let parentEle = v1.element;
    let c1 = v1.children;
    let c2 = v2.children;
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
    //锚点是被截取列表的前一个元素
    let achor = c1[oldStartIdx];
    for (let nc of c4) {
        let finded = false;
        for (let oc of c3) {
            if (!oc.patched && sameNode(nc, oc)) {
                //找到就移动元素
                dom.insert(oc.element, parentEle, dom.next(achor.element));
                //如果是组件还需要更新核心
                if(isComponent(nc,oc)){
                    nc.componentOptions.Ctor = oc.componentOptions.Ctor;
                }
                nc.element = oc.element;
                oc.patched = true;
                achor = nc;
                finded = true;
                break;
            }
        }
        //没有找到就新建插入
        if (!finded) {
            let rel = renElement(nc)
            dom.insert(rel, parentEle, dom.next(achor.element));
            achor = nc;
        }
    }
    //删除未处理到的dom
    for (let oc of c3) {
        if (!oc.patched) {
            dom.remove(oc.element);
        }
    }
}


function sameNode(v1, v2) {
    return (v1?.tag === v2?.tag && v1?.key === v2?.key)
}
function isComponent(v1,v2){
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
function constrast(na, la, key, rel) {
    let hasText = []
    if (na && la) {
        for (let newAttr of Reflect.ownKeys(na)) {
            if (!sameAttrs(na, la, newAttr)) {
                if (key === "attrs") {
                    dom.setAttribute(rel, newAttr, na[newAttr]);
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
                else {
                    rel[newAttr] = null;
                }
            }
        }
    }
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
        dom.setAttribute(ele, "key", key)
    }
    vnode.element = rel;
    return rel;
}
function renComponent(vnode, option) {
    let { Ctor } = option;
    let { key, data } = vnode;
    //渲染的时候再实例化Ctor;
    //这样可以减少很大一部分的内存占用
    Ctor = option.Ctor = Ctor();
    parsePropsData(Ctor, data);
    //包装组件的渲染方法的接口
    Ctor._render = () => raise(Ctor.$createVnode, Ctor);
    //开始渲染
    let node = Ctor.$vnode = Ctor._render();
    let ele = Ctor.$ele = Ctor.$vnode.element = vnode.element = renElement(node);
    dom.setAttribute(ele, vnode.tag, "")
    if (key) {
        dom.setAttribute(ele, "key", key)
    }
    return ele;
}


//传入父组件的参数
function parsePropsData(Ctor, data) {
    let Cprops = Ctor.props;
    if (!Cprops) {
        Ctor.props = Cprops = {};
    }
    let { attrs, on, props } = data;
    for (let i of [attrs, on, props]) {
        if (isObj(i)) {
            for (let j of Reflect.ownKeys(i)) {
                Cprops[j] = attrs[j];
            }
        }
    }
    return Cprops;
}

function renChildren(rel, children) {
    if (Array.isArray(children)) {
        for (let child of children) {
            rel.appendChild(renElement(child));
        }
    }
}
function setAttrs(rel, data, self) {
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
                dom.setAttribute(rel, i, data[i])
        }
    }
}
function setPropsAttrs(rel, props) {
    for (let i of Reflect.ownKeys(props)) {
        rel[i] = props[i];
    }
}
function bindLisenter(rel, lisenters, self) {
    for (let i of Reflect.ownKeys(lisenters)) {
        rel.addEventListener(i, function () {
            if (typeof lisenters[i] !== "function") {
                throw new Error(`${i} 不是一个合法的函数，请检查！`)
            }
            openTick();
            lisenters[i].apply(self, arguments);
            resetTick();
        })
    }
}
function setDomAttrs(rel, attrs) {
    for (let i of Reflect.ownKeys(attrs)) {
        dom.setAttribute(rel, i, attrs[i])
    }
}