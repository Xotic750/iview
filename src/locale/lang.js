// using with vue-i18n in CDN
import Vue from 'vue';
const isServer = Vue.prototype.$isServer;

export default function (lang) {
    if (!isServer) {
        if (typeof window.iview !== 'undefined') {
            if (!('langs' in window.iview)) {
                window.iview.langs = {};
            }
            window.iview.langs[lang.i.locale] = lang;
        }
    }
}
