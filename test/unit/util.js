import Vue from 'vue';
import iView from '../../src/index';

Vue.use(iView);

let id = 0;

const createElm = () => {
    const elm = document.createElement('div');

    id += 1;
    elm.id = `app${id}`;
    document.body.appendChild(elm);

    return elm;
};

/**
 * 回收 vm.
 *
 * @param  {Object} vm
 */
export const destroyVM = (vm) => {
    if (vm.$el && vm.$el.parentNode) {
        vm.$el.parentNode.removeChild(vm.$el);
    }
};

/**
 * 创建一个 Vue 的实例对象.
 *
 * @param  {Object|String}  Compo   - 组件配置，可直接传 template.
 * @param  {Boolean=false} mounted - 是否添加到 DOM 上.
 * @return {Object} vm
 */
export const createVue = (Compo, mounted = false) => {
    const elm = createElm();

    if (Object.prototype.toString.call(Compo) === '[object String]') {
        Compo = { template: Compo };
    }

    return new Vue(Compo).$mount(mounted === false ? null : elm);
};

/**
 * 创建一个测试组件实例.
 *
 * @link http://vuejs.org/guide/unit-testing.html#Writing-Testable-Components
 * @param  {Object}  Compo          - 组件对象.
 * @param  {Object}  propsData      - Props 数据.
 * @param  {Boolean=false} mounted  - 是否添加到 DOM 上.
 * @return {Object} vm
 */
export const createTest = (Compo, propsData = {}, mounted = false) => {
    if (propsData === true || propsData === false) {
        mounted = propsData;
        propsData = {};
    }

    const elm = createElm();
    const Ctor = Vue.extend(Compo);

    return new Ctor({ propsData }).$mount(mounted === false ? null : elm);
};

/**
 * Transform Date string (yyyy-mm-dd hh:mm:ss) to Date object.
 *
 * @param {string}
 */
export const stringToDate = (str) => {
    const parts = str.split(/[^\d]/).filter(Boolean);

    parts[1] -= 1;

    return new Date(...parts);
};

/**
 * Transform Date to yyyy-mm-dd string.
 *
 * @param {Date}
 */
export const dateToString = d => [d.getFullYear(), d.getMonth() + 1, d.getDate()]
  .map(nr => (nr > 9 ? nr : `0${nr}`)).join('-');

/**
 * 触发一个事件
 * mouseenter, mouseleave, mouseover, keyup, change, click 等.
 *
 * @param  {Element} elm
 * @param  {string} name
 * @param  {*} opts
 */
export const triggerEvent = (elm, name, ...opts) => {
    let eventName;

    if (/^mouse|click/.test(name)) {
        eventName = 'MouseEvents';
    } else if (/^key/.test(name)) {
        eventName = 'KeyboardEvent';
    } else {
        eventName = 'HTMLEvents';
    }
    const evt = document.createEvent(eventName);

    evt.initEvent(name, ...opts);
    if (elm.dispatchEvent) {
        elm.dispatchEvent(evt);
    } else {
        elm.fireEvent(`on${name}`, evt);
    }

    return elm;
};

/**
* Wait for components inner async process, when this.$nextTick is not enough.
 *
* @param {Function} the - Condition to verify before calling the callback.
* @param {Function} the - Callback to call when condition is true.
*/
export const waitForIt = (condition, callback) => {
    if (condition()) {
        callback();
    } else {
        setTimeout(() => waitForIt(condition, callback), 50);
    }
};

/**
* Call a components .$nextTick in a promissified way.
 *
* @param {Vue Component} the - Component to work with.
*/
export const promissedTick = component => new Promise(resolve => component.$nextTick(resolve));
