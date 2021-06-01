import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'

// 关于js无法正确转换超出安全整数范围数字的解决方法
// import JSONbig from 'json-bigint'
// const str = '{"id":1234567891236888888}'
// console.log(JSONbig.parse(str).id.toString()); //1234567891236888888
// console.log(JSON.parse(str)); //{id: 1234567891236888800}
// JSONbig.stringify()
// const data = JSONbig.parse(str)
// console.log(JSON.stringify(data));
// console.log(JSONbig.stringify(data));

//加载全局样式文件
import './styles/index.less'

//全局注册element-ui组件库
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')