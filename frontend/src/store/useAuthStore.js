import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(persist(
  (set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    setAuth: (user, token) => {
      localStorage.setItem('foodrush_token', token)
      set({ user, token, isAuthenticated: true })
    },
    logout: () => {
      localStorage.removeItem('foodrush_token')
      set({ user: null, token: null, isAuthenticated: false })
    },
    updateUser: (user) => set({ user }),
  }),
  { name: 'foodrush-auth', partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }) }
))

export default useAuthStore
