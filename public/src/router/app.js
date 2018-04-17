import Vue from 'vue'
import Router from 'vue-router'

import indexPage from '../views/index.vue'

Vue.use(Router)

export const appRouterMap = [
    { path:'/',component: indexPage,hidden: true}
]

export default new Router({
    // mode:'history'
    base: '/',
    scrollBehavior: () => ({y: 0}),
    routes: appRouterMap
})