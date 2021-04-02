//下面是异步刷新
const queue = [];
let flushing = false;
let flushingPending = false;
let has = {};
//将所有要异步的函数放入队列，然后等待同步任务完成后event loop自动异步执行
export function queueJob(job) {
    let id = job.id;
    if (!flushing) {
        if (!has[id]) {
            queue.push(job);
            has[id] = true;
        }
        queueFlush();
    }
    else {
        // console.log("当前正在刷新", job)
    }
}

function queueFlush() {
    if (!flushing && !flushingPending) {
        flushingPending = true;
        nextTick(flushSchedulerQueue);
    }
}


function flushSchedulerQueue() {
    flushingPending = false;
    flushing = true;

    queue.forEach((v)=>{
        v();
    })

    //清除数据等待下次收集
    queue.length = 0;
    flushing = false;
    has = {};
}

const callbacks = []
let pending = false
let timerFunc
export function nextTick(cb, ctx) {
    callbacks.push(() => {
        if (cb) {
            cb.call(ctx)
        }
    })
    if (!pending) {
        pending = true
        timerFunc()
    }
}
const p = Promise.resolve()
timerFunc = () => {
    p.then(flushCallbacks)
}
function flushCallbacks() {
    pending = false
    const copies = callbacks.slice(0)
    callbacks.length = 0
    for (let i = 0; i < copies.length; i++) {
        copies[i]()
    }
}