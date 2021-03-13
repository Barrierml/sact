let template = `
<ul class="pagination">
<li s-if="currentPage > 1"  class="page-item" @click="prePage">
    < </li>
<li s-for="num in showList" @click="changePage(num)" :key="num" class="page-item" :class="num === currentPage ? 'active':''">
{{num}}
</li>
<li s-if="currentPage < maxPage"  class="page-item" @click="nextPage">
    >
</li>
<p s-if="total>0" style="line-height: 32px;margin: 0;padding: 0;">共 {{maxPage}}页</p>
</ul>
`
export default Sact.component({
    template,
    data() {
        return {
            showList: [1, 2, 3, 4, 5],
            currentPage: 1,
            total: 12,
            limit: 12,
            maxPage: 0,
        }
    },
    method: {
        prePage() {
            this.changePage(this.data.currentPage - 1);
        },
        nextPage() {
            this.changePage(this.data.currentPage + 1);
        },
        draw() { //根据current渲染改变列表
            let { currentPage, maxPage } = this.data;
            let { showNum } = this.props;
            let res = [], halfRange = parseInt(showNum / 2);
            if (maxPage <= showNum) {
                for (let i = 1; i <= maxPage; i++) {
                    res.push(i)
                }
            }
            else {
                let start = currentPage - halfRange;
                let end = currentPage + halfRange;
                if (start < 1) {
                    start = 1;
                    end = showNum;
                }
                else if (end > maxPage) {
                    start = maxPage - halfRange - 2;
                    end = maxPage;
                }
                for (let i = start; i <= end; i++) {
                    res.push(i);
                }
            }
            this.data.showList = res;
        },
        changePage(page) {
            if (page <= this.data.maxPage && page >= 1) {
                this.data.currentPage = page;
                this.props.changepage && this.props.changepage(page);
                this.draw();
            }
        },
    },
    beforeMount() {
        this.data.total = this.props.total;
        this.data.currentPage = this.props.currentPage;
        this.data.limit = this.props.limit;
        this.data.maxPage = parseInt(this.props.total / this.props.limit) || 1
        this.draw();
    },
    props: {
        total: 0,
        currentPage: 1,
        limit: 12,
        showNum: 5,//默认展示多少个页码
    }
})