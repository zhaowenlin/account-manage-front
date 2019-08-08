import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const RouterViewHoc = {
  name: 'RouterViewHoc',
  render(h) {
    return h('router-view')
  }
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  },
  routes: [{
    path: '/',
    redirect: '/account-manage-front/'
  },
  {
    path: '/account-manage-front/',
    redirect: '/account-manage-front/admin'
  },
  {
    path: '/account-manage-front/',
    component: RouterViewHoc,
    meta: {
      penetrate: true
    },
    children: [{
      path: 'admin',
      name: 'admin',
      component: () =>
            import(
              '@/views/account-manage'
            ),
      meta: {
        title: '账号管理'
      }
    }]
  }]
})
