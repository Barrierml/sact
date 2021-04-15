const baseTypeList = [
    "boolean", "number", "string", "symbol", "undefined"
]

export function sactWarn(text, ...args) {
    console.warn("%c [Sact-Warn]:" + text,
        "color:red;font-size:16px;",
        ...args);
}



//获取vnode.data.attrs属性删除并返回值
export function getAndRemoveVnodeAttr(vnode,attrName) {
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
export function getVnodeAttr(vnode,attrName) {
    let val;
    val = vnode.data 
        && vnode.data.attrs 
        && vnode.data.attrs[attrName];
    return val;
}


//获取属性并删除
export function getAndRemoveAttr(el, attr) {
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
export function isBaseType(obj) {
    let t = typeof obj
    return baseTypeList.includes(t);
}

export function isObj(obj) {
    return obj && typeof (obj) === "object" && obj !== null
}
//扩展对象属性
export function extend(obj, res) {
    if (!isObj(res)) {
        return obj;
    }
    for (let i of Reflect.ownKeys(res)) {
        obj[i] = res[i]
    }
    return obj;
}
export function exceptExtend(obj, res) {
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
export function listToMap(list) {
    let res = {};
    for (let i of (list)) {
        res[i.name] = i.value;
    }
    return res;
}

//克隆一个新的静态对象
export function cloneStaticObj(obj) {
    let res;
    for (let i of Reflect.ownKeys(obj)) {
        if (typeof obj[i] === "object") {
            res[i] = cloneStaticObj(obj[i]);
        }
        res[i] = obj[i];
    }
    return res;
}


export const remove = (arr, el) => {
    if (!isArray(arr)) {
        return;
    }
    const i = arr.indexOf(el)
    if (i > -1) {
        arr.splice(i, 1)
    }
}

//获取循环获取数据
export function getDataInData(VName, data) {
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
export const AttrsTag = new RegExp(`${leftAttrsTag}\\s*([\\w\\.\\(\\)\\]\\[\\|&_$\\?\\:\\s\\']+)\\s*${rightAttrsTag}`)
//判断含有为动态变量并返getDynamicName回变量名 出现的位置 和最后的位置
export function getDynamicName(str) {
    let res = AttrsTag.exec(str)
    if (res) {
        return [res[1], res["index"], res["index"] + res[0].length]
    }
    return [];
}

export const isArray = Array.isArray;
export const isString = (val) => typeof val === "string";
export const isNum = (val) => typeof val === "number";
export const hasOwn = (val, key) => Reflect.has(val, key)
export const isFunc = (val) => typeof val === "function";
export const isMap = (val) => toTypeString(val) === '[object Map]'
export const isSet = (val) => toTypeString(val) === '[object Set]'
export const isDate = (val) => val instanceof Date
export const objectToString = Object.prototype.toString
export const toTypeString = (value) => objectToString.call(value)
export const isPromise = (val) => isObj(val) && isFunc(val.then) && isFunc(val.catch)

export const isIntegerKey = (key) =>
    isString(key) &&
    key !== 'NaN' &&
    key[0] !== '-' &&
    '' + parseInt(key, 10) === key;


export function compareStringList(l1,l2) {
    if((isArray(l1) && isArray(l2)) && (l1.length === l2.length)){
        for(let i = 0;i<l1.length;i++){
            if(l1[i] !== l2[i]){
                return false;
            }
        }
        return true;
    }
    return false;
}