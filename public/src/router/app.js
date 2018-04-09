import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export const appRouterMap = []

export default new Router({
    // mode:'history'
    base: '/',
    scrollBehavior: () => ({y: 0}),
    routes: appRouterMap
})