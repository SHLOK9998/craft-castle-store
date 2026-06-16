import { api } from './client'

export const getProducts = (params) => api.get('/products', { params })
export const getFeaturedProducts = (limit = 8) => api.get('/products/featured', { params: { limit } })
export const getProduct = (id) => api.get(`/products/${id}`)
export const getProductBySlug = (slug) => api.get(`/products/slug/${slug}`)

// Admin
export const adminGetProducts = (params) => api.get('/products/admin/all', { params })
export const createProduct = (data) => api.post('/products', data)
export const updateProduct = (id, data) => api.patch(`/products/${id}`, data)
export const updateStock = (id, qty) => api.patch(`/products/${id}/stock`, { stock_quantity: qty })
export const deleteProduct = (id) => api.delete(`/products/${id}`)
