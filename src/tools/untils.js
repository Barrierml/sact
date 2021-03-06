const baseTypeList = [
    "boolean","number","string","symbol","undefined"
]
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
export function isBaseType(obj){
    let t = typeof obj
    return baseTypeList.includes(t);
}

export function isObj(obj){
    return obj && typeof (obj) === "object" && obj !== null
}
//扩展对象属性
export function extend(obj, res) {
    if(!isObj(res)){
        return obj;
    }
    for (let i of Reflect.ownKeys(res)) {
        obj[i] = res[i]
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
export const AttrsTag = new RegExp(`${leftAttrsTag}\\s*([\\w\\.]+)\\s*${rightAttrsTag}`)
//判断含有为动态变量并返回变量名 出现的位置 和最后的位置
export function getDynamicName(str) {
    let res = AttrsTag.exec(str)
    if(res){
        return [res[1],res["index"],res["index"] + res[0].length]
    }
    return false;
}