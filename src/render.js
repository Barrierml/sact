import dom from "./runtime-dom.js";

export default function render(vnode, container) {
    patch(null, vnode, container)
}


function patch(v1, v2, container) {
    if (v1 && v2) { //diff

    }
    else { //覆盖渲染
        let rel;
        rel = renElement(v2, container);
        dom.replace(container, rel);
    }
}
function renElement(vnode) {
    //文本
    if (typeof vnode === "string") {
        return document.createTextNode(vnode);
    }
    //组件
    if (vnode.componentOptions) {
        return renComponent(vnode, vnode.componentOptions);
    }
    //正常元素
    let { tag, data, children } = vnode;
    let rel = (vnode.element = document.createElement(tag));
    if (data) {
        setAttrs(rel, data, vnode["context"]);
    }
    if (children) {
        renChildren(rel, children);
    }
    return rel;
}
function renComponent(vnode, option) {
    let { Ctor,_render } = option;
    let ele = vnode.element = renElement(_render)
    dom.setAttribute(ele,vnode.tag,"")
    return ele;
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
            lisenters[i].apply(self, arguments);
        })
    }
}
function setDomAttrs(rel, attrs) {
    for (let i of Reflect.ownKeys(attrs)) {
        dom.setAttribute(rel, i, attrs[i])
    }
}