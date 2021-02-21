import { extend, isObj } from "./untils.js";
import Parse from "./Parser.js"
import Generate from "./generate.js"

export default function initAll(sact, options) {
    sact.$optinons = options;
    initElement(sact, options);
    initData(sact, options);
    initMethod(sact, options);
    initComponent(sact, options);
    initRender(sact,options);
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
    if (isObj(options.data)) {
        extend(sact, options.data);
    }
}

//初始化方法
function initMethod(sact, options) {
    if (isObj(options.method)) {
        let { method } = options;
        for (let funName of Reflect.ownKeys(method)) {
            if (!typeof method[funName] === "function") {
                throw new Error(`${funName} 不为function，请检查！`)
            }
        };
        extend(sact, method);
    }
}


//初始化组件功能
function initComponent(sact, options) {
    let { isComponent, component } = options;
    if (isComponent) { //自身为组件时
        sact.isComponent = true;
        sact.$createVnode = Generate(Parse(sact.$template))
        sact.cid = Number.parseInt(Math.random()*100);
        
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
function initRender(sact,options){
    let { isComponent } = options;
    //不是组件时的渲染方法
    if(!isComponent){
        sact.$createVnode = Generate(Parse(sact.$template))
    }
}