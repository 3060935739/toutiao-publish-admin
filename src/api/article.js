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

// 新建文章
export const addArticle = (data, draft = false) => {
    return request({
        method: 'POST',
        url: '/mp/v1_0/articles',
        params: {
            draft: draft //是否存为草稿 true草稿 false不存
        },
        data: data
    })
}

// 编辑文章
export const updateArticle = (articleId, data, draft = false) => {
    return request({
        method: 'PUT',
        url: `/mp/v1_0/articles/${articleId}`,
        params: {
            draft: draft //是否存为草稿 true草稿 false不存
        },
        data: data
    })
}

// 获取指定文章
export const getArticle = articleId => {
    return request({
        method: 'GET',
        url: `/mp/v1_0/articles/${articleId}`,
    })
}

// 修改文章评论状态
export const updateCommentStatus = (articleId, allowComment) => {
    return request({
        method: 'PUT',
        url: '/mp/v1_0/comments/status',
        params: {
            article_id: articleId
        },
        data: {
            allow_comment: allowComment
        }
    })
}