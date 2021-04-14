/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/tools/untils.js
const baseTypeList = [
    "boolean", "number", "string", "symbol", "undefined"
]

function sactWarn(text, ...args) {
    console.warn("%c [Sact-Warn]:" + text,
        "color:red;font-size:16px;",
        ...args);
}



//获取vnode.data.attrs属性删除并返回值
function getAndRemoveVnodeAttr(vnode,attrName) {
    let val;
    if(val = vnode.data 
        && vnode.data.attrs 
        && vnode.data.attrs[attrName])
    {
        Reflect.deleteProperty(vnode.data.attrs,attrName);
    }
    return val;
}

//获取vnode.data.attrs属性
function getVnodeAttr(vnode,attrName) {
    let val;
    val = vnode.data 
        && vnode.data.attrs 
        && vnode.data.attrs[attrName];
    return val;
}


//获取属性并删除
function getAndRemoveAttr(el, attr) {
    let val;
    if (val = el.attrsMap[attr]) {
        el.attrsMap[attr] = null;
        for (let i = 0, l = el.attrs.length; i < l; i++) {
            if (el.attrs[i].name === attr) {
                el.attrs.splice(i, 1);
                break;
            }
        }
    }
    return val;
}
//判断对象是否是基础类型
function isBaseType(obj) {
    let t = typeof obj
    return baseTypeList.includes(t);
}

function isObj(obj) {
    return obj && typeof (obj) === "object" && obj !== null
}
//扩展对象属性
function extend(obj, res) {
    if (!isObj(res)) {
        return obj;
    }
    for (let i of Reflect.ownKeys(res)) {
        obj[i] = res[i]
    }
    return obj;
}
function exceptExtend(obj, res) {
    if (!isObj(res)) {
        return obj;
    }
    for (let i of Reflect.ownKeys(res)) {
        if (res[i] !== undefined) {
            obj[i] = res[i]
        }
    }
    return obj;
}
function listToMap(list) {
    let res = {};
    for (let i of (list)) {
        res[i.name] = i.value;
    }
    return res;
}

//克隆一个新的静态对象
function cloneStaticObj(obj) {
    let res;
    for (let i of Reflect.ownKeys(obj)) {
        if (typeof obj[i] === "object") {
            res[i] = cloneStaticObj(obj[i]);
        }
        res[i] = obj[i];
    }
    return res;
}


const remove = (arr, el) => {
    if (!isArray(arr)) {
        return;
    }
    const i = arr.indexOf(el)
    if (i > -1) {
        arr.splice(i, 1)
    }
}

//获取循环获取数据
function getDataInData(VName, data) {
    let p = VName.split(".");
    let res = data;
    //递归获取属性
    for (let i of p) {
        if (res) {
            res = res[i]
        }
    }
    return res;
}

const leftAttrsTag = "{{"
const rightAttrsTag = "}}"
const AttrsTag = new RegExp(`${leftAttrsTag}\\s*([\\w\\.\\(\\)\\]\\[\\|&_$\\?\\:\\s\\']+)\\s*${rightAttrsTag}`)
//判断含有为动态变量并返getDynamicName回变量名 出现的位置 和最后的位置
function getDynamicName(str) {
    let res = AttrsTag.exec(str)
    if (res) {
        return [res[1], res["index"], res["index"] + res[0].length]
    }
    return [];
}

const isArray = Array.isArray;
const isString = (val) => typeof val === "string";
const isNum = (val) => typeof val === "number";
const hasOwn = (val, key) => Reflect.has(val, key)
const isFunc = (val) => typeof val === "function";
const isMap = (val) => toTypeString(val) === '[object Map]'
const isSet = (val) => toTypeString(val) === '[object Set]'
const isDate = (val) => val instanceof Date
const objectToString = Object.prototype.toString
const toTypeString = (value) => objectToString.call(value)
const isPromise = (val) => isObj(val) && isFunc(val.then) && isFunc(val.catch)

const isIntegerKey = (key) =>
    isString(key) &&
    key !== 'NaN' &&
    key[0] !== '-' &&
    '' + parseInt(key, 10) === key
// CONCATENATED MODULE: ./src/core/Parser.js


//将普通的html返回一个ast语法树
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const dynamicArgAttribute = /^\s*((?:s-[\w-]+:|@|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const doctype = /^<!DOCTYPE [^>]+>/i
const comment = /^<!\--/
const conditionalComment = /^<!\[/


function Parser_listToMap(list) {
    if(!isArray(list)){
        return null;
    }
    let res = {};
    for (let i of list) {
        res[i.name] = i.value;
    }
    return res;
}

//Parser主处理函数 返回一个ast树
function Parse(html) {
    const stack = []
    let index = 0
    let last, lastTag, root
    let old  = html;
    while (html) {
        last = html

        let textEnd = html.indexOf('<')
        if (textEnd === 0) {

            //删除注释
            if (comment.test(html)) {
                const commentEnd = html.indexOf('-->')
                if (commentEnd >= 0) {
                    advance(commentEnd + 3)
                    continue
                }
            }

            //html声明
            const doctypeMatch = html.match(doctype)
            if (doctypeMatch) {
                console.log("处理html声明")
                advance(doctypeMatch[0].length)
                continue
            }

            // 标签结束:
            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
                const curIndex = index
                advance(endTagMatch[0].length)
                handleCloseTag(endTagMatch[1], curIndex, index)
                continue
            }

            // 标签开始:
            const startTagMatch = parseStartTag()
            if (startTagMatch) {
                handleStartTag(startTagMatch)
            }

        }
        //去除前面的空白或者文本
        let text, rest, next
        if (textEnd >= 0) {
            rest = html.slice(textEnd)
            while (
                !endTag.test(rest) &&
                !startTagOpen.test(rest) &&
                !comment.test(rest) &&
                !conditionalComment.test(rest)
            ) {
                //每去除掉一个< 就检查一遍剩下的文字是否符合条件
                next = rest.indexOf('<', 1)
                if (next < 0) break
                textEnd += next
                rest = html.slice(textEnd)
            }
            text = html.substring(0, textEnd)
        }

        if (textEnd < 0) {
            text = html
        }

        //将文本元素直接加入头部
        if (text) {
            advance(text.length)
            if (text.replace(/\s+/g, "")) {
                if(root){
                    stack[stack.length - 1].children.push(text);
                }
                else{
                    root = text;
                }
            }
        }
    }

    return root

    function advance(i) {
        index += i
        html = html.substring(i)
    }

    function parseStartTag() {
        const start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [],
                start: index
            }
            advance(start[0].length)
            let end, attr
            while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
                attr.start = index
                advance(attr[0].length)
                attr.end = index
                match.attrs.push(attr)
            }
            if (end) {
                match.unarySlash = end[1]
                advance(end[0].length)
                match.end = index
                return match
            }
        }
    }

    //处理结束标签
    function handleCloseTag(tag, c, i) {
        let pos, lowerCasedTagName
        if (tag) {
            lowerCasedTagName = tag.toLowerCase()
            for (pos = stack.length - 1; pos >= 0; pos--) {
                if (stack[pos].tagName === lowerCasedTagName) {
                    break
                }
            }
        } else {
            console.log("标签：《" + tag + "》,没有找到闭合的标签！")
            return;
        }

        //关闭所有在这两者之间的标签，加入孩子池中
        if (pos >= 0) {
            for (let i = stack.length - 1; i > pos; i--) {
                stack[pos].children.push(stack[i])
                stack[i].parent = stack[pos]
            }
        }
        if(pos < 0){
            throw new Error(`\nSact-AstError:存在一个没有开始节点闭合节点！\n${old.substring(0,c)}---> ${old.substring(c)} <-----\n`)
        }
        if (pos) {
            stack[pos].parent = stack[pos - 1]
            stack[pos - 1].children.push(stack[pos])
        }
        //清空栈，并设置最后的父标签
        lastTag = pos ? stack[pos - 1] : stack[pos]
        stack.length = pos
    }
    //处理开始标签
    function handleStartTag(match) {
        let name = match.tagName
        let unary = match.unarySlash
        let [attrs,attrsMap] = parseAttrs(match.attrs)
        let currentAst = {
            tagName: name,
            attrs: attrs,
            attrsMap:attrsMap,
            children: [],
        }

        if(!root){root = currentAst}
        if (!unary && name !== "input" && name !== "img") { //非闭合标签或者input直接入栈
            stack.push(currentAst)
        }
        else { //闭合直接加入父元素
            currentAst.parent = lastTag
            if(root && root !== currentAst){
                stack[stack.length - 1].children.push(currentAst)
            }
        }

        //处理属性
        function parseAttrs(Attrs) {
            const l = Attrs.length
            const attrs = new Array(l)
            for (let i = 0; i < l; i++) {
                const args = match.attrs[i]
                const value = args[3] || args[4] || args[5] || ''
                attrs[i] = {
                    name: args[1],
                    value: value,
                }
            }
            return [attrs,Parser_listToMap(attrs)]
        }
    }
}
// CONCATENATED MODULE: ./src/core/vnode.js


