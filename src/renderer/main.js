import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui';
import './assets/styles/theme.scss';
import App from './App'
import router from './router'
import store from './store'
import Mock from './mock'
import 'vue2-toast/lib/toast.css';
import Toast from 'vue2-toast';
Vue.use(ElementUI);
Mock.bootstrap();
Vue.use(Toast);
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
//if (!process.env.IS_WEB)
Vue.use(require('vue-electron'))
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
