import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'login',
      component: require('../view/login').default
    },
    {
      path: '/room',
      name: 'room',
      component: require('../view/room').default,
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})