const vnodeType = {
    static: 1,
    dynamic: 2,
}



class Vnode {
    constructor(vm, a, b, c, d, istext, zid, type) {
        this.context = vm
        this.tag = istext ? "_text_" : a
        this.data = b || new Object();
        if (b && b.style) {
            b.style = renStyle(b.style);
        }
        if (b && b.class) {
            b.class = renClass(b.class);
        }
        this.componentOptions = d

        this.type = type;
        this.parent = undefined
        this.text = istext ? a : undefined
        this.key = b && b.key;

        this.element = undefined

        this.achor = undefined

        this.zid = zid
        if (!istext) {
            [this.children, type] = genVdomChildren(c, vm, this)
            if (this.type === vnodeType.static) {
                this.type = type;
            }
        }
    }

    getParentEle() {
        let parent = this.parent;
        while (parent && !parent.element) {
            parent = parent.parent;
        }
        return parent && parent.element;
    }
}




function createVnode(vm, a, b, c, type, zid) {
    const { components } = vm;
    //组件
    if (Reflect.ownKeys(components).indexOf(a) > -1) {
        return createComponent(components[a], b, vm, c, a, zid, type);
    }
    //自定义组件
    else if (a === "component") {
        return createDynamicComponent(vm, b, c, components, zid, type);
    }
    //插槽
    else if (a === "slot") {
        return createSolt(vm, b, c);
    }
    else {
        return new Vnode(vm, a, b, c, undefined, false, zid, type);
    }
}


//创建自定义组件
function createDynamicComponent(vm, data, children, components, zid, type) {
    const ComponentName = (data.attrs && data.attrs.is) || undefined;
    if (ComponentName
        && components
        && Reflect.ownKeys(components).indexOf(ComponentName) > -1) {
        Reflect.deleteProperty(data.attrs,"is");
        return createComponent(components[ComponentName], data, vm, children, ComponentName , zid, type);
    }
    else {
        sactWarn(`${vm.name} don't have component ${ComponentName},please check your name.`,
            vm);
        return undefined;
    }
}



function createComponent(Ctor, data, context, children, tag, zid, type) {
    [children, type] = genVdomChildren(children)
    let vnode = new Vnode(context,
        ("sact-component-" + (zid) + "-" + tag),
        data, undefined, {
        Ctor: Ctor,
        tag: tag,
        children,
    }, false, zid, type);
    return vnode
}



function createSolt(vm, data, children) {
    if (vm.$slot) {
        let slotName = data.attrs && data.attrs.name;
        if (slotName) {
            return vm.$slot[slotName] || null;
        }
        else {
            return vm.$slot["default"];
        }
    }
    else {
        return children
    }
}


function createFor(iterater, fn) {
    let res = [];
    let type = typeof iterater;
    if (Array.isArray(iterater)) {
        res = iterater.map(fn);
    }
    else if (type === "object") {
        let i = 0;
        for (let j of Reflect.ownKeys(iterater)) {
            res.push(fn(j, i));
        }
    }
    else if (type === "string") {
        for (let i of iterater) {
            res.push(fn(i));
        }
    }
    else if (typeof (iterater) === "number") {
        for (let i = 1; i <= iterater; i++) {
            res.push(fn(i));
        }
    }
    else if (type === "number") {
        for (let i = 0; i < iterater; i++) {
            res.push(fn(i));
        }
    }
    return res
}
//合并生成的列表
function genVdomChildren(list, vm, parent) {
    let res = [];
    let typeFlag = vnodeType.static;
    let achor = parent;

    if (list) {
        for (let i of list) {
            if (Array.isArray(i)) {
                let rres = [];
                [rres, typeFlag] = genVdomChildren(i, vm, parent);

                rres && rres.forEach((v) => {
                    setAchorParent(v)
                })

                res = res.concat(rres)
            }
            else if (typeof i === "string") {
                let v = new Vnode(vm, i, undefined, undefined, undefined, true);
                setAchorParent(v);
                res.push(v)
            }
            else if (i) {
                if (i.type === vnodeType.dynamic) {
                    typeFlag = vnodeType.dynamic;
                }
                setAchorParent(i)
                res.push(i);
            }
        }
        return [res.map((v) => { v.parent = parent; return v; }), typeFlag];
    }
    return [undefined, undefined]

    function setAchorParent(vnode) {
        vnode.achor = achor;
        achor = vnode;
        vnode.parent = parent;
    }
}

function renStyle(style, seen = {}) {
    let type = typeof style;
    if (isArray(style)) {
        for (let i = 0; i < style.length; i++) {
            renStyle(style[i], seen);
        }
    }
    else if (type === "object") {
        let keys = Reflect.ownKeys(style)
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            seen[key] = style[key];
        }
    }
    else if (type === "string") {
        style.split(";").forEach((v) => {
            let value = v.split(":")
            if (value.length === 2) {
                seen[value[0]] = value[1];
            }
        })
    }
    return seen;
}

function renClass(cls){
    let res = "";
    if(isObj(cls)){
        for(let i in cls){
            if(cls[i]){
                res += String(i) + " ";
            }
        }
    }
    else if(isArray(cls)){
        cls.forEach((i)=>{
            res += i + " ";
        })
    }
    return res;
}
// CONCATENATED MODULE: ./src/core/generate.js
//将ast语法树转化成语法


//给每个元素附上索引
let generate_zid = 0;
const simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/

//返回一个由ast树生成的render函数
function generate(ast) {
    const code = genElement(ast);
    return (ctx) => {
        try {
            return new Function(`with(this){
                with(data){
                     return ${code}
                }
            }`).call(ctx)
        }
        catch (e) {
            if (e instanceof ReferenceError) {
                console.warn("[Sact-warn]:Cannot read property of undefined, please check props\n", ctx,"\n", e);
                throw new Error("请确定你声明了正确的变量")
            }
            else {
                throw e;
            }
        }
    }
}

function genElement(ast) {
    ast.type = vnodeType.static;
    let res;
    if (res = getAndRemoveAttr(ast, 's-for')) { //解析for指令
        return genFor(ast, res);
    }
    else if (res = getAndRemoveAttr(ast, 's-if')) { // 解析if指令
        return genIf(ast, res);
    }
    else if (ast.tagName === "template") { // 解析template组件
        return genChildren(ast);
    }
    else {
        let [data,children] = [genData(ast),genChildren(ast)] 
        return `_c_('${ast.tagName}', ${data}, ${children},${ast.type},${generate_zid++})`;
    }
}

