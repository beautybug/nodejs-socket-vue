/**
 * Created by wubo on 2017/8/20.
 */
import 'babel-polyfill';
import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import router from './router';
import VueResource from 'vue-resource';
import VueCookie from 'vue-cookie'

Vue.use(ElementUI)
Vue.use(VueResource)
Vue.use(VueCookie)

Vue.config.productionTip = false

window.bus = new Vue()
// new Vue({
//   el: '#app',
//   router,
//   template: '<App/>',
//   components: { App }
// })
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
