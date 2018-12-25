import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import Mock from './mock'
import 'element-ui/lib/theme-chalk/index.css';
import 'vue2-toast/lib/toast.css';
import Toast from 'vue2-toast';
import Bus from 'vue-bus';
Mock.bootstrap()
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(Toast);
Vue.use(Bus);
Vue.prototype.myAxios = axios.create({
  // baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  withCredentials: true
});
// Vue.prototype.myAxios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app')