import Vue from 'vue';
import store from '../store';
import i18n from '../i18n';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/element-reset.css';
import '@/styles/bundle.less';
import axios from '@/api';


Vue.prototype.$http = axios;
Vue.use(ElementUI);


export const bootstrap = app => {
    new Vue({
        i18n,
        store,
        render: h => h(app)
    }).$mount('#app');
};