function genFor(ast, exp) {
    const iteratorFor = /([^]*?)\s+(?:in|of)\s+([^]*)/;
    const inMatch = exp.match(iteratorFor);
    if (!inMatch) {
        throw new Error('无效 s-for 表达式: ' + exp);
    }

    let iteration = inMatch[2];
    let alias = inMatch[1].trim().replace("(", '').replace(")", "");

    ast.type = vnodeType.dynamic;
    return `_f_(${iteration},function(${alias}){
      return ${genElement(ast)}
    })`
}


function genIf(ast, exp) {
    return `(${exp}) ? ${genElement(ast)} : null`;
}

function genData(ast) {
    if (!ast.attrs.length) {
        return '{}';
    }


    let events = {};
    let hasAttrs = false;
    let hasProps = false;
    let hasEvents = false;
    let hasStyle = false;
    let style = `style:[`
    let props = `props:{`;
    let data = "{";
    let attrs = `attrs:{`;

    const classBinding = getAndRemoveAttr(ast, 's:class') || getAndRemoveAttr(ast, 's-bind:class') || getAndRemoveAttr(ast, ':class');
    if (classBinding) {
        ast.type = vnodeType.dynamic;
        data += `class: ${classBinding},`;
    }
    const staticClass = getAndRemoveAttr(ast, 'class');
    if (staticClass) {
        data += `staticClass: "${staticClass}",`;
    }



    for (let i = 0, l = ast.attrs.length; i < l; i++) {

        let attr = ast.attrs[i];
        let name = attr.name;
        let value = attr.value;

        if (/^s-bind:|^:|s:/.test(name)) {
            ast.type = vnodeType.dynamic;
            name = name.replace(/^:|^s-bind:|^s:/, '');
            if (name === 'style') {
                style += `${value},`
                hasStyle = true;
            }
            else if (name === 'key') {
                data += `key: (${value}),`;
            } else if (/^(value|selected|checked|muted)$/.test(name)) {
                hasProps = true;
                props += `"${name}": (${value}),`;
            } else {
                hasAttrs = true;
                attrs += `"${name}": (${value}),`;
            }
        }
        else if (/^@|^s-on:|^s@/.test(name)) { // s-on
            ast.type = vnodeType.dynamic;
            const modifiers = parseModifiers(name);  // 事件修饰符（.stop/.prevent/.self）
            name = removeModifiers(name);
            hasEvents = true;
            name = name.replace(/^@|^s-on:|^s@/, '');
            addHandler(events, name, value, modifiers);
        }
        else if (/^s-model:|s-model/.test(name)) {
            ast.type = vnodeType.dynamic;
            name = name.replace(/^s-model:|s-model/, "")

            const modifiers = parseModifiers(name);  // 事件修饰符（.lazy/.trim./number）
            name = removeModifiers(name);

            hasEvents = true;
            addModaler(events, ast.tagName, name, value, modifiers);

            hasProps = true;
            props += `"${name}": (${value}),`;
        }
        else {
            if (name === "style") {
                style += `${JSON.stringify(value)},`;
                hasStyle = true;
            }
            else if (name !== "s-show") {
                hasAttrs = true;
                attrs += `"${name}": (${JSON.stringify(value)}),`;
            }
        }
    }

    let hasShow = getAndRemoveAttr(ast, "s-show");
    if (hasShow) {
        ast.type = vnodeType.dynamic;
        style += `{display:${hasShow} ? '' : 'none'},`;
        hasStyle = true;
    }

    if (hasStyle) {
        data += style + '],';
    }
    if (hasAttrs) {
        data += attrs.slice(0, -1) + '},';
    }
    if (hasProps) {
        data += props.slice(0, -1) + '},';
    }
    if (hasEvents) {
        data += genEvents(events); // 事件解析
    }
    return data.replace(/,$/, '') + '}';
}
function parseModifiers(name) {
    const match = name.match(/\.[^\.]+/g);
    if (match) {
        return match.map(m => m.slice(1));
    }
}

function removeModifiers(name) {
    return name.replace(/\.[^\.]+/g, '');
}
function addModaler(events, tagName, name, value, modifiers) {
    //默认为value
    if (!name) {
        name = "value";
    }

    let code = "let _v_ =";
    let handlerFN = "change"

    if (tagName === "input") {
        handlerFN = "input"
    }

    code += `$event.target.${name};`;

    if (Array.isArray(modifiers)) {

        for (let i = 0; i < modifiers.length; i++) {
            if (modifiers[i] === "trim") {
                code += `_v_ = _v_.trim && _v_.trim();`
            }
            else if (modifiers[i] === "number") {
                code += `_v_ = parseInt(_v_) || _v_;`
            }
            else if (modifiers[i] === "lazy") {
                handlerFN = "change";
            }
        }
    }

    code += `${value} = _v_;`;

    events[handlerFN] = { value: code };
}
function addHandler(events, name, value, modifiers) {
    const captureIndex = modifiers && modifiers.indexOf('capture');
    if (captureIndex > -1) {
        modifiers.splice(captureIndex, 1);
        name = '!' + name;
    }
    const newHandler = { value, modifiers };
    const handlers = events[name];
    if (Array.isArray(handlers)) {
        handlers.push(newHandler);
    } else if (handlers) {
        events[name] = [handlers, newHandler];
    } else {
        events[name] = newHandler;
    }
}
const modifierCode = {
    stop: '$event.stopPropagation();',
    prevent: '$event.preventDefault();',
}

function genEvents(events) {
    let res = 'on:{';
    for (let name in events) {
        res += `"${name}":${genHandler(events[name])},`;
    }
    return res.slice(0, -1) + '}';
}

function genHandler(handler) {
    if (!handler) {
        return `function(){}`;
    }
    else if (Array.isArray(handler)) {
        // handler为数组则循环调用
        return `[${handler.map(genHandler).join(',')}]`;
    }
    else if (!handler.modifiers || !handler.modifiers.length) {

        return simplePathRE.test(handler.value)
            ? handler.value
            : `function($event){${handler.value}}`;
    } else {
        let code = 'function($event){';
        for (let i = 0; i < handler.modifiers.length; i++) {
            let modifier = handler.modifiers[i];
            code += modifierCode[modifier];
        }
        let handlerCode = simplePathRE.test(handler.value)
            ? handler.value + '()'
            : handler.value;
        return code + handlerCode + '}';
    }
}
function genChildren(ast) {
    if (!ast.children.length) {
        return 'undefined';
    }
    return '[' + ast.children.map(node => {
        if (node.tagName) {
            return genElement(node);
        } else {
            return genText(ast,node);
        }
    }).join(',') + ']';
}
function genText(ast,text) {
    if (text === ' ') {
        return '" "';
    } else {
        const exp = parseText(text);
        if (exp) {
            ast.type = vnodeType.dynamic;
            return 'String(' + exp + ')';
        } else {
            return JSON.stringify(text);
        }
    }
}
function parseText(text) {
    if (!AttrsTag.test(text)) {
        return null;
    }
    let [exp, start, end] = getDynamicName(text);
    let res = [];
    while (exp) {
        if (start !== 0) {
            res.push(`'${text.substring(0, start).trim()}'`);
        }
        res.push(`(${exp})`);
        text = text.substring(end);
        [exp, start, end] = getDynamicName(text);
    }
    if (text) { res.push(`'${text.trim()}'`) }
    return res.join("+");
}
// CONCATENATED MODULE: ./src/core/scheduler.js
//下面是异步刷新
const queue = [];
let flushing = false;
let flushingPending = false;
let has = {};
//将所有要异步的函数放入队列，然后等待同步任务完成后event loop自动异步执行
function queueJob(job) {
    let id = job.id;
    if (!flushing) {
        if (!has[id]) {
            queue.push(job);
            has[id] = true;
        }
        queueFlush();
    }
    else {
        // console.log("当前正在刷新", job)
    }
}

