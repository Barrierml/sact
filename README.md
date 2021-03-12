

# Sact
![build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![denpendent](https://img.shields.io/badge/denpendent-Prue%20JavaScript-blueviolet.svg)


## Introduction - 介绍
Sact是一个用于构建静态网站复杂功能开发的渐进式框架。它被设计成可增量采用的，使用包装好的组件进行开发。
它由一个只关注视图层的核心库和一个支持组件化开发的生态系统组成，它可以帮助您快速的开发静态页面内复杂功能模块的实现

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
6. **支持链式创建**，功能模块与功能模块分离，对开发人员更加友好
## Requirements - 必要条件
Prue JavaScript ！只有一个包！
