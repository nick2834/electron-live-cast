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
      path: '/room',
      name: 'room',
      component: require('@/components/room').default,
      children: [{
        path: '/',
        component: require('@/components/list').default,
        name: 'list'
      }, {
        path: '/saloon',
        component: require('@/components/saloon').default,
        name: 'saloon'
      }, ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})