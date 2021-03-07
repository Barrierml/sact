import {isObj } from "../tools/untils.js";
import Parse from "./Parser.js";
import Generate from "./generate.js";
import { reactivate,openTick,resetTick } from "./reactivity.js";
import { createVnode, createFor } from "./vnode.js";

export default function initAll(sact, options) {
    sact.$options = options;
    initWhen(sact);
    sact.callHooks("beforeCreate");
    initProps(sact);
    initElement(sact);
    initMethod(sact);
    initData(sact);
    initComponent(sact);
    initRender(sact);
    sact.callHooks("created");
    initPlug(sact);
}

//初始化对象
function initElement(sact) {
    const options = sact.$options;
    if (options.ele) {
        sact.$ele = document.querySelector(options.ele);
        sact.$template = sact.$ele.outerHTML;
    }
    if (options.template) {
        sact.$template = options.template;
    }
}

//初始化数据
function initData(sact) {
    const options = sact.$options;
    let data = options.data;
    if (options.data && typeof options.data === "function") {
        data = data.apply(sact);
    }
    if (options.reactive === false) {
        sact.data = data;
    }
    else {
        sact.data = reactivate(sact, data || {});
    }
}

//初始化方法
function initMethod(sact) {
    const options = sact.$options;
    if (isObj(options.method)) {
        let { method } = options;
        for (let funName of Reflect.ownKeys(method)) {
            if (!typeof method[funName] === "function") {
                throw new Error(`${funName} 不为function，请检查！`)
            }
            sact[funName] = options.method[funName].bind(sact);
        };
    }
    sact._c_ = (a, b, c, zid) => createVnode(sact, a, b, c, zid);
    sact._f_ = (i, f) => createFor(i, f)
}


//初始化组件功能
function initComponent(sact) {
    const options = sact.$options;
    let { isComponent, component, isAbstract } = options;
    if (isComponent) { //自身为组件时
        sact.isComponent = true;
        sact.isAbstract = isAbstract; //抽象组件
        sact.name = options.name;
    }
    sact.componentList = [];
    if (isObj(component)) { //使用组件时,将组件添加到环境中
        for (let con of Reflect.ownKeys(component)) {
            sact.componentList.push(con);
        }
    }
    sact.components = component || {};
    //每个sact赋予一个新的cid
    sact.cid = Number.parseInt(Math.random() * 100);
}

//初始化渲染功能
function initRender(sact) {
    const options = sact.$options;

    if (sact.isAbstract === true) {
        sact._render = () => null
    }
    else {
        sact.$createVnode = Generate(Parse(sact.$template))
        sact._render = () => sact.$createVnode.apply(sact);
    }

    //当sact为组件时的渲染方法在vnode里面生成
    //用户可以自定义render函数，手动修改vnode来渲染,不过随意修改vnode会造成patch错误，请小心使用
    let { render } = options;
    if (render && typeof render === "function") {
        sact._render = (props) => render.apply(sact,[sact._c_, props]);
    }
}


//初始化继承
function initProps(sact) {
    const options = sact.$options;
    let { props } = options;
    if (typeof props === "function") {
        sact.props = props();
    }
    else if (props) {
        sact.props = props;
    }
}

//初始化生命周期
function initWhen(sact) {
    /**
     * 目前支持的周期函数
     * beforeCreate 刚刚实例化 data，method都还无法调用
     * created  已经创建 data，method可以调用，还未生成虚拟vnode
     * beforeMount  挂载之前 这时虚拟vnode已经生成了，还未开始生成真实dom，可以通过$vnode查看虚拟vnode
     * mounted  装载后 这时实例已经开始正常运行了，所有属性都可以访问了
     * beforeUpdate 数据更新前，这时数据已经修改完毕，但是尚未更新
     * updated  数据更新完毕了，这时真实dom已经修改过了
     * beforeDestory  （仅限组件）删除前，要删除实例时，会先调用这个方法，此时所有数据均可以访问
     * destroyed （仅限组件）删除后，已经删除完毕，数据均已解绑
     */
    const opts = sact.$options;
    sact.callHooks = function (fnName) {
        let fn = opts[fnName];
        if(fn && typeof fn === "function"){
            return fn.apply(sact);
        } 
    }
}

function initPlug(sact){
    let plugList = sact.getplug();
    if(plugList){
        for(let p of plugList){
            openTick();
            p.install && p.install.call(p,sact);
            resetTick();
        }
    }
}