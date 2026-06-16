import { api } from './client'

export const getCategories = () => api.get('/categories')
export const adminGetCategories = () => api.get('/categories/admin/all')
export const createCategory = (data) => api.post('/categories', data)
export const updateCategory = (id, data) => api.patch(`/categories/${id}`, data)
export const deleteCategory = (id) => api.delete(`/categories/${id}`)
