/**
 * Created by aresn on 16/6/20.
 */
import 'babel-polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app.vue';
import iView from '../src/index';
// import locale from '../src/locale/lang/en-US';
import locale from '../src/locale/lang/zh-CN';

import Layout from './routers/layout.vue';
import Affix from './routers/affix.vue';
import Grid from './routers/grid.vue';
import Button from './routers/button.vue';
import Input from './routers/input.vue';
import Radio from './routers/radio.vue';
import Checkbox from './routers/checkbox.vue';
import Steps from './routers/steps.vue';
import Timeline from './routers/timeline.vue';
import Swicth from './routers/switch.vue';
import Alert from './routers/alert.vue';
import Badge from './routers/badge.vue';
import Tag from './routers/tag.vue';
import InputNumber from './routers/input-number.vue';
import Upload from './routers/upload.vue';
import Progress from './routers/progress.vue';
import Collapse from './routers/collapse.vue';
import Carousel from './routers/carousel.vue';
import Card from './routers/card.vue';
import Tree from './routers/tree.vue';
import Rate from './routers/rate.vue';
import Circle from './routers/circle.vue';
import Tabs from './routers/tabs.vue';
import Tootip from './routers/tooltip.vue';
import Poptip from './routers/poptip.vue';
import Slider from './routers/slider.vue';
import Dropdown from './routers/dropdown.vue';
import Breadcrumb from './routers/breadcrumb.vue';
import Menu from './routers/menu.vue';
import Spin from './routers/spin.vue';
import Cascader from './routers/cascader.vue';
import Select from './routers/select.vue';
import Backtop from './routers/back-top.vue';
import Page from './routers/page.vue';
import Transfer from './routers/transfer.vue';
import DatePicker from './routers/date.vue';
import Form from './routers/form.vue';
import Table from './routers/table.vue';
import LoadingBar from './routers/loading-bar.vue';
import Modal from './routers/modal.vue';
import Message from './routers/message.vue';
import Notice from './routers/notice.vue';
import Avatar from './routers/avatar.vue';
import ColorPicker from './routers/color-picker.vue';
import AutoComplete from './routers/auto-complete.vue';
import Scroll from './routers/scroll.vue';

Vue.use(VueRouter);
Vue.use(iView, { locale });

// 开启debug模式
Vue.config.debug = true;

// 路由配置
const router = new VueRouter({
    esModule: false,
    routes: [
        {
            path: '/layout',
            component: Layout,
        },
        {
            path: '/affix',
            component: Affix,
        },
        {
            path: '/grid',
            component: Grid,
        },
        {
            path: '/button',
            component: Button,
        },
        {
            path: '/input',
            component: Input,
        },
        {
            path: '/radio',
            component: Radio,
        },
        {
            path: '/checkbox',
            component: Checkbox,
        },
        {
            path: '/steps',
            component: Steps,
        },
        {
            path: '/timeline',
            component: Timeline,
        },
        {
            path: '/switch',
            component: Swicth,
        },
        {
            path: '/alert',
            component: Alert,
        },
        {
            path: '/badge',
            component: Badge,
        },
        {
            path: '/tag',
            component: Tag,
        },
        {
            path: '/input-number',
            component: InputNumber,
        },
        {
            path: '/upload',
            component: Upload,
        },
        {
            path: '/progress',
            component: Progress,
        },
        {
            path: '/collapse',
            component: Collapse,
        },
        {
            path: '/carousel',
            component: Carousel,
        },
        {
            path: '/card',
            component: Card,
        },
        {
            path: '/tree',
            component: Tree,
        },
        {
            path: '/rate',
            component: Rate,
        },
        {
            path: '/circle',
            component: Circle,
        },
        {
            path: '/tabs',
            component: Tabs,
        },
        {
            path: '/tooltip',
            component: Tootip,
        },
        {
            path: '/poptip',
            component: Poptip,
        },
        {
            path: '/slider',
            component: Slider,
        },
        {
            path: '/dropdown',
            component: Dropdown,
        },
        {
            path: '/breadcrumb',
            component: Breadcrumb,
        },
        {
            path: '/menu',
            component: Menu,
        },
        {
            path: '/spin',
            component: Spin,
        },
        {
            path: '/cascader',
            component: Cascader,
        },
        {
            path: '/select',
            component: Select,
        },
        {
            path: '/backtop',
            component: Backtop,
        },
        {
            path: '/page',
            component: Page,
        },
        {
            path: '/transfer',
            component: Transfer,
        },
        {
            path: '/date',
            component: DatePicker,
        },
        {
            path: '/form',
            component: Form,
        },
        {
            path: '/table',
            component: Table,
        },
        {
            path: '/loading-bar',
            component: LoadingBar,
        },
        {
            path: '/modal',
            component: Modal,
        },
        {
            path: '/message',
            component: Message,
        },
        {
            path: '/notice',
            component: Notice,
        },
        {
            path: '/avatar',
            component: Avatar,
        },
        {
            path: '/color-picker',
            component: ColorPicker,
        },
        {
            path: '/auto-complete',
            component: AutoComplete,
        },
        {
            path: '/scroll',
            component: Scroll,
        },
    ],
});

export default new Vue({
    router,
    render(h) {
        return h(App);
    },
}).$mount('#app');
