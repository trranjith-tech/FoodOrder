import api from './api'

export const orderService = {
  create: (data) => api.post('/orders', data),
  confirm: (id, otp) => api.post(`/orders/${id}/confirm`, { otp }),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getRestaurantOrders: () => api.get('/orders/restaurant'),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
}
