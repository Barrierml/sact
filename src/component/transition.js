import Sact from "../sact.js"
import { isArray } from "../tools/untils.js";

//防止嵌套其他抽象组件
function getRealChild(vnode) {
    var compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.isAbstract) {
        return getRealChild(getFirstComponentChild(compOptions.children))
    } else {
        return vnode
    }
}


function getFirstComponentChild(vnodes) {
    if (isArray(vnodes) && vnodes.length === 1) {
        return vnodes[0];
    }
    else {
        return undefined;
    }
}


//用来添加动画的
export default Sact.component({
    name: 'transition',
    props: {
        "beforenter": "string",
    },
    isAbstract: true,
    render(h) {
        let res = getRealChild(getFirstComponentChild(this.$slot["default"]))
        if (res) {
            //继承属性
            res.achor = this.wrapVnode.achor;
            res.parent = this.wrapVnode.parent;
        }
        console.log(res);
        return res;
    }
})