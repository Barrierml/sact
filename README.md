

# Sact
![build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![denpendent](https://img.shields.io/badge/denpendent-Prue%20JavaScript-blueviolet.svg)


## Introduction - 介绍
Sact是一个仿照vue和react造的轮子，从零实现了vue的大部分功能，也引入了一些关于react概念，主要是为了解决我在写静态页面时复杂功能实现，顺便学习关于mvvm框架的核心原理。
响应式仿造Vue3使用Proxy实现的
DIff是自己实现的，同时使用了静态节点优化
htmlParser是借鉴的vue2的htmlParser，做了一些精简
watcher与computed也均支持，用法与vue2相同
transition支持fifp动画和enter leave
源码可以直接克隆查看，大部分都都做的有注释

我也使用sact开发了一个即时聊天程序[地址](https://www.jiandanmaimai.cn/web/IM/index.html)
[源码地址](https://gitee.com/SHIR0HA/jiandanmaimai-im)


### Summary - 概要
您是否经常要在静态网站内开发一些特殊的功能模块，比如说添加一个新的搜索功能？一个新的弹窗功能？或者是一个新的页面？
不想使用Jquery，原生JS，来进行命令式开发，再为此引入Vue或者React？这可是个静态页面，我要引入多少东西？还要打包多少包？
那么Sact可能就是你所需要的，它专门针对静态页面的复杂功能开发，只需要引入一个不到8kb的sact组件包（gzip）你就可以在网页内直接开发响应式组件。
不需要webpack来打包，不需要引入一堆无关的转义器，开箱即用。


### Features - 特性
1. **mini体积**，gzip后只有8kb。
2. **开箱即用**，只需引入一个sact.js，一切即可开始
3. **模板语法**，支持和vue一样的模板语法，react的jsx（需要用户自定义）
4. **完整的生命周期**，从组件的创建到生命结束，我们有各种各样的生命周期hook函数
5. **组件化开发**，一切皆组件！复用性极佳
6. **支持链式开发**，功能模块相互分离，对开发人员更加友好
## Requirements - 必要条件
Prue JavaScript ！只有一个包！
## Install - 安装
### 1. 浏览器环境
```
//引入dist下的sact.js即可使用sact的所有功能
<script src="./dist/sact.js"></script>
```
## Start - 快速开始

您可以在您的页面内新建一个盒子容器，就像vue那样
### html

```html
<div id="root"></div>
```
### js
Sact支持两种方式声明一个新的应用
```javascript
//对象声明式
let app = new Sact({
    ele:"#root",
    template:"<div>{{msg}}</div>",
    data:{msg:"hello world"}
})
```
```javascript
//链式声明式
let app = 
Sact.link()
.ele("#root")
.tempalte("<div>{{msg}}</div>")
.data({msg:"hello world"})
.do
```
这只是两种不同的声明方式，所创建的app是完全一样的，对象式更好理解，而声明式更容易帮助我们将组件的每个功能分离，选择你喜欢的方式来进行开发吧。

## Documentation - 文档与教程
[点我前往文档](http://shir0ha.gitee.io/sact/#/)
## Issues - 提问
有任何关于Sact的使用问题，或者bug都可以在Issues内提出。
## License - 许可证
[MIT](https://opensource.org/licenses/MIT)
