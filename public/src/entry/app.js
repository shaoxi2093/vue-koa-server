import Vue from 'vue'
import router from '../router/app'
import store from '../store/app'


import App from '../app.vue'


Vue.config.productionTip = false;
Vue.config.devtools = true;

new Vue({
    el:'#app',
    router,
    store,
    template:'<App />',
    components: { App }
})