//缓存组件的一个内部组件
import Sact from "../sact.js"
export default Sact.component({
    name:"keep-alive",
    data:{
        cache:[],
    },
    isAbstract:true, //抽象组件
    //重写render函数
    mounted(){
        console.log(this.$vnode);
    },
    beforeUpdate(){
        console.log(this.$vnode);
    }
})