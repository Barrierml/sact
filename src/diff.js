//当前对应的真实dom，最后一次渲染的虚拟dom，最新的newdom

//先判断整个元素是否相同，比较标签和属性，
//      属性变化则更新属性
//      如果在新的里面找不到，则打上要删除的标记
//      如果在旧的里面找不到，则进行占位，在最后整理的阶段再创建新元素
//再开始遍历子元素数组，同上步骤
//用一个真实dom代替另一个
const needReplaceName = {
    "staticClass": "class",
}

const state = {
    origin: -1,
    create: 1,
    attrsupdata: 2,
    delete: 3,
    textChange: 5,
    move: 6,
    forChange: 7,
}

const textSame = 10;
const textDiff = 11;

function replaceList(n) {
    return needReplaceName[n] || n;
}
export function diffAndUpdata(sact, LastView, NewView) {
    let rel = sact.isSact || sact.isComponent ? sact.realElement : sact.realElement;
    sact = sact.isSact || sact.isComponent ? sact.sact : sact;
    let [ldom, ndom] = [LastView, NewView];

    let isSameTag = sameTag(ldom, ndom);

    if (isSameTag) {
        //返回了需要修改的属性和内容
        let setAttrs = diffAttrs(ldom.attrs, ndom.attrs);
        if (setAttrs) {
            dealAttrs(rel, ldom, setAttrs);
        }
        //返回了需要更改的dom和mark过的标记
        let setActions = diffChildren(ldom.children, ndom.children);
        if (setActions) {
            dealChildren(rel.childNodes, ldom.children, setActions, rel,sact);
        }
    }
}

//判断是否为同一个标签
function sameTag(lv, nv) {
    if (lv.tagName && nv.tagName && (lv.tagName === nv.tagName)) {
        return true;
    }
    else if (typeof nv === "string" && typeof lv === "string") {
        if (lv === nv) {
            return textSame
        }
        return textDiff;
    }
    return false;
}

//返回需要设置和删除的属性
function diffAttrs(lv, nv) {
    let hasChange = false;
    let setlist = [], dellist = [];
    if (!sameAttrs(lv, nv, "class")) {
        push("class", "class", nv["class"]);
    }
    constrast(nv.attrs, lv.attrs, "attrs")
    constrast(nv.props, nv.props, "props")
    function constrast(na, la, key) {
        let hasText = []
        if (na && la) {
            for (let newAttr of Reflect.ownKeys(na)) {
                if (!sameAttrs(na, la, newAttr)) {
                    push(key, newAttr, na[newAttr])
                    hasText.push(newAttr);
                }
            }
            for (let oldAttr of Reflect.ownKeys(la)) {
                if (!sameAttrs(na, la, oldAttr) && !hasText.includes(oldAttr)) {
                    del(key, oldAttr)
                }
            }
        }
    }
    return hasChange ? [setlist, dellist] : false


    function sameAttrs(obj1, obj2, name) {
        return obj1[name] === obj2[name];
    }
    function push(type, name, value) {
        hasChange = true
        setlist.push({
            type, name, value
        })
    }
    function del(type, name) {
        hasChange = true
        dellist.push({
            type, name
        })
    }
}



