import { api } from './client'
export const getOrderUrl = (productId, quantity = 1) =>
  api.get(`/whatsapp/order-url/${productId}`, { params: { quantity } })
export const getContactUrl = (message) =>
  api.get('/whatsapp/contact-url', { params: message ? { message } : {} })
