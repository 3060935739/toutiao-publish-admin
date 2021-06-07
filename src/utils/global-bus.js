//全局通信总线
import Vue from 'vue'

export default new Vue()

//假设a组件要给b组件发送数据

//b组件注册通信的事件
// import globalBus from '@/utils/global-bus'
// globalBus.$on('自定义事件名称', (data) => {
//         //处理函数
//     })

//a发布通信事件
// import globalBus from '@/utils/global-bus'
// globalBus.$emit('自定义事件名称', 123)