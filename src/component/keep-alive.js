import Sact from "../sact.js"
export default Sact.component({
    name: "keep-alive",
    data() {
        return {
            old:true,cache:[]
        }
    },
    isAbstract: true, //抽象组件,需要自己重写render
    reactive: false,//关闭数据响应
    //自定义render函数
    mounted(){
        let pici = this.$slot.default[0];
        if(pici){
            this.data.cache[0] = pici;
        }
    },
    render(){
        let pici = this.$slot.default[0];
        if(pici && this.data.cache?.length === 1 && !this.data.old){
            this.data.old = true;
            return this.data.cache[0];
        }
        else if(pici){
            this.data.cache[0] = pici;
            this.data.old = true;
            return pici;
        }
        else{
            this.data.old = false;
        }
    }
})