function diffChildren(lastChildren, newChildren) {
    //虚拟dom数组和指针
    let [ll, nl, lindex, nindex] = [lastChildren, newChildren, 0, 0]
    //保存要更改结果集
    let p = [];

    //标记判断是否被处理过
    let Marks = [];
    for (let i = 0; ll && i < ll.length; i++) {
        Marks.push(false);
    }

    while (nl && ll && nl[nindex] && ll[lindex]) {
        let tagRes = sameTag(nl[nindex], ll[lindex]);
        if (tagRes === true) {
            //匹配属性是否变化
            let attrRes = diffAttrs(nl[nindex].attrs, ll[lindex].attrs);
            //递归子元素
            let childRes = diffChildren(ll[lindex].children, nl[nindex].children)
            if (!attrRes) {
                p.push({
                    action: state.origin,
                    index: lindex,
                    childRes,
                })
            }
            else {
                p.push({
                    action: state.attrsupdata,
                    index: lindex,
                    data: attrRes,
                    childRes
                })
            }
            Marks[lindex] = true;
            advance(1, 1);
        }
        else if (tagRes === textSame) { //文字相同
            Marks[lindex] = true;
            p.push({
                action: state.origin,
                index: lindex
            })
            advance(1, 1);
        }
        else if (tagRes === textDiff) { //文字不同
            Marks[lindex] = true;
            p.push({
                action: state.textChange,
                index: lindex,
                data: nl[nindex]
            })
            advance(1, 1);
        }
        //for处理
        else if (Array.isArray(nl[nindex]) && Array.isArray(ll[lindex])) {
            let [lfor, nfor] = [ll[lindex], nl[nindex]];
            let forRes = diffChildren(lfor, nfor)
            if (forRes) {
                p.push({
                    action: state.forChange,
                    index: nindex,
                    data: forRes,
                    count: ll[lindex].length,
                })
            }
            Marks[lindex] = true
            advance(1, 1);
        }
        else {
            //在原来数组内寻找
            for (let ldom = 0; ldom < ll.length; ldom++) {
                //没有被遍历过，并且标签和属性相同
                if (!Marks[ldom] === true &&
                    sameTag(nl[nindex], ll[ldom]) &&
                    !(diffAttrs(nl[nindex], ll[ldom]))) {
                    Marks[ldom] = true;
                    let childRes = diffChildren(ll[lindex].children, nl[nindex].children)
                    p.push({
                        action: state.move,
                        from: ldom,
                        to: nindex,
                        childRes
                    })
                    break;
                }
            }
            //没有匹配元素，则新建
            p.push({
                action: state.create,
                index: nindex,
                data: nl[nindex]
            })
            advance(1, 1);
        }
    }
    //将新dom里剩下多出来的元素直接创建
    if (nl && nindex < nl.length) {
        while (nl[nindex]) {
            p.push({
                action: state.create,
                index: nindex,
                data: nl[nindex]
            })
            advance(0, 1)
        }
    }
    //将旧dom里剩余的删除
    if (ll && lindex < ll.length) {
        for (let i = 0; i < ll.length; i++) {
            if (!Marks[i]) {
                p.push({
                    action: state.delete,
                    index: i
                })
            }
        }
    }
    return p;
    function advance(a, b) {
        lindex += a;
        nindex += b;
    }
}


function dealAttrs(rel, vdom, list) {
    let [setAttrList, delAttreList] = list;
    //重新设置属性
    if (setAttrList) {
        for (let attr of setAttrList) {
            switch (attr.type) {
                case "class":
                    {
                        vdom["attrs"]["class"] = attr.value;
                        updataAttr(rel, attr.name, attr.value);
                        break;
                    }
                case "attrs":
                    {
                        vdom["attrs"]["attrs"][attr.name] = attr.value;
                        updataAttr(rel, attr.name, attr.value);
                        break;
                    }
                case "props":
                    {
                        vdom["attrs"]["props"][attr.name] = attr.value;
                        rel[attr.name] = attr.value;
                        break;
                    }
            }
        }
    }
    if (delAttreList) {
        for (let attr of delAttreList) {
            switch (attr.type) {
                case "class":
                    {
                        Reflect.deleteProperty(vdom["attrs"], "class")
                        removeAttr(rel, attr.name);
                        break;
                    }
                case "attrs":
                    {
                        Reflect.deleteProperty(vdom["attrs"]["attrs"], attr.name)
                        removeAttr(rel, attr.name);
                        break;
                    }
                case "props":
                    {
                        Reflect.deleteProperty(vdom["attrs"]["props"][attr.name], attr.name)
                        rel[attr.name] = null;
                        break;
                    }
            }
        }
    }
}

function dealChildren(relList, ll, actions, parent,sact) {
    // const state = {
    //     origin: -1, //保持不变
    //     create: 1,  //新建元素
    //     attrsupdata: 2, //更新属性 
    //     delete:3, //删除dom
    //     textChange: 5,  //更新文字
    //     move:6,      //移动元素
    //     forChange:7, //for循环的元素发生了改变
    // }

    //真实dom列表的指针
    let rindex = 0;
    //移动元素的偏移值
    let offset = 0;
    //虚拟dom列表的指针
    let lindex = 0;

    let hasMove = false;
    let moveList = [];
    for (let i of actions) {
        let { action } = i;
        switch (action) {
            case state.origin:
                {
                    let { index, childRes } = i;
                    if (childRes) {
                        dealChildren(relList[rindex].childNodes, ll[index].children, childRes, relList[rindex],sact)
                    }
                    advance(1, 1);
                    break;
                }
            case state.create:
                {
                    let { index, data } = i;
                    moveElementToAfter(createElement(data,sact), relList[rindex], parent)
                    ll.splice(index, 0, data);
                    //偏移值加一
                    offset += 1;
                    advance(2, 2);
                    break;
                }
            case state.attrsupdata:
                {
                    let { index, data, childRes } = i;
                    dealAttrs(relList[rindex], ll[index], data)
                    if (childRes) {
                        dealChildren(relList[rindex].childNodes, ll[index].children, childRes, relList[rindex],sact)
                    }
                    advance(1, 1);
                    break;
                }

            case state.delete:
                {
                    let { index } = i;
                    if (ll instanceof NodeList) {
                        ll.splice(index, 1);
                        removeElement(relList[rindex]);
                    }
                    else {
                        ll.splice(lindex, 1);
                        removeElement(relList[rindex]);
                    }
                    offset -= 1;
                    break;
                }

            case state.textChange:
                {
                    let { index, data } = i;
                    relList[rindex].textContent = data;
                    ll[index] = data;
                    advance(1, 1);
                    break;
                }
            case state.move:
                {
                    //将偏移值和元素同时压入队列,每次压入重新计算偏移值
                    let { from, to, childRes } = i;
                    if (childRes) {
                        dealChildren(relList[rindex].childNodes, ll[index].children, childRes, relList[rindex],sact)
                    }
                    hasMove = true;
                    moveList.push({ from, to, offset, data });
                    offset = 0;
                    advance(1, 1);
                    break;
                }
            case state.forChange:
                {
                    let res = 1;
                    let { index, count, data } = i;
                    if (data) {
                        res = dealChildren(sub(relList, index - 1, count), ll[index], data, parent,sact);
                    }
                    advance(res, 1);
                    break;
                }
        }
        if (hasMove) {
            let toplist = [];
            for (let i = 0; i < moveList.length; i++) {
                toplist.push(i);
            }
            for (let mover of moveList) {
                let { from, to, offset } = mover;
                let target = toplist.indexOf(from + offset);
                let after = toplist.indexOf(to);
                moveElementToAfter(relList[target], relList[after])
                let cutRes = ll.splice(target, 1);
                let cutNum = toplist.splice(target, 1);
                ll.splice(to, 0, cutRes);
                toplist.splice(to, 0, cutNum);
            }
        }
    }
    //返回更新后的节点数量
    return ll && ll.length;
    function advance(a, b) {
        rindex += a;
        lindex += b;
    }
    function sub(list, from, len) {
        let res = [];
        for (let i = 0, l = 0; i < list.length; i++) {
            if (i >= from && l < len) {
                l++;
                res.push(list[i]);
            }
        }
        return res;
    }
}




function inserAfter(realElement, ndom) {
    realElement.after(ndom)
}
function moveElementToAfter(moveDom, todom, parent) {
    if (!todom) {
        return parent.appendChild(moveDom)
    }
    if (moveDom.parentElement.lastChild === todom) {
        moveDom.parentElement.appendChild(moveDom);
    }
    else {
        inserAfter(todom, moveDom);
    }
}
function updataAttr(realElement, attrName, value) {
    realElement.setAttribute(replaceList(attrName), value)
}
function removeAttr(realElement, attrName) {
    realElement.removeAttribute(attrName)
}
function removeElement(realElement) {
    realElement.parentElement.removeChild(realElement);
}
export function replaceDom(odom, ndom) {
    return odom.parentElement.replaceChild(ndom, odom);
}




export function createElement(o,self) {
    if (typeof o === "string") {
        return document.createTextNode(o);
    }
    let dom = document.createElement(o.tagName);
    for (let i of Reflect.ownKeys(o.attrs || {})) {
        switch (i) {
            case "attrs":
                for (let attrName of Reflect.ownKeys(o.attrs.attrs)) {
                    updataAttr(dom, attrName, o.attrs.attrs[attrName]);
                }
                break;
            case "on":
                for (let eventName of Reflect.ownKeys(o.attrs.on)) {
                    dom.addEventListener(eventName,  ()=> {
                        o.attrs.on[eventName](self,...arguments);
                    });
                }
                break;
            case "props":
                for (let propsName of Reflect.ownKeys(o.attrs.props)) {
                    dom[propsName] = o.attrs.props[propsName];
                }
                break;
            default:
                updataAttr(dom, i, o.attrs[i]);
        }
    }
    if(o.children){
        for (let i of o.children) {
            if (Array.isArray(i)) {
                for (let j of i) {
                    if (j !== null) {
                        dom.appendChild(createElement(j,self));
                    }
                }
            }
            else {
                if (i !== null) {
                    dom.appendChild(createElement(i,self));
                }
            }
        }
    }
    return dom;
}