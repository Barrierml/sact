let template = `
<ul class="pagination">
<li class="page-item" @click="prePage">
    < </li>
<li s-for="num in showList" @click="changePage(num)" class="page-item" :key="num" :class="num === currentPage ? 'active':''">
{{num}}
</li>
<li class="page-item" @click="nextPage">
    >
</li>
</ul>
`
export default {
    template,
    data:{
        showList:[1,2,3,4,5],
        currentPage:1,
        total:0,
        limit:12,
        maxPage:0,
    },
    method:{
        prePage(){
            let page = this.data.currentPage - 1;
            if(page >= 1){
                this.changePage(page);
            }
        },
        nextPage(){
            let page = this.data.currentPage + 1;
            if(page <= this.data.maxPage){
                this.changePage(page);
            }
        },
        draw(){ //根据current渲染改变列表
            let {currentPage,maxPage} = this.data;
            let {showNum } = this.props;
            let res= [],halfRange = parseInt(showNum/2);
            if(maxPage <= showNum){
                for(let i=1;i<=maxPage;i++){
                    res.push(i)
                }
            }
            else{
                let start = currentPage - halfRange;
                let end = currentPage + halfRange;
                if(start < 1){
                    start = 1;
                    end = showNum;
                }
                else if(end > maxPage){
                    start = maxPage - halfRange - 2;
                    end = maxPage;
                }
                for(let i = start;i<=end;i++){
                    res.push(i);
                }
            }
            this.data.showList = res;
        },
        changePage(page){
            console.log(this)
            this.data.currentPage = page;
            this.draw();
            this.props.changepage && this.props.changepage(page)
            console.log(this)
        },
    },
    beforeMount(){
        this.data.total = this.props.total;
        this.data.maxPage = parseInt(this.data.total / this.props.limit)
        this.data.currentPage = this.props.currentPage;
        this.data.limit = this.props.limit;
        this.draw();
    },
    props:{
        total:0,
        currentPage:1,
        limit:12,
        showNum:5,//默认展示多少个页码
        changepage(page){

        },
    }
}