function queueFlush() {
    if (!flushing && !flushingPending) {
        flushingPending = true;
        nextTick(flushSchedulerQueue);
    }
}


function flushSchedulerQueue() {
    flushingPending = false;
    flushing = true;

    queue.forEach((v)=>{
        v();
    })

    //清除数据等待下次收集
    queue.length = 0;
    flushing = false;
    has = {};
}

const callbacks = []
let pending = false
let timerFunc
function nextTick(cb, ctx) {
    callbacks.push(() => {
        if (cb) {
            cb.call(ctx)
        }
    })
    if (!pending) {
        pending = true
        timerFunc()
    }
}
const p = Promise.resolve()
timerFunc = () => {
    p.then(flushCallbacks)
}
function flushCallbacks() {
    pending = false
    const copies = callbacks.slice(0)
    callbacks.length = 0
    for (let i = 0; i < copies.length; i++) {
        copies[i]()
    }
}
// CONCATENATED MODULE: ./src/core/new_reactivity.js



//watch 就是一个单纯的


//重构的reactive
const ITERATE_KEY = Symbol('')

let effectId = 0;
//effect的栈
const effectStack = [];
let activeEffect;
/**
 * Effect 一个副作用函数，使用此函数时会产生一些副作用，比如说函数内获取用户的信息，去渲染一个用户信息页面
 * 这也是它的主要用途，它会在执行的中间打开一个运行栈，在依赖中收集所有用到的数据，然后当这些依赖的数据发生
 * 变化的时候，就会再次调用它自己，来达到（数据变化—>重新渲染视图）这个循环。
 * @param {*} fn 副作用的函数
 * @param {*} opts 参数 
 */
function new_reactivity_effect(fn, opts) {
    if (isEffect(fn)) {
        fn = fn.raw
    }
    if (!opts) {
        opts = {};
    }
    const _effect = createEffect(fn, opts);
    if (!opts.lazy) {
        _effect()
    }
    return _effect;
}

/**
 * 将fn与参数包装成一个新的Effect
 * @param {*} fn 
 * @param {*} opts 
 */
function createEffect(fn, opts) {
    let effect = function _createEffect() {
        console.log(...arguments)
        if (!effect.active) {
            return options.scheduler ? undefined : fn()
        }
        //队列内不存在就加入队列
        if (effectStack.indexOf(effect) === -1) {
            cleanup(effect)
            try {
                effectStack.push(effect);
                activeEffect = effect;
                return fn(...arguments);
            }
            finally {
                effectStack.pop();
                activeEffect = effectStack[effectStack.length - 1]
            }
        }
    }

    //初始化属性
    effect.id = effectId++;
    effect.raw = fn;
    effect.opts = opts;
    effect._isEffect = true;
    effect.active = true;
    effect.deps = [];
    return effect;
}

function stop(effect) {
    if (effect.active) {
        cleanup(effect)
        effect.active = false
    }
}

function cleanup(effect) {
    const { deps } = effect
    if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
            deps[i].delete(effect)
        }
        deps.length = 0
    }
}

function isEffect(effect) {
    return effect && effect._isEffect
}


const dep = new WeakMap(); //收集依赖的weakMap

//收集
function track(target, key) {
    if (activeEffect === undefined) {
        //不存在则不需要收集
        return;
    }

    let depRes = dep.get(target);
    if (!depRes) {
        dep.set(target, (depRes = new Map()));
    }

    let deps = depRes.get(key);
    if (!deps) {
        depRes.set(key, (deps = new Set()));
    }

    if (!deps.has(activeEffect)) {
        deps.add(activeEffect);
        activeEffect.deps.push(deps)
        //触发收集钩子
        if (activeEffect.opts.onTrack) {
            activeEffect.opts.onTrack(
                activeEffect,
                target,
                key
            )
        }
    }
}

//触发
function trigger(target, type, key, newValue, oldValue) {
    const depsMap = dep.get(target);
    if (!depsMap) {
        return;
    }
    const effects = new Set();
    const add = (needAddEffects) => {
        if (needAddEffects) {
            needAddEffects.forEach(effect => {
                if (effect !== activeEffect) {
                    effects.add(effect);
                }
            });
        }
    }

    if (key !== void 0) {
        add(depsMap.get(key))
    }

    switch (type) {
        case setType.ADD:
            if (!isArray(target)) {
                add(depsMap.get(ITERATE_KEY))
            } else if (isIntegerKey(key)) {
                // new index added to array -> length changes
                add(depsMap.get('length'))
            }
            break
        case setType.DELETE:
            if (!isArray(target)) {
                add(depsMap.get(ITERATE_KEY))
            }
            break
    }


    const run = (effect) => {
        let job = () => { };
        if (effect.opts.onTrigger) {
            effect.opts.onTrigger({
                effect,
                target,
                key,
                type,
                newValue,
                oldValue
            })
        }
        if (effect.opts.scheduler) {
            if(effect.opts.isComputed){
                effect.opts.scheduler(effect);
            }
            else{
                job = () => effect.opts.scheduler(effect)
            }
        } else {
            job = () => effect()
        }
        job.id = effect.id;
        queueJob(job);
    }
    effects.forEach(run)
}

function recordInstanceBoundEffect(effect, instance) {
    if (instance) {
        (instance.effects || (instance.effects = [])).push(effect)
    }
}


// -----------------------------------------------------------------------
const proxyMap = new WeakMap(); // 保存代理的原数据



function withComputedReactive(target, computeds) {
    if (!isObj(target)) {
        console.warn("[Sact-warn]:target must a object", target)
        throw new Error("reactive 传入的参数必须是个对象！")
    }
    const existingProxy = proxyMap.get(target)
    if (existingProxy) {
        return existingProxy
    }
    //初始化全部computed
    let proxy = new Proxy(target, {
        get(target, key, reciver) {
            if (computeds[key]) {
                return computeds[key].value;
            }
            else {
                return createGetter(target, key, reciver);
            }
        },
        set(target, key, value, reciver) {
            if (computeds[key]) {
                computeds[key].value = value;
                return true;
            }
            else {
                return createSetter(target, key, value, reciver);
            }
        },
        has(target,key){
            if (computeds[key]) {
                return true;
            }
            else {
                return Reflect.has(target,key);
            }
        }
    })
    proxyMap.set(target, proxy)
    return proxy;
}






/**
 * 将数据响应化
 * @param {*} data 
 */
function reactive(target) {
    if (!isObj(target)) {
        console.warn("[Sact-warn]:target must a object", target)
        throw new Error("reactive 传入的参数必须是个对象！")
    }
    const existingProxy = proxyMap.get(target)
    if (existingProxy) {
        return existingProxy
    }
    let proxy = new Proxy(target, {
        get: createGetter,
        set: createSetter,
        deleteProperty: createDeleter,
    })
    proxyMap.set(target, proxy)
    return proxy;
}

/**
 * 数据收集者
 * @param {*} params 
 */
function createGetter(target, key, reciver) {
    let res = Reflect.get(target, key, reciver);
    track(target, key);
    return isObj(res) ? reactive(res) : res;
}




const setType = {
    SET: 1,
    ADD: 1 << 1,
    DELETE: 1 << 2,
}
/**
 * 设置属性时
 * @param {} params 
 */
