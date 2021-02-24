//将ast语法树转化成语法
import { getAndRemoveAttr, getDynamicName, AttrsTag } from "../tools/untils.js"
//给每个元素附上索引
let zid = 0;
const simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/
export default function generate(ast) {
    const code = genElement(ast);
    return new Function(`with(this){
        with(data){
             return ${code}
        }
    }`)
}

function genElement(ast) {
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
        return `_c_('${ast.tagName}', ${genData(ast)}, ${genChildren(ast)},${zid++})`;
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

    let data = "{";
    let attrs = `attrs:{`;
    let events = {};
    let hasAttrs = false;
    let hasProps = false;
    let hasEvents = false;
    let props = `props:{`

    const classBinding = getAndRemoveAttr(ast, 's:class') || getAndRemoveAttr(ast, 's-bind:class') || getAndRemoveAttr(ast, ':class');
    if (classBinding) {
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
            name = name.replace(/^:|^s-bind:|^s:/, '');
            if (name === 'style') {
                data += `style: ${value},`;
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
            const modifiers = parseModifiers(name);  // 事件修饰符（.stop/.prevent/.self）
            name = removeModifiers(name);
            hasEvents = true;
            name = name.replace(/^@|^s-on:|s@/, '');
            addHandler(events, name, value, modifiers);
        }
        else {
            hasAttrs = true;
            attrs += `"${name}": (${JSON.stringify(value)}),`;
        }
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
            return genText(node);
        }
    }).join(',') + ']';
}
function genText(text) {
    if (text === ' ') {
        return '" "';
    } else {
        const exp = parseText(text);
        if (exp) {
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
    let res = "", hasName;
    while (hasName = getDynamicName(text)) {
        if (hasName[1] === 0) {
            res += `(${hasName[0]})+`;
        }
        else {
            res += `'${text.substring(0, hasName[1]).trim()}' +(${hasName[0]})+`;
        }
        text = text.substring(hasName[2]);
    }
    if (text) {
        res += "'" + text.trim() + "'";
    }
    else {
        res = res.substr(0, res.length - 1);
    }
    return res;
}




