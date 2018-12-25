import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'login',
      component: require('@/components/login').default
    },
    {
      path: '/list',
      name: 'list',
      component: require('@/components/list').default,
    },
    {
      path: '/saloon',
      name: 'saloon',
      component: require('@/components/saloon').default,
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})