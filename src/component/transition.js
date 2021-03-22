import Sact from "../sact.js"
import { isArray } from "../tools/untils.js";


//防止嵌套其他抽象组件
function getRealChild(vnode) {
    var compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.isAbstract) {
        return getRealChild(getFirstComponentChild(compOptions.children))
    } else {
        return vnode
    }
}


function getFirstComponentChild(vnodes) {
    if (isArray(vnodes) && vnodes.length === 1) {
        return vnodes[0];
    }
    else {
        return undefined;
    }
}

function getPos(ele) {
    return ele.getBoundingClientRect();
}


function applyTranslation(c) {
    const oldPos = c.data.pos
    const newPos = c.data.newPos
    const dx = oldPos.left - newPos.left
    const dy = oldPos.top - newPos.top
    if (dx || dy) {
        c.data.moved = true
        const s = c.elm.style
        s.transform = s.WebkitTransform = `translate(${dx}px,${dy}px)`
        s.transitionDuration = '0s'
    }
}


function getStyleString(style, except) {
    let res = "";
    for (let i = 0; i < style.length; i++) {
        if (except.indexOf(style[i]) === -1) {
            res += `${style[i]}:${style[style[i]]};`
        }
    }
    return res;
}

function setAnimation(rel, name, duration) {
    rel.style.animationName = name;
    rel.style.animationDuration = duration + "ms";
}
function removeAnimation(rel) {
    rel.style.animation = null;
}


//用来添加动画的
export default Sact.component({
    name: 'transition',
    isAbstract: true,
    isShowAttr: false,
    props: {
        "mode": { //模式，默认为先出后进
            default: "out-in",
            validator(value) {
                return value === "in-out" || value === "out-in";
            }
        },
        "enter": "string",//元素被插入的时候添加的类名
        "leave": "string", //元素被删除的时候添加的类名
        "duration": { //移动元素的持续时间
            type: "string",
            default: "500"
        },
    },
    beforeUpdate(){
        console.log(this.$ele.tagName,getPos(this.$ele));
    },
    updated(){
        console.log(this.$ele.tagName,getPos(this.$ele));
    },
    render(h) {
        let child = getRealChild(getFirstComponentChild(this.$slot["default"]))
        if (!child) {
            return;
        }
        let self = this;
        let { enter, leave, duration } = this.props;

        function onCreated(ele) {
            function enter() {
                ele.classList.remove(self.props.enter);
                ele.removeEventListener("animationend", enter)
            }

            ele.classList.add(self.props.enter);
            ele.addEventListener("animationend", enter);
            ele.addEventListener("transitionend", enter);
        }
        function onLeave(ele, done) {
            function _leave() {
                done();
            }
            ele.classList.add(self.props.leave);
            ele.addEventListener("animationend", _leave);
            ele.addEventListener("transitionend", _leave);
        }

        function onBeforeMove(ele) {
            console.log(ele.tagName,getPos(ele));
        }




        function onMove(ele) {
            if (!self.moving) {
                self.flip.last();
                self.flip.invert();
                self.moving = true;
                self.flip.play();
                function cancel() {
                    self.moving = false;
                    ele.removeEventListener("transitionend", cancel);
                }
                ele.addEventListener("transitionend", cancel);
            }
            else {
                self.moving = true;
                self.flip.play();
            }

            // if (!self.moving) {
            //     self.oldStyle = getStyleString(ele.style, ["transition", "transform"]);
            //     let Frist = self.Frist;
            //     let Last = getRecord(ele);

            //     let state = [Frist.left - Last.left, Frist.top - Last.top, Frist.width / Last.width];

            //     function cancel() {
            //         self.moving = false;
            //         ele.style.transition = null;
            //         ele.style.transform = null;
            //         ele.removeEventListener("transitionend", cancel);
            //     }

            //     ele.addEventListener("transitionend", cancel);
            //     ele.style.transformOrigin = 'top left';
            //     ele.style.transform = `translate3d(${state[0]}px, ${state[1]}px, 0)scale(${state[2]})`;
            //     self.moving = true;
            //     setTimeout(() => {
            //         ele.style.transition = `transform ${duration}ms`;
            //         ele.style.transform = `translate3d(0, 0, 0) scale(1)`;
            //     }, 0)
            // }
            // else {
            //     setTimeout(() => {
            //         ele.style.transition = `transform ${duration}ms`;
            //         ele.style.transform = `translate3d(0, 0, 0) scale(1)`;
            //     }, 0)
            // }


        }
        //处理节点

        if (enter) {
            child.onCreated = onCreated;
        }
        if (leave) {
            child.onDestrory = onLeave;
        }

        // this.wrapVnode.onMove = onMove;
        // this.wrapVnode.onBeforeMove = onBeforeMove;
        //继承属性
        child.achor = this.wrapVnode.achor;
        child.parent = this.wrapVnode.parent;
        this.oldChild = child;
        return child;
    }
})