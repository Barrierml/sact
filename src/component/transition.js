import Sact from "../sact.js"
import { exceptExtend, isArray, isString } from "../tools/untils.js";

const prefix = "s";

const animationName = {
    ENTER: "-enter",
    LEAVE: "-leave",
    ACTIVE: "-active",
    TO: "-to",
}



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

    exceptExtend(res,props);
    return res;
}

function removeClass(ele,name) {
    if(name && ele){
        ele.classList.remove(name);
    }
}

function addClass(ele,name) {
    if(name && ele){
        ele.classList.add(name);
    }
}

function clearClass(ele,opts) {
    for(let i of ["enter",
    "enterActive",
    "enterTo",
    "leave",
    "leaveTo",
    "leaveActive"]){
        if(ele.classList.contains(opts[i])){
            removeClass(ele,opts[i]);
        }
    }
}


//创建时插入的类名
function whenCreate(ele) {

    const self = this;
    const {opts} = this._data;

    
    function _created() {
        removeClass(ele,opts.enterTo);
        removeClass(ele,opts.enterActive);
        ele.removeEventListener("transitionend", _created);
        ele.removeEventListener("animationend",_created);
    }


    //先添加enter类
    addClass(ele,opts.enter);
    ele.addEventListener("transitionend", _created);
    ele.addEventListener("animationend",_created);

    //创建完元素后添加enterActive和enterTo
    setTimeout(()=>{
        clearClass(ele,opts);
        addClass(ele,opts.enterActive);
        addClass(ele,opts.enterTo);
    },0)
}

//移除时插入的类名
function whenLeave(ele,done) {
    const self = this;
    const {opts} = this._data;

    function _leaved() {
        removeClass(ele,opts.leaveTo);
        removeClass(ele,opts.leaveActive);
        done && done();
        self._isLeaving = false;
        ele.removeEventListener("transitionend", _leaved);
        ele.removeEventListener("animationend",_leaved);
    }

    //先添加leave类
    addClass(ele,opts.leave);

    ele.addEventListener("transitionend", _leaved);
    ele.addEventListener("animationend",_leaved);

    //添加标记防止重复
    this._isLeaving = true;
    //然后异步添加leaveActive和leaveTo
    setTimeout(()=>{
        clearClass(ele,opts);
        addClass(ele,opts.leaveActive);
        addClass(ele,opts.leaveTo);
    },0)
}


function dealShow(data,child) {
    if(child.data && child.data.style){
        const nowShow = child.data.style.display === "none" ? false : true;
        child.isShow = !!(!data.lastShow && nowShow);
        child.isHidden = !!(data.lastShow && !nowShow);
        data.lastShow = nowShow;
    }
}


export default Sact.component({
    name: 'transition',
    isAbstract: true,
    isShowAttr: false,
    props: {
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
    },
    beforeMount() {
        this._data = {};
        this._data.opts = initdata(this.props);
    },
    mounted(){
        this.wrapVnode.onDestrory = whenLeave.bind(this);
    },
    updated(){
        this.wrapVnode.onDestrory = whenLeave.bind(this);
    },
    render(h) {
        let child = getRealChild(getFirstComponentChild(this.$slot["default"]))
        
        if (!child) {
            return;
        }
        if(this._isLeaving){
            return this.oldChild;
        }

        dealShow(this._data,child)

        child.onCreated = whenCreate.bind(this);
        child.onDestrory = whenLeave.bind(this);
        child._data = this._data;
        child.achor = this.wrapVnode.achor;
        child.parent = this.wrapVnode.parent;
        this.oldChild = child;
        return child;
    }
})