// 基于axios封装的请求模块
import axios from 'axios'

//创建一个axios实例
const request = axios.create({
    // baseURL: 'http://ttapi.research.itcast.cn'
    baseURL: 'http://api-toutiao-web.itheima.net'
})

//请求拦截器
request.interceptors.request.use(
    function(config) {
        const user = JSON.parse(window.localStorage.getItem('user'))
        if (user) {
            config.headers.Authorization = `Bearer ${user.token}`
        }
        return config
    },
    function(error) {
        return Promise.reject(error)
    }
)

//响应拦截器

export default request