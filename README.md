# mall

> Shopping Mall 

## Build Setup


# install dependencies
# 首先安装依赖
npm install

# serve with hot reload at localhost:8080
# 运行dev
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

本商城前端采用Vue,后端为Node，数据库为MongoDB
商城为响应式网站，可以随屏幕宽度自动自适应
主要功能有首页商品列表，登录，加购物车，购物车管理，地址管理，提交订单

首页对商品价格进行筛选，价格排序；

购物车可以进行删减，数量添加；

地址管理可以管理地址，设置默认地址



项目中涉及的技术：

1，使用Vue-Cli创建项目模板

2，登录状态和购物车数量等状态在每个页面
   都需要使用，使用Vuex来集中管理

3，vue-router实现前端页面路由跳转

4，使用Axios来实现数据接收和页面渲染

5，后端通过Node.js进行实现，通过
   Express框架实现后端的REST接口，并以
   json的形式进行输出

6，MongoDB以最常用的数据传输格式json进行
   数据存储

7，modal弹出框为通用组件
