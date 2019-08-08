import Vue from 'vue'
import ElementUI from 'element-ui'
import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import {
  sync
} from 'vuex-router-sync'
import App from './App.vue'

import * as filters from '@/filters' // global filters
import '@/utils/directives'
import '@/utils/extend'

import './icons' // icon
import router from './router'
import store from './store'

Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

sync(store, router)

Vue.config.productionTip = false

/* eslint-disable no-new */
const app = new Vue({
  router,
  store,
  render(h) {
    return h(App)
  }
})

// 延迟vue实例的挂载，推迟到router实例化完成后
router.onReady(() => {
  app.$mount('#app')
})
export default app
