import { test } from './utils';
test();

import Index from './Index.vue';

import Vue from 'vue';

const vue = new Vue({
    render: h => h(Index)
});

vue.$mount('#root');