function createSetter(target, key, value, reciver) {
    const oldValue = target[key];
    const hadKey = hasOwn(target, key)
    const res = Reflect.set(target, key, value, reciver);
    if (!hadKey) {
        trigger(target, setType.ADD, key, value)
    } else if (value !== oldValue) {
        trigger(target, setType.SET, key, value, oldValue)
    }
    return res;
}

/**
 * 删除属性时
 * @param {*} target 
 * @param {*} key 
 * @returns 
 */

function createDeleter(target, key) {
    let res = Reflect.deleteProperty(target, key);
    trigger(target, setType.delete, key);
    return res;
}

// CONCATENATED MODULE: ./src/api/runtime-dom.js
//运行时使用的dom操作

/* harmony default export */ var runtime_dom = ({
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
    create(tag){
        if(tag === "svg" || tag === "path"){
            return document.createElementNS('http://www.w3.org/2000/svg',tag);
        }
        else{
            return document.createElement(tag);
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
});
// CONCATENATED MODULE: ./src/core/render.js




function render_render(vnode, container) {
    if (container) { //覆盖渲染
        let rel;
        rel = renElement(vnode);
        runtime_dom.replace(container, rel);
        vnode.context.$ele = rel;
    }
    else if (vnode.context.isComponent) { //组件初始化
        renElement(vnode);
    }
    else if (vnode.warpSact) { //抽象组件安装
        let achor = vnode.achor || vnode.parent;
        if (achor) {
            achor = getRealVnode(achor);
            let rel = vnode.element || renElement(vnode);

            //防止第一个元素插入的失败
            if (achor === vnode.parent.element) {
                //修复了插入第一个元素时的偏移
                runtime_dom.insert(rel, achor, achor.firstChild);
            }
            else {
                runtime_dom.insert(rel, achor.parentElement, runtime_dom.next(achor));
            }

        }
    }
    else {
        console.warn("[Sact-warn]:", vnode);
        throw new Error("渲染vnode错误！没有真实元素存在！")
    }
}


function getRealVnode(vnode) {
    while (!vnode.element) {
        vnode = vnode.achor;
    }
    return vnode.element;
}


/**
 * 传入vnode进行渲染或者patch
 * @param {*} v1 原来的vnode
 * @param {*} v2 新的vnode
 * @param {*} container element容器
 * @returns 
 */
function patch(v1, v2, container) {
    if (v1 === v2) {
        return;
    }
    else if (v1 && !v2) {
        destroryVnode(v1);
    }
    else if (v1 && v2 && sameNode(v1, v2)) {
        if (v2.isShow) {
            callHooks(v2, "onCreated", v1.element);
            patchVnode(v1, v2);
        }
        else if (v2.isHidden) {
            callHooks(v1, "onDestrory", v1.element, () => {
                patchVnode(v1, v2);
            })
        }
        else {
            patchVnode(v1, v2);
        }
    }
    //实例第一次生成
    else if (!v1 && v2 && container instanceof Element) {
        render_render(v2, container);
    }
    //组件第一次创建
    else if (!v1 && v2 && !container) {
        render_render(v2, null);
    }
    //transiton 过渡，先删除旧的再生成新的
    else if (v1 && v2) {
        translate(v1, v2);
    }
    else {
        console.warn("[Sact-warn]:not aivailable Vnode", v1, v2);
        throw new Error(`[Sact-error]:arguments error，please check！`)
    }
}


//过渡，判断是先出还是先入
function translate(v1, v2) {
    if (v1.componentOptions) {
        v1.componentOptions.Ctor.destory();
    }

    if (v1.onDestrory) {
        callHooks(v1, "onDestrory", v1.element,
            () => {
                render_render(v2, v1.element);
            });
        console
    }
    else {
        render_render(v2, v1.element);
    }
}


function patchVnode(v1, v2) {
    v2.element = v1.element;
    if (v1.tag === "_text_") {
        if (v1.text !== v2.text) {
            patchText(v2.text, v1.element);
        }
    }
    else if (v1.componentOptions && v2.componentOptions) {
        patchCompent(v1, v2);
    }
    //静态节点
    // else if (v2.type === 1) {
    //     return;
    // }
    else {
        patchAttrs(v1, v2);
        prePatchChildren(v1.children, v2.children, v1.element);
    }
    patchRefs(v1, v2);

}


function getRef(vnode) {
    return vnode.componentOptions ? vnode.componentOptions.Ctor : vnode.element;
}

function patchRefs(v1, v2) {
    const ref1 = getVnodeAttr(v1, "ref");
    const ref2 = getVnodeAttr(v2, "ref");
    const el2 = getRef(v2);
    if (ref1 && ref2) {
        if (ref1 !== ref2) {
            destroryRefs(v1);
            addRefs(v2);
        }
        else {
            destroryRefs(v1, el2);
        }
    }
}


function prePatchChildren(c1, c2, parent) {
    if ((c1 && c1.length > 0 && c2 && c2.length === 0) || (c1 && !c2)) {
        c1.forEach((child) => {
            destroryVnode(child)
        })
    }
    else if ((c1 && c1.length === 0 && c2 && c2.length > 0) || (!c1 && c2)) {
        renChildren(parent, c2)
    }
    else if (c1 && c1.length === 1 &&
        c2 && c2.length === 1 &&
        sameNode(c1[0], c2[0])
    ) {
        patchVnode(c1[0], c2[0]);
    }
    else if (c1 && c2) {
        patchChildren(parent, c1, c2);
    }
}


//更新文字
function patchText(vnode, rel) {
    rel.textContent = vnode;
}

//更新组件
function patchCompent(v1, v2) {
    let newOpts = v2.componentOptions;
    let oldOpts = v1.componentOptions
    let Ctor = (newOpts.Ctor = oldOpts.Ctor);
    //旧值
    let oldValue = [Ctor.$slot, Ctor.props];
    Ctor.$slot = renSlot(newOpts.children);
    Ctor.props = parsePropsData(Ctor, v2.data);
    //更换容器
    Ctor.wrapVnode = v2;
    //新值
    let newValue = [Ctor.$slot, Ctor.props]
    //shouldUpate
    if (Ctor.callHooks("shouldUpdate")(oldValue[1], newValue[1])) {
        if (shouldPacthComponent(oldValue, newValue)) {
            Ctor.patch();
            if (Ctor.isShowAttr) {
                setAttrs(Ctor.$ele, Ctor.props, Ctor);
            }
        }
    }
}
//判断是否应该刷新组件
function shouldPacthComponent([oldSlot, oldProps], [newSlot, newProps]) {
    if (!(oldSlot === newSlot)) {
        return true;
    }
    if (oldProps && newProps) {
        let oldKeys = Reflect.ownKeys(oldProps);
        let newKeys = Reflect.ownKeys(newProps);
        if (oldKeys.length !== newKeys.length) {
            return true;
        }
        for (let i = 0; i < oldKeys.length; i++) {
            let oldKey = oldKeys[i];
            let newKey = newKeys[i];
            if (!(oldProps[oldKey] === newProps[newKey])) {
                return true;
            }
        }
    }
    return false;
}
//更新属性
function patchAttrs(v1, v2) {
    let d1 = v1.data;
    let d2 = v2.data;
    let c;
    if (!sameAttrs(d1, d2, "class")) {
        c = d2["staticClass"] || ""
        runtime_dom.setAttribute(v1.element, "class", (c + " " + d2["class"]).trim())
    }
    else if (!sameAttrs(d1, d2, "staticClass")) {
        runtime_dom.setAttribute(v1.element, "class", d2["staticClass"])
    }
    constrast(d1.style, d2.style, "style", v1.element)
    constrast(d1.attrs, d2.attrs, "attrs", v1.element)
    constrast(d1.props, d2.props, "props", v1.element)
    constrast(d1.on, d2.on, "on", v1.element);
}

//diff算法核心 比较子数组
function patchChildren(parentEle, c1, c2) {
    vnodesTigger(c1, "onBeforeMove");
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
    let achor;
    if (oldStartIdx === -1) {//说明需要添加的元素在头部
        achor = c1[oldEndIdx + 1] && c1[oldEndIdx + 1].element;//选取被截取列表的随后的一个元素
    }
    else {
        achor = runtime_dom.next(c1[oldStartIdx].element); //正常情况锚点选取被截取列表的前一个元素
    }
    for (let nc of c4) {
        let finded = false;
        for (let oc of c3) {
            if (!oc.patched && sameNode(nc, oc)) {
                //找到就移动元素
                runtime_dom.insert(oc.element, parentEle, achor);
                patchVnode(oc, nc);
                oc.patched = true;
                achor = runtime_dom.next(nc.element);
                finded = true;
                break;
            }
        }
        //没有找到就新建插入
        if (!finded) {
            let rel = renElement(nc)
            runtime_dom.insert(rel, parentEle, achor);
            achor = runtime_dom.next(nc.element);
        }
    }
    //删除未处理到的dom
    for (let oc of c3) {
        if (!oc.patched) {
            destroryVnode(oc)
        }
    }
    vnodesTigger(c1, "onMove");
}


function sameNode(v1, v2) {
    return (v1.tag === v2.tag && v1.key === v2.key)
}
//比较属性并更改
function constrast(la, na, key, rel) {
    let hasText = []
    if (na && la) {
        for (let newAttr of Reflect.ownKeys(na)) {
            if (!sameAttrs(na, la, newAttr)) {
                if (key === "attrs") {
                    runtime_dom.setAttribute(rel, newAttr, na[newAttr]);
                }
                else if (key === "on") {
                    resetBindListener(rel, newAttr, na[newAttr], la[newAttr]);
                }
                else if (key === "style") {
                    rel.style[newAttr] = na[newAttr];
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
                    runtime_dom.removeAttribute(rel, oldAttr);
                }
                else if (key === "on") {
                    unBindListener(rel, oldAttr, la[oldAttr]);
                }
                else if (key === "style") {
                    rel.style[oldAttr] = null;
                }
                else {
                    rel[oldAttr] = null;
                }
            }
        }
    }
}
//重置绑定事件
function resetBindListener(rel, Name, newValue, oldValue) {
    unBindListener(rel, Name, oldValue);
    bindLisenter(rel, { [Name]: newValue })
}

function unBindListener(rel, Name, oldValue) {
    rel.removeEventListener(Name, oldValue._wrapper);
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
        vnode.element = renComponent(vnode, vnode.componentOptions)
        callHooks(vnode, "onCreated", vnode.element)
        addRefs(vnode);
        return vnode.element;
    }

    //正常元素
    const { tag, data, children, key } = vnode;
    const rel = (vnode.element = runtime_dom.create(tag));

    if (data) {
        setAttrs(rel, data, vnode["context"]);
    }
    if (children) {
        renChildren(rel, children);
    }
    if (key) {
        runtime_dom.setAttribute(rel, "key", key);
    }

    vnode.element = rel;
    addRefs(vnode);

    callHooks(vnode, "onCreated", rel);
    return rel;
}

//添加ref
function addRefs(vnode) {
    const ref = getVnodeAttr(vnode, "ref");
    if (ref) {
        const el = vnode.componentOptions ? vnode.componentOptions.Ctor : vnode.element;
        const { context } = vnode;

        let oldRef = context.$refs[ref];
        if (oldRef && isArray(oldRef)) {
            oldRef.push(el);
        }
        else if (oldRef) {
            context.$refs[ref] = [oldRef, el];
        }
        else {
            context.$refs[ref] = el;
        }
    }
}

function renComponent(vnode, option) {
    let { Ctor, children } = option;
    const { key, data } = vnode;

    //渲染的时候再实例化Ctor;
    //这样可以减少很大一部分的内存占用
    Ctor = option.Ctor = Ctor();
    Ctor.wrapVnode = vnode;

    //传入store
    if (vnode.context.$store) {
        Ctor.$store = vnode.context.$store;
    }

    //传入props和插槽
    let props = parsePropsData(Ctor, data);
    Ctor.$slot = renSlot(children);

    //开始渲染
    let ele = null;

    Ctor.patch();
    Ctor._mounted = true;

    ele = Ctor.$ele;

    if (Ctor.$vnode) {
        Ctor.$vnode.parent = vnode;
    }

    if (Ctor.isShowAttr) {
        setAttrs(ele, props, Ctor);
    }

    if (key) {
        runtime_dom.setAttribute(ele, "key", key);
    }
    return ele;
}


//生成插槽
function renSlot(children) {
    let res = {};
    if (Array.isArray(children)) {
        res["default"] = children;
    }
    else {
        return undefined;
    }
    return res;
}


//转换变量名
function toCamelCase(name) {
    let l = name.split("-");
    if (l.length > 1) {
        let res = l[0];
        for (let i = 1; i < l.length; i++) {
            res += l[i].slice(0, 1).toUpperCase() + l[i].slice(1)
        }
        return res;
    }
    else {
        return name;
    }
}
//传入父组件的参数
function parsePropsData(Ctor, data) {

    //装载props
    let props = {};
    let propsCheck = Ctor.$propsCheck;
    let res = {};
    for (let i of Reflect.ownKeys(data)) {
        let attrs = data[i];
        //style 与 class除外
        if (i === "style" || i === "staticClass") {
            res[i] = attrs;
        }
        else if (isObj(attrs)) {
            for (let key of Reflect.ownKeys(attrs)) {
                let attr = attrs[key];
                key = toCamelCase(key);
                if(Ctor.propsTransfrom && attr === ""){
                    attr = true;
                }
                props[key] = attr;
            }
        }
    }

    //检查props
    if (propsCheck) {
        for (let prop of Reflect.ownKeys(propsCheck)) {
            let checker = propsCheck[prop];
            res[prop] = checkProps(checker, props[prop], prop, Ctor.name)
        }
    }

    else if (Reflect.ownKeys(props).length > 0) {
        sactWarn(`this component '${Ctor.name}' not defined props,
                    but this component was feeded in some props '${Reflect.ownKeys(props)}',this props will be not available,
                    beacuse those maybe will cause some wrong. we do not recommond`)
    }

    Ctor.props = res;
    return res;
}

//检查props正确性
function checkProps(checker, attr, key, cname) {
    let { type, validator, required } = checker;

    if (attr === undefined || attr === null) {
        return checker.default || attr;
    }

    //先判断是否为必须
    if (required && attr === undefined) {
        throw new Error(`\n[Sact-warn]:this component '${cname}',` +
            `it's prop [${key}] is required ,` +
            `but it was not feeded in a availalbe value,` +
            `please check this!`
        )
    }

    //自定义检查函数
    if (isFunc(validator) && validator(attr)) {
        return attr;
    }
    //正常类型检查
    let type_error = `\n[Sact-warn]:this component '${cname}', it's prop [${key}] should be '${String(type)}',but it was feeded in '${typeof attr}',please check this!`

    if (isString(type)) {
        if (type === "any") {
            return attr;
        }
        if (typeof attr !== type) {
            throw new TypeError(type_error)
        }
        else {
            return attr;
        }
    }
    else if (isFunc(type)) {
        if (attr instanceof type) {
            return attr;
        }
        else {
            throw new TypeError(type_error)
        }
    }
    else if (isArray(type)) {
        for (let t of type) {
            if (isString(t)) {
                if (typeof attr === t) {
                    return attr;
                }
            }
            else if (isFunc(t)) {
                if (attr instanceof t) {
                    return attr;
                }
            }
        }
        throw new TypeError(type_error)
    }
    else {
        throw new Error(`[Sact-warn]:this component '${cname}', invalidated type '${type}'`)
    }
}



function destroryVnode(vnode) {
    if (vnode.componentOptions) {
        vnode.componentOptions.Ctor.destory();
    }
    if (vnode.onDestrory) {
        callHooks(vnode, "onDestrory", vnode.element, () => runtime_dom.remove(vnode.element));
    }
    else {
        runtime_dom.remove(vnode.element);
    }
    destroryRefs(vnode);
}


function destroryRefs(vnode, replace) {
    const ref = getVnodeAttr(vnode, "ref");
    if (ref) {
        const el = vnode.componentOptions ? vnode.componentOptions.Ctor : vnode.element;
        const { context } = vnode;

        let oldRef = context.$refs[ref];
        if (oldRef && isArray(oldRef)) {
            const index = oldRef.indexOf(el);
            if (index > -1) {
                replace ? oldRef.splice(index, 1, replace) : oldRef.splice(index, 1);
            }
        }
        else if (oldRef) {
            replace ? context.$refs[ref] = replace : Reflect.deleteProperty(context.$refs, ref);
        }
    }
}


function render_isComponent(vnode) {
    return vnode.componentOptions;
}


function renChildren(rel, children) {
    if (Array.isArray(children)) {
        for (let child of children) {
            let res = renElement(child);
            if (res) {
                rel.appendChild(res);
            }
            else if (res !== undefined) {
                console.log(child, res);
                throw new Error("非法vnode！")
            }
        }
    }
}
function setAttrs(rel, data, self) {
    let c = "";
    if (!rel) {
        return;
    }
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
                {
                    if (i === "staticClass") {
                        c += data[i] + " ";
                    }
                    else if (i === "class") {
                        c += data[i] + " ";
                    }
                    else if (i === "style") {
                        setStyle(rel, data[i]);
                    }
                    else {
                        runtime_dom.setAttribute(rel, i, data[i])
                    }
                }
        }
        if (c !== "") {
            runtime_dom.setAttribute(rel, "class", c.trim());
        }
    }
}


function setStyle(rel, style) {
    let type = typeof style;
    if (type === "object") {
        let keys = Reflect.ownKeys(style)
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            rel.style[key] = style[key];
        }
    }
}

function setPropsAttrs(rel, props) {
    for (let i of Reflect.ownKeys(props)) {
        rel[i] = props[i];
    }
}
function bindLisenter(rel, lisenters) {
    let keys = Reflect.ownKeys(lisenters)
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let handler = lisenters[key]._wrapper = function () {
            if (typeof lisenters[key] !== "function") {
                throw new Error(`${key} 不是一个合法的函数，请检查！`)
            }
            lisenters[key](...arguments);
        };
        rel.addEventListener(key, handler)
    }
}
function setDomAttrs(rel, attrs) {
    for (let i of Reflect.ownKeys(attrs)) {
        runtime_dom.setAttribute(rel, i, attrs[i])
    }
}


function vnodesTigger(vnodes, name) {
    vnodes.forEach(v => {
        callHooks(v, name, v.element)
    });
}


//触发vnode的生命周期函数
function callHooks(vnode, name, ...args) {
    if (vnode[name]) {
        vnode[name](...args)
    }
}


// CONCATENATED MODULE: ./src/core/computed.js

class computed_computedNode{
    constructor(name,fn,sact){
        this.name = name;
        this._is_computed = true;
        this._init = false;
        this._value;
        this.sact = sact;
        fn = fn.bind(sact);

        this.effect = new_reactivity_effect(fn,{
            lazy:true,
            isComputed:true,
            scheduler:()=>{
                this._value = fn();
                trigger(sact.$data,setType.SET,this.name);
            }
        })
        recordInstanceBoundEffect(this.effect,sact);
    }

    get value(){
        if(!this._init){
            this._init = true;
            this._value = this.effect();
        }
        track(this.sact.$data,this.name);
        return this._value;
    }

    set value(newValue){
        this._value = newValue;
        trigger(this.sact.$data,setType.SET,this.name);
    }
}
// CONCATENATED MODULE: ./src/component/transition.js



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
    const Ctor = vnode && vnode.componentOptions && vnode.componentOptions.Ctor;
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

function getCtor(vnode) {
    return vnode && vnode.componentOptions && vnode.componentOptions.Ctor
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
    if (props && props.style) {
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

const transitionProps = {
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



/* harmony default export */ var transition = ({
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
        const create = whenCreate.bind(this);
        const destrory = whenLeave.bind(this);

        //处理s-show
        dealShow(this._data, child);
        child.onCreated = create;
        child.onDestrory = destrory

        //挂载数据
        child._data = this._data;
        child.achor = this.wrapVnode.achor;
        child.parent = this.wrapVnode.parent;

        //处理外包裹
        const warpComponent = getCtor(this.wrapVnode.parent) || (!this.wrapVnode.parent && this.wrapVnode.context);
        if(warpComponent){
            warpComponent.wrapVnode.onDestrory = destrory;
        }

        this.oldChild = child;
        return child;
    }
});
// CONCATENATED MODULE: ./src/core/init.js










let cid = 0;

function initAll(options) {
    this.$options = options;
    initWhen(this);
    this.callHooks("beforeCreate");
    initParma(this);
    initElement(this);
    initProps(this);
    initMethod(this);
    initComputed(this);
    initData(this);
    initComponent(this);
    this.callHooks("created");

    //仓库模式无需初始化
    if (this._isStore) {
        initStore(this);
    }
    else {
        initRender(this);
        initPatch(this);
    }
}


function initParma(sact){
    const { isShowAttr,propsTransfrom } = sact.$options;
    sact.isShowAttr = isShowAttr === undefined ? true : false; //默认显示属性在组件上
    sact.propsTransfrom = propsTransfrom === undefined ? false : true; //将空属性转换成true，false
}
//初始化对象
function initElement(sact) {

    sact._mounted = false;
    sact._isStore = false;
    sact._shouldMount = true;
    sact.uid = cid++;

    const el = sact.$options.el || sact.$options.ele;
    let { store, template, component } = sact.$options;
    //仓库模式
    if (isStore(el)) {

        let baseList = traverse(el);
        sact._isStore = true;
        sact._goods = [];

        baseList.forEach((good) => {
            sact._goods.push({
                el: good,
                store: sact,
                component,
            })
        })
    }
    //单实例模式
    else if (el) {
        sact.$ele = getRealDom(el);
        template = template || sact.$ele.outerHTML;
        if (store) {
            sact.$store = store;
        }

    }
    sact.$template = template;

    //用于存储真实元素
    //如果是节点则存储sact实例
    //如果有多个同名变量则返回一个列表
    sact.$refs = {};
}

//判断绑定的元素是否是仓库模式
function isStore(el) {
    return (isArray(el) || el instanceof NodeList)
}

function getRealDom(el) {
    if (el instanceof Element || el instanceof Node) {
        return el;
    }
    else if (isString(el)) {
        return document.querySelector(el)
    }
    throw new Error(`[Sact-warn]:${el} 在页面内找不到真实元素！`)
}

//将内置的列表全部合并到一个列表内
function traverse(value, seen = new Set()) {
    if (isArray(value) || value instanceof NodeList) {
        for (let i = 0; i < value.length; i++) {
            traverse(value[i], seen)
        }
    } else if (isSet(value)) {
        value.forEach((v) => {
            traverse(v, seen)
        })
    } else {
        if (!seen.has(value)) {
            seen.add(value);
        }
    }
    return seen;
}


//初始化watcher
function initWatch(sact) {
    let { watch } = sact.$options;
    sact.$watch = {};
    if (isObj(watch)) {
    }
}





//初始化computed属性
function initComputed(sact) {
    let { computed } = sact.$options;
    sact.$computed = {};

    if (isObj(computed)) {
        for (const key in computed) {
            let fn = computed[key];
            if (isFunc(fn)) {
                sact.$computed[key] = new computed_computedNode(key, fn, sact);
            }
            else {
                throw new Error("[Sact-warn]:computed must is a function!")
            }
        }
    }
}




//初始化数据
function initData(sact) {
    const options = sact.$options;
    let data = options.data;
    if (options.data && typeof options.data === "function") {
        data = data.apply(sact);
        if (!isObj(data)) {
            throw new Error("[Sact-warn]:data返回的必须是一个对象！")
        }
    }
    if (options.reactive === false) {
        sact.data = data;
    }
    else if (data) {
        sact.data = withComputedReactive(data, sact.$computed);
    }
    else {
        sact.data = {};
    }
    sact.$data = data;
}

//初始化方法
function initMethod(sact) {
    const options = sact.$options;
    let m = options.method || options.methods;
    if (isObj(m)) {
        for (let funName of Reflect.ownKeys(m)) {
            if (!typeof m[funName] === "function") {
                throw new Error(`${funName} 不为function，请检查！`)
            }
            sact[funName] = m[funName].bind(sact);
        };
    }
    sact.effects = [];
    sact._c_ = (a, b, c, type, zid) => createVnode(sact, a, b, c, type, zid);
    sact._f_ = (i, f) => createFor(i, f);
}


//初始化组件功能
function initComponent(sact) {
    const options = sact.$options;
    let { isComponent, component, isAbstract } = options;
    if (isComponent) { //自身为组件时
        sact.isComponent = true;
        sact.isAbstract = isAbstract; //抽象组件
        sact.name = options.name;
        sact._shouldMount = false;
    }
    //内置keep-alive 与 transition;
    sact.components = { transition: sact_Sact.component(transition) };
    if (isObj(component)) { //使用组件时,将组件添加到环境中
        for (let con of Reflect.ownKeys(component)) {
            if (isObj(component[con])) {
                sact.components[component[con].sname] = sact_Sact.component(component[con]);
            }
            else if (component[con].isComponent) {
                sact.components[component[con].sname] = component[con];
            }
        }
    }
}


//初始化渲染功能
function initRender(sact) {
    const options = sact.$options;

    if (sact.isAbstract === true) {
        sact._render = () => null
    }
    else {
        if (sact.$template) {
            sact.$createVnode = generate(Parse(sact.$template))
            sact._render = () => sact.$createVnode(sact);
        }
        else {
            console.warn("[Sact-warn]:not available template!", options);
            throw new Error("模板不存在，请检查你是否传入有效的template参数！")
        }
    }

    //当sact为组件时的渲染方法在vnode里面生成
    //用户可以自定义render函数，手动修改vnode来渲染,不过随意修改vnode会造成patch错误，请小心使用
    let { render } = options;
    if (render && typeof render === "function") {
        sact._render = (props) => render.apply(sact, [sact._c_, props]);
    }
}


//初始化继承
function initProps(sact) {
    /**
    示例props
    props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
     */
    const options = sact.$options;
    let { props } = options;
    if (!props) {
        return;
    }
    let res = {};
    if (isFunc(props)) {
        props = props.call(sact);
    }
    if (isArray(props)) {
        props.forEach((key) => {
            res[key] = {
                type: "any",
            };
        })
    }
    else if (isObj(props)) {
        for (let key in props) {
            res[key] = createProps(props[key]);
        }
    }
    else {
        console.warn("[Sact-warn]:please check your props, It's not a Array or Object", props);
        throw new Error("请输入正确的props选项，支持Array与Obj类型!")
    }
    sact.$propsCheck = res;
}


function createProps(obj) {
    let res = {
        type: "any",  //类型，可以为列表
        default: undefined, //默认值
        validator: null, //验证函数，要返回true或false
        required: false,  //是否需要
    }
    if (isArray(obj)) {
        res.type = obj;
    }
    else if(isObj(obj)){
        res = obj;
    }
    else {
        res.type = obj;
    }
    return res;
}




//初始化生命周期
function initWhen(sact) {
    /**
     * 目前支持的周期函数
     * beforeCreate 刚刚实例化 data，method都还无法调用
     * created  已经创建 data，method可以调用，还未生成虚拟vnode
     * beforeMount  挂载之前 这时虚拟vnode尚未生成
     * mounted  装载后 这时实例已经开始正常运行了，所有属性都可以访问了
     * shouldUpdate（oldProps，newProps）传入老的props和新的props，可以自行根据返回值来判断更新
     * beforeUpdate 数据更新前，这时数据已经修改完毕，但是尚未更新
     * updated  数据更新完毕了，这时真实dom已经修改过了
     * beforeDestory  （仅限组件）删除前，要删除实例时，会先调用这个方法，此时所有数据均可以访问
     * destroyed （仅限组件）删除后，已经删除完毕，响应式数据均已解绑
     */
    const opts = sact.$options;
    sact.callHooks = function (fnName) {

        let fn = opts[fnName];
        let type = typeof fn;

        if (fnName === "shouldUpdate") {

            return function (o, v) {

                if (fn && type === "function") {
                    return fn.apply(sact, [o, v]);
                }

                return true;
            }
        }
        else if (fn && type === "function") {

            return fn.apply(sact);
        }
    }
}

function initPatch(sact) {

    let job = function () {
        if (this._mounted) {
            this.callHooks("beforeUpdate");
        }
        else {
            this.callHooks("beforeMount")
        }

        let oldVnode = this.$vnode;
        this.$vnode = this._render(this.props);

        if (this.$vnode) {
            this.$vnode.warpSact = this;
        }

        patch(oldVnode, this.$vnode, this.$ele);

        this.$ele = this.$vnode && this.$vnode.element;

        if (this._mounted) {
            this.callHooks("updated");
        }
        else {
            this.callHooks("mounted")
        }
    }

    sact.patch = new_reactivity_effect(job.bind(sact), {
        lazy: true
    });

    recordInstanceBoundEffect(sact.patch, sact);

    if (sact._shouldMount) {
        sact.patch();
        sact._mounted = true;
        sact._shouldMount = false;
    }
}

//初始化仓库
function initStore(sact) {
    sact._goods = sact._goods.map((opts) => {
        return new sact_Sact(opts)
    })
}
// CONCATENATED MODULE: ./src/sact.js
//自制的简易MVVM框架(主要借鉴的vue和react)




class sact_Sact {
  constructor(options) {
    this._init = initAll;
    this._init(options);
  }
  destory() {
    this.callHooks("beforeDestory");
    this.effects.forEach(v => {
      stop(v);
    });
    this.effects.length = 0;
  }


}
sact_Sact.version = "0.1.4";

sact_Sact.component = function (options) {
  if(!options.name){
    throw new Error("[Sact-warn]:you must set a name for component!")
  }
  let Ctor = function () { return new sact_Sact({ ...options, isComponent: true }) }
  Ctor.sname = options.name;
  Ctor.isComponent = true;
  return Ctor;
}

sact_Sact.link = function () {
  const setting = {};
  const _get = function (target, key, receiver) {
    if (key === "do") {
      return new sact_Sact(setting);
    }
    return function (value) {
      if (!setting[key]) {
        setting[key] = value;
      }
      else {
        extend(setting[key], value)
      }
      return this;
    }
  }
  return new Proxy({}, { get: _get })
}
// CONCATENATED MODULE: ./src/main.js

window.Sact = sact_Sact;
/* harmony default export */ var main = __webpack_exports__["default"] = (sact_Sact);

/***/ })
/******/ ]);