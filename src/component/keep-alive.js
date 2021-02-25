//缓存组件的一个内部组件
import Sact from "../sact.js"
export default Sact.component({
    name: "keep-alive",
    data() {
        return {
            old:[],cache:[]
        }
    },
    isAbstract: true, //抽象组件,需要自己重写render
    reactive: false,//关闭数据响应
    //自定义render函数
    mounted(){
        let pici = this.$slot.default[0];
        if(pici){
            this.data.cache.push(pici)
        }
    },
    render(c,p){
        let pici = this.$slot.default[0];
        if(pici && this.data.cache?.length === 1){
            return this.data.cache[0];
        }
        else if(pici){
            return pici;
        }
    }
})