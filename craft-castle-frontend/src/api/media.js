import { api } from './client'

export const getProductMedia = (productId) => api.get(`/media/product/${productId}`)

export const uploadMedia = (productId, file, isPrimary = false, sortOrder = 0) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('is_primary', isPrimary)
  formData.append('sort_order', sortOrder)
  return api.post(`/media/upload/${productId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const setPrimaryMedia = (mediaId) => api.patch(`/media/${mediaId}/set-primary`)
export const deleteMedia = (mediaId) => api.delete(`/media/${mediaId}`)
