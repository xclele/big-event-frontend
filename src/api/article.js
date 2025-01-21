import request from '@/utils/request'

export const articleCategoryListService = () => {
    /*const tokenStore = useTokenStore()
    return request.get('/category', {
        headers: {
            Authorization: tokenStore.token //pinia里面定义的响应式数据不需要.value
        }
    })*/
    return request.get('/category')
}

export const addCategoryService = (categoryData) => {
    return request.post('/category', categoryData)
}

export const updateCategoryService = (categoryData) => {
    return request.put(`/category`, categoryData)
}

export const deleteCategoryService = (id) => {
    return request.delete(`/category?id=`+id)
}

export const articleListService = (params) => {
    return request.get('/article', {params: params})
}

export const articleAddService = (articleData) => {
    return request.post('/article',articleData)
}