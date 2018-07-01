// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueAxios from 'vue-axios';
import axios from 'axios';
import VeeValidate, { Validator } from 'vee-validate';
import zh_CN from 'vee-validate/dist/locale/zh_CN';
import MintUI from "mint-ui";
import "mint-ui/lib/style.css";
import "./assets/style.less";
import './main.ts';
import App from './App';
import router from './router';
import store from './store';
Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Validator.localize('zh_CN', zh_CN);
Vue.use(VeeValidate, {
    locale: 'zh_CN'
});
Vue.use(MintUI);
Vue.prototype.$toast = MintUI.Toast;
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
});
