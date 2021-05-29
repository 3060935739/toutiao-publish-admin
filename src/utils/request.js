// 基于axios封装的请求模块
import axios from 'axios'

//创建一个axios实例
const request = axios.create({
    baseURL: 'http://ttapi.research.itcast.cn/'
})

//请求拦截器

//响应拦截器

export default request