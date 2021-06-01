// 文章相关请求模块

import request from "@/utils/request.js";

// 获取文章列表
export const getArticles = params => {
    return request({
        method: 'GET',
        url: '/mp/v1_0/articles',
        // body 参数使用 data 设置
        // query 参数使用 params 设置
        // headers 参数使用 headers 设置
        params
    })
}

// 获取文章频道
export const getArticleChannels = () => {
    return request({
        method: 'GET',
        url: '/mp/v1_0/channels',
        // body 参数使用 data 设置
        // query 参数使用 params 设置
        // headers 参数使用 headers 设置
    })
}

// 删除文章
export const deleteArticle = articleId => {
    return request({
        method: 'DELETE',
        url: `/mp/v1_0/articles/${articleId}`,
    })
}