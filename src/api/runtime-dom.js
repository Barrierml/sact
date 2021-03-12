//运行时使用的dom操作

export default {
    /**
     * 
     * @param {*} child 要插入的元素
     * @param {*} parent 父组件，如果存在就插入到父组件的子元素内
     * @param {*} anchor 锚点，如果存在就插入到anchor的前面
     */
    insert(child,parent,anchor){
        if(anchor){
            parent.insertBefore(child,anchor);
        }
        else{
            parent.appendChild(child);
        }
    },
    remove(child){
        const parent = child.parentNode;
        parent && parent.removeChild(child);
    },
    replace(odom, ndom) {
        const parent = odom.parentNode;
        parent && parent.replaceChild(ndom, odom);
    },
    next(dom){
        return dom && dom.nextElementSibling;
    },
    pre(dom){
        return dom && dom.previousElementSibling;
    },
    //更改元素文本
    setElementText(el,text){
        el.textContent = text;
    },
    setAttribute(el,key,value){
        if(!key){
            return;
        }
        el.setAttribute(key, value);
    },
    removeAttribute(el,key){
        el.removeAttribute(key);
    }
}