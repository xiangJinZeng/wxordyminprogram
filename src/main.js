import App from './App'
// 引入全局配置
import config from '@/config/index.js'
// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$config = config
const app = new Vue({
  ...App,
})
app.$mount()
// #endif
