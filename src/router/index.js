import Vue from 'vue'
import VueRouter from 'vue-router'
// 在vuecli创建的项目中 @ 表示 src 目录
import Login from '@/views/login/'
import Home from '@/views/home/'
import Layout from '@/views/layout/'
import Article from '@/views/article/'
import Publish from '@/views/publish/'
import Image from '@/views/image/'
import Comment from '@/views/comment/'
import Settings from '@/views/settings/'

Vue.use(VueRouter)

// 路由配置表
const routes = [{
    path: '/login',
    name: 'login',
    component: Login
}, {
    path: '/',
    // name: 'layout',
    component: Layout,
    children: [{
        path: '', // path为空，会作为默认子路由渲染
        name: 'home',
        component: Home
    }, {
        path: '/article',
        name: 'article',
        component: Article

    }, {
        path: '/publish',
        name: 'publish',
        component: Publish

    }, {
        path: '/image',
        name: 'image',
        component: Image

    }, {
        path: '/comment',
        name: 'comment',
        component: Comment

    }, {
        path: '/settings',
        name: 'settings',
        component: Settings

    }]
}, ]

const router = new VueRouter({
    routes
})

// 路由导航守卫
// to 要去的路由页面信息
// from 来自哪里的路由信息
// next 放行方法
router.beforeEach((to, from, next) => {
    const user = JSON.parse(window.localStorage.getItem('user'))
    if (to.path !== '/login') {
        if (user) {
            next()
        } else {
            next('./login')
        }
    } else {
        next()
    }
})

export default router