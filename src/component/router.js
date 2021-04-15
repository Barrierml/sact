import { sactWarn } from "../tools/untils.js"
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
    let j = i;
    oRoute = nRoute;

    //通知新的开启旧的关闭
    while (nRoute || oRoute) {
        if (oRoute) {
            //旧的只用通知最外层即可
            oRoute = oRoute.children[o[j]];
            oRoute && oRoute.routes.forEach(routerClose);
            oRoute = undefined;
        }
        if (nRoute) {
            nRoute = nRoute.children[n[i++]];
            nRoute && nRoute.routes.forEach(routerOpen);
        }
    }
}

const routerClose = (e) => { e.data.show = false; }
const routerOpen = (e) => { e.data.show = true; }


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
    while (route.parent) {
        res.push(route.path);
        route = route.parent;
    }
    return "/" + res.reverse().join("/");
}


//压入栈
function push(path, sact) {
    const current = stack[stack.length - 1];
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
    sact.warpRouterSet = res.routes;

    stack.push(res);
    const fullPath = getFullPath(res)
    return fullPath === currentHash.slice(0, fullPath.length);
}

//出栈
function pop() {
    stack.pop();
}

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
        this.data.show = push(path, this);
    },
    mounted() {
        pop();
    },
    beforeUpdate(){
        console.log(this.props.path,"开始更新")
    },
    render(h) {
        if (!this.data.show) {
            return;
        }
        const rawChilds = getAllRawChilds(this.$slot);
        const child = h(this.props.component, this.props, rawChilds,undefined,this.wrapVnode.zid);
        child.achor = this.wrapVnode.achor;
        child.parent = this.wrapVnode.parent;
        return child;
    },
}