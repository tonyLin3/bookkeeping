import Vue from 'vue';
import VueI18n from 'vue-i18n';

// 初始化Lockr
Lockr.prefix = 'wows_';

Vue.use(VueI18n);

const message = {
    'zh_CN': require('./zh'),
    'en_US': require('./en')
};

const i18n = new VueI18n({
    locale: 'zh',
    messages: message
});

export default i18n;