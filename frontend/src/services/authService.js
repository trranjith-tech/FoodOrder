import api from './api'
export const authService = {
  register: (data) => api.post('/auth/register', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  verifyRegistrationOtp: (data) => api.post('/auth/verify-registration-otp', data),
  login: (data) => api.post('/auth/login', data),
  verifyLoginOtp: (data) => api.post('/auth/verify-login-otp', data),
  resendOtp: (data) => api.post('/auth/resend-otp', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  me: () => api.get('/auth/me'),
}
