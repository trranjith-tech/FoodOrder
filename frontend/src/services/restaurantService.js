import api from './api'

export const restaurantService = {
  getAll: (params) => api.get('/restaurants', { params }),
  getById: (id) => api.get(`/restaurants/${id}`),
  searchDishes: (query) => api.get('/restaurants/dishes/search', { params: { q: query } }),
  getCategories: () => api.get('/categories'),
  getMyRestaurant: () => api.get('/restaurants/my'),
  createRestaurant: (data) => api.post('/restaurants', data),
  addMenuItem: (restaurantId, data) => api.post(`/restaurants/${restaurantId}/menu`, data),
  getRestaurantMenuItems: (restaurantId) => api.get(`/restaurants/${restaurantId}/menu/all`),
  toggleMenuItem: (menuItemId) => api.patch(`/restaurants/menu/${menuItemId}/toggle`),
  deleteMenuItem: (menuItemId) => api.delete(`/restaurants/menu/${menuItemId}`),
}
