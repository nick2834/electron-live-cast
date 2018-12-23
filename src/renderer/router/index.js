import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: require('../view/Login').default
    },
    {
      path: '/main',
      name: 'main',
      component: require('../view/Main').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
