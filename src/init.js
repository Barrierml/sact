import { isObj } from "./untils.js";
import Parse from "./Parser.js"
import Generate from "./generate.js"
import { reactivate } from "./reactivity.js";
import raise from "./vnode.js";

export default function initAll(sact, options) {
    sact.$optinons = options;
    initElement(sact, options);
    initData(sact, options);
    initMethod(sact, options);
    initComponent(sact, options);
    initRender(sact, options);
    initProps(sact, options);
}

//初始化对象
function initElement(sact, options) {
    if (options.ele) {
        sact.$ele = document.querySelector(options.ele);
        sact.$template = sact.$ele.outerHTML;
    }
    if (options.template) {
        sact.$template = options.template;
    }
}

//初始化数据
function initData(sact, options) {
    let data = options.data;
    if(options.data && typeof options.data === "function"){
        data = data();
    }
    sact.data = reactivate(sact, data || {});
}

//初始化方法
function initMethod(sact, options) {
    if (isObj(options.method)) {
        let { method } = options;
        for (let funName of Reflect.ownKeys(method)) {
            if (!typeof method[funName] === "function") {
                throw new Error(`${funName} 不为function，请检查！`)
            }
            sact[funName] = options.method[funName].bind(sact);
        };
    }
}


//初始化组件功能
function initComponent(sact, options) {
    let { isComponent, component } = options;
    if (isComponent) { //自身为组件时
        sact.isComponent = true;
        sact.cid = Number.parseInt(Math.random() * 100);

    }

    if (isObj(component)) { //使用组件时,将组件添加到环境中
        sact.componentList = [];
        for (let con of Reflect.ownKeys(component)) {
            sact.componentList.push(con);
        }
        sact.components = component;
    }
}

//初始化渲染功能
function initRender(sact, options) {
    let { isComponent } = options;
    sact.$createVnode = Generate(Parse(sact.$template))
    //不是组件时的渲染方法
    if (!isComponent) {
        sact._render = ()=>raise(sact.$createVnode,sact);
    }
    //当sact为组件时的渲染方法在vnode里面生成
}


//初始化继承
function initProps(sact, options) {
    let { props } = options;
    if (props) {
        sact.props = props;
    }
}