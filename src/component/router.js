import { queueJob } from "../core/scheduler.js";
import { isArray, sactWarn } from "../tools/untils.js"
//用来存储所有路由信息
const Router = {
    children: {},
    routes: new Set(),
};
//用来保存递归深度
const stack = [];
const getHash = (hash) => (hash && hash.slice(1)) || "/";
let currentHash = getHash(window.location.hash);
let oldHash = currentHash;
let currentRouter = null;

//接收参数
const props = {
    "path": "string",
    "component": "string",
}

let Router_inited = false;

window.r = Router;

function Router_init() {
    window.addEventListener('hashchange', () => {
        currentHash = getHash(window.location.hash);
        route();
        oldHash = currentHash;
    })
    Router_inited = true;
}


function route() {

    const n = currentHash.split("/");
    const o = oldHash.split("/");
    console.log("检测到变化,从", o, n)
    let nRoute = Router; //新旧指针
    let oRoute;

    let i = 1;
    for (; i < n.length; i++) {
        if (n[i] !== o[i]) {
            break;
        }
        else {
            nRoute = nRoute && nRoute.children[n[i]];
        }
    }

    currentRouter = nRoute;
    oRoute = nRoute;

    //通知新的开启旧的关闭
    //只用通知最外层即可
    nRoute = nRoute.children[n[i]];
    oRoute = oRoute.children[o[i]];
    if (nRoute) {
        nRoute.routes.forEach(routerOpen);
        currentRouter = nRoute;
    }
    if (oRoute) {
        oRoute && oRoute.routes.forEach(routerClose);
    }
}


//先对外层环境进行更新，更新插槽然后再进行更新
const routerClose = (e) => { console.log("关闭", e.fullPath); queueJob(e.wrapVnode.context._patch); e.data.show = false; }
const routerOpen = (e) => { console.log("开启", e.fullPath); queueJob(e.wrapVnode.context._patch); e.data.show = true; }


//检查参数
function checkProps(props) {
    const { path, component } = props;
    if (!path) {
        sactWarn(`invaild path of router '${path}', please check!`);
        throw Error(`invaild path of router '${path}', please check!`);
    }
    if (!component) {
        sactWarn(`invaild component of router '${component}', this component will be replaced by a div box!`);
        props.component = 'div';
    }
    return [path, component];
}

//获取所有子组件
function getAllRawChilds(slot) {
    return slot && slot["default"];
}

function getFullPath(route) {
    let res = [];
    while (route.path) {
        res.push(route.path);
        route = route.parent;
    }
    res.push("");
    return res.reverse();
}

function compareList(l1, l2) {
    if ((isArray(l1) && isArray(l2))) {
        for (let i = 0; i < Math.min(l1.length, l2.length); i++) {
            if (l1[i] !== l2[i]) {
                return false;
            }
        }
        return true;
    }
    return false;
}


//压入栈
function addRouter(path, sact) {
    const current = currentRouter || stack[stack.length - 1];
    const children = (current ? current : Router).children;
    let res = path === "/" ? Router : children[path];
    if (!res) {
        res = children[path] = {
            path,
            children: {},
            parent: current ? current : Router,
            routes: new Set(),
        }
    }
    res.routes.add(sact);
    sact.warpRouter = res;
    stack.push(res);
}

//出栈
function pop() {
    stack.pop();
}


window.r = Router;
export default {
    name: "route",
    isAbstract: true,
    isShowAttr: false,
    propsCheck: false,
    props,
    data() {
        return {
            show: false,
        }
    },
    beforeMount() {
        this.components = this.wrapVnode.context.components;
        if (!Router_inited) {
            Router_init();
        }
        const [path] = checkProps(this.props);
        addRouter(path, this);
        const fullPath = getFullPath(this.warpRouter);
        console.log(fullPath, "被创建", this.warpRouter);
    },
    mounted() {
        pop();
    },
    beforeDestory() {
        this.warpRouter.routes.delete(this);
        const fullPath = getFullPath(this.warpRouter);
        const rawChilds = getAllRawChilds(this.$slot);
        rawChilds.length = 0;
        console.log(fullPath, "已经移除");
    },
    render(h) {
        const rawChilds = getAllRawChilds(this.$slot);
        const fullPath = this.fullPath = getFullPath(this.warpRouter);
        let show = compareList(fullPath, currentHash.split("/") || [""])
        console.log(fullPath, currentHash.split("/") || [""], show);
        if (show) {
            const child = h(this.props.component, this.props, rawChilds, undefined, this.wrapVnode.zid);
            child.achor = this.wrapVnode.achor;
            child.parent = this.wrapVnode.parent;
            return child;
        }
    },
}