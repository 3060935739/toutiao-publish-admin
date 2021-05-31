// 用户相关请求模块
import request from "@/utils/request.js";

// 用户登录
export const login = data => {
    return request({
        method: "POST",
        url: "/mp/v1_0/authorizations",
        data
    })
}

// 获取用户信息
export const getUserProfile = () => {
    // const user = JSON.parse(window.localStorage.getItem('user'))
    return request({
        method: "GET",
        url: "/mp/v1_0/user/profile"
            // 后端要求把需要授权的用户身份放到请求头里面
            // axios通过headers设置请求头
            // headers: {
            //     Authorization: `Bearer ${user.token}`
            // }
    })
}

// 修改用户信息
export const updateUser = () => {

}