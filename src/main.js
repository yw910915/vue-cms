import Vue from 'vue'
import App from './App'
import router from './router'

import VueResource from 'vue-resource'
Vue.use(VueResource)


// 设置vue-resource的请求根路径
Vue.http.options.root='http://www.lovegf.cn:8899/api/'

// css reset  css初始化
import './styles/common.css'
// 引入mui的css文件
import './libs/mui/css/mui.css'
// 引入mui扩展字体的css文件
import './libs/mui/css/icons-extra.css'


// 1.导入mint-ui和其样式文件
import MintUi from 'mint-ui'
import 'mint-ui/lib/style.css'

// 2.安装mint-ui(全局注册所有的组件)
Vue.use(MintUi)


Vue.config.productionTip = false


import moment from 'moment'
//定义全局过滤器
Vue.filter('dateFormat', function(dateStr,pattern='YYYY-MM-DD HH:mm:ss'){
  return moment(dateStr).format(pattern)
})

// 注册全局组件
import comment from './components/comment.vue'
Vue.component('comment',comment)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
