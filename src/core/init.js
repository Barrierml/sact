import { isArray, isFunc, isObj, isSet, isString } from "../tools/untils.js";
import Parse from "./Parser.js";
import Generate from "./generate.js";
import { effect, recordInstanceBoundEffect, withComputedReactive } from "./new_reactivity.js";
import { createVnode, createFor } from "./vnode.js";
import Sact from "../sact.js";
import { patch } from "./render.js";
import { computedNode } from "./computed.js";
import transition from "../component/transition.js";
import route from "../component/router.js"


let cid = 0;

export default function initAll(options) {
    this.$options = options;
    initParma(this);
    initWhen(this);
    this.callHooks("beforeCreate");
    initElement(this);
    initProps(this);
    initMethod(this);
    initComputed(this);
    initData(this);
    initComponent(this);

    this.callHooks("created");
    //仓库模式无需初始化
    if (this.$swtich._isStore) {
        initStore(this);
    }
    else {
        initRender(this);
        initPatch(this);
    }

}


function initParma(sact) {
    const { isShowAttr, propsTransfrom, propsCheck } = sact.$options;
    const $swtich = sact.$swtich = new Object(); //用于存储sact的各种开关和初始变量
    $swtich._isShowAttr = isShowAttr === undefined ? true : isShowAttr; //默认显示属性在组件上
    $swtich._propsTransfrom = propsTransfrom === undefined ? false : true; //将空属性转换成true，false
    $swtich._propsCheck = propsCheck === undefined ? true : propsCheck; //是否开启属性检查,非声明props不接受
}
//初始化对象
function initElement(sact) {
    const { $swtich } = sact;
    $swtich._mounted = false;
    $swtich._isStore = false;
    $swtich._shouldMount = true;
    sact.$sactId = cid++; //每一个sact独有的一个id

    const el = sact.$options.el || sact.$options.ele;
    let { store, template, component } = sact.$options;
    //仓库模式
    if (isStore(el)) {

        let baseList = traverse(el);
        $swtich._isStore = true;
        $swtich._goods = [];

        baseList.forEach((good) => {
            $swtich._goods.push({
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
                sact.$computed[key] = new computedNode(key, fn, sact);
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
    sact.$effects = []; //存储所有effect
    sact._c_ = (a, b, c, type, zid) => createVnode(sact, a, b, c, type, zid);
    sact._f_ = (i, f) => createFor(i, f);
}


//初始化组件功能
function initComponent(sact) {
    const options = sact.$options;
    const { $swtich } = sact;
    let { isComponent, component, isAbstract } = options;
    if (isComponent) { //自身为组件时
        $swtich.isComponent = true;
        $swtich.isAbstract = isAbstract; //抽象组件
        sact.name = options.name;
        $swtich._shouldMount = false;
    }
    //内置keep-alive、 transition 、route ;
    sact.$components = { transition: Sact.component(transition), route: Sact.component(route) };
    if (isObj(component)) { //使用组件时,将组件添加到环境中
        for (let con of Reflect.ownKeys(component)) {
            if (component[con].isComponent) {
                sact.$components[component[con].sname] = component[con];
            }
            else if (isObj(component[con])) {
                if (!component[con].name) {
                    throw new Error("[Sact-warn]:you must set a name for component!")
                }
                sact.$components[component[con].name] = Sact.component(component[con]);
            }
        }
    }
}


//初始化渲染功能
function initRender(sact) {
    const options = sact.$options;
    const { $swtich } = sact;
    if ($swtich.isAbstract === true) {
        sact._render = () => null
    }
    else {
        if (sact.$template) {
            sact.$createVnode = Generate(Parse(sact.$template))
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
    else if (isObj(obj)) {
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
    const { $swtich } = sact;
    let job = function () {
        if ($swtich._mounted) {
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

        if ($swtich._mounted) {
            this.callHooks("updated");
        }
        else {
            this.callHooks("mounted")
        }
    }

    sact._patch = effect(job.bind(sact), {
        lazy: true
    });

    recordInstanceBoundEffect(sact._patch, sact);

    if ($swtich._shouldMount) {
        sact._patch();
        $swtich._mounted = true;
        $swtich._shouldMount = false;
    }
}

//初始化仓库
function initStore(sact) {
    const { $swtich } = sact;
    $swtich._goods = $swtich._goods.map((opts) => {
        return new Sact(opts)
    })
}