import Sact from "../sact.js"
import { exceptExtend, extend, isArray, isString, sactWarn } from "../tools/untils.js";

const prefix = "s";

const animationName = {
    ENTER: "-enter",
    LEAVE: "-leave",
    ACTIVE: "-active",
    TO: "-to",
}



//防止嵌套其他抽象组件
function getRealChild(vnode) {
    const compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.isAbstract) {
        return getRealChild(getFirstComponentChild(compOptions.children))
    } else {
        return vnode
    }
}

//获取包裹组件下的真实vnode
function getRawChild(vnode) {
    const Ctor = vnode && vnode.componentOptions && vnode.compOptions.Ctor;
    if (Ctor) {
        return getRawChild(Ctor.$vnode);
    }
    else {
        return vnode;
    }
}

function getFirstComponentChild(vnodes) {
    if (isArray(vnodes) && vnodes.length === 1) {
        return vnodes[0];
    }
    else if (isArray(vnodes) && vnodes.length > 1) {
        console.log(vnodes);
        throw new Error("transiton just recive a child, more children please use transition-group")
    }
    else {
        return undefined;
    }
}

function getPos(ele) {
    return ele.getBoundingClientRect();
}

//初始化transtion参数
function initdata(props) {
    const res = {};
    let { name } = props;
    if (!isString(name)) {
        name = prefix;
    }

    res.enter = name + animationName.ENTER;
    res.enterActive = name + animationName.ENTER + animationName.ACTIVE;
    res.enterTo = name + animationName.ENTER + animationName.TO;
    res.leave = name + animationName.LEAVE;
    res.leaveActive = name + animationName.LEAVE + animationName.ACTIVE;
    res.leaveTo = name + animationName.LEAVE + animationName.TO;

    exceptExtend(res, props);
    return res;
}

function removeClass(ele, ...cls) {
    if (cls && ele) {
        ele.classList.remove(...cls);
    }
}

function addClass(ele, ...cls) {
    if (cls && ele) {
        ele.classList.add(...cls);
    }
}

function clearClass(ele, opts) {
    for (let i of ["enter",
        "enterActive",
        "enterTo",
        "leave",
        "leaveTo",
        "leaveActive"]) {
        if (ele.classList.contains(opts[i])) {
            removeClass(ele, opts[i]);
        }
    }
}


//创建时插入的类名
function whenCreate(ele) {

    const self = this;
    const { opts } = this._data;


    function _created() {
        removeClass(ele, opts.enterTo, opts.enterActive);
        ele.removeEventListener("transitionend", _created);
        ele.removeEventListener("animationend", _created);
    }


    //先添加enter类
    addClass(ele, opts.enter);
    ele.addEventListener("transitionend", self.enterCB = _created);
    ele.addEventListener("animationend", _created);
    //创建完元素后添加enterActive和enterTo
    setTimeout(() => {
        clearClass(ele, opts);
        addClass(ele, opts.enterActive, opts.enterTo);
    }, 0)
}

//移除时插入的类名
function whenLeave(ele, done) {
    const self = this;
    const { opts } = this._data;
    const s = ele.style;

    //为none的元素不会触发动画结束事件，所以直接结束动画
    if (s.display === "none") {
        done && done();
        return;
    }

    function _leaved() {
        removeClass(ele, opts.leaveTo, opts.leaveActive);
        done && done();
        self._isLeaving = false;
        ele.removeEventListener("transitionend", _leaved);
        ele.removeEventListener("animationend", _leaved);
    }

    //先添加leave类
    addClass(ele, opts.leave);

    ele.addEventListener("transitionend", self.leaveCb = _leaved);
    ele.addEventListener("animationend", _leaved);

    //添加标记防止重复
    this._isLeaving = true;
    //然后异步添加leaveActive和leaveTo
    setTimeout(() => {
        clearClass(ele, opts);
        addClass(ele, opts.leaveActive, opts.leaveTo);
    }, 0)
}


function dealShow(data, child) {
    const props = child.context.props;
    let cd = child.data;

    //s-show 外层组件时的判断
    if (props.style) {
        extend(cd.style = cd.style || {}, props.style)
        Reflect.deleteProperty(props, "style");
    }
    if (cd.style) {
        const nowShow = cd.style.display === "none" ? false : true;
        child.isShow = !!(!data.lastShow && nowShow);
        child.isHidden = !!(data.lastShow && !nowShow);
        data.lastShow = nowShow;
    }
}

export const transitionProps = {
    "mode": { //模式，默认为先出后进
        default: "out-in",
        validator(value) {
            return value === "in-out" || value === "out-in";
        }
    },
    "name": "string",//自动会在前面加上s-的前缀找到class
    "enter": "string",//元素添加前的类
    "enterActive": "string",//整个元素创建期间的类名
    "enterTo": "string",//元素被插入后的类名
    "leave": "string", //元素被删除前的类名
    "leaveActive": "string",//元素删除期间的类名
    "enterTo": "string",//元素被删除（leave移除后）后的类名
    "duration": { //动画的持续时间
        type: "string",
        default: "500"
    },
    "delay": { //延迟后使用
        type: "string",
        default: "0",
    },
}



export default {
    name: 'transition',
    isAbstract: true,
    isShowAttr: false,
    props: transitionProps,
    beforeMount() {
        this._data = {};
        this._data.opts = initdata(this.props);
    },
    mounted() {
        this.wrapVnode.onDestrory = whenLeave.bind(this);
    },
    updated() {
        this.wrapVnode.onDestrory = whenLeave.bind(this);
    },
    render(h) {

        if (this._isLeaving) {
            if (this.leaveCb) {
                this.leaveCb.call(this);
            }
        }

        let child = getRealChild(getFirstComponentChild(this.$slot["default"]))

        if (!child) {
            return;
        }
        dealShow(this._data, child)

        child.onCreated = whenCreate.bind(this);
        child.onDestrory = whenLeave.bind(this);
        child._data = this._data;
        child.achor = this.wrapVnode.achor;
        child.parent = this.wrapVnode.parent;
        this.oldChild = child;
        return child;
    }
}