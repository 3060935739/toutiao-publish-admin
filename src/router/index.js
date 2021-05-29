import Vue from 'vue'
import VueRouter from 'vue-router'
// 在vuecli创建的项目中 @ 表示 src 目录
import Login from '@/views/login'

Vue.use(VueRouter)

// 路由配置表
const routes = [{
    path: '/login',
    name: 'login',
    component: Login
}]

const router = new VueRouter({
    routes
})

export default router