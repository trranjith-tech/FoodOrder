import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(persist(
  (set, get) => ({
    items: [],
    restaurant: null,
    isOpen: false,
    addItem: (item, restaurant) => {
      const { items, restaurant: currentRestaurant } = get()
      if (currentRestaurant && currentRestaurant.id !== restaurant.id) {
        // Different restaurant - clear cart first
        set({ items: [{ ...item, quantity: 1 }], restaurant })
        return
      }
      const existing = items.find(i => i.id === item.id)
      if (existing) {
        set({ items: items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i), restaurant })
      } else {
        set({ items: [...items, { ...item, quantity: 1 }], restaurant })
      }
    },
    removeItem: (itemId) => {
      const items = get().items.filter(i => i.id !== itemId)
      set({ items, restaurant: items.length === 0 ? null : get().restaurant })
    },
    updateQuantity: (itemId, quantity) => {
      if (quantity <= 0) { get().removeItem(itemId); return }
      set({ items: get().items.map(i => i.id === itemId ? { ...i, quantity } : i) })
    },
    clearCart: () => set({ items: [], restaurant: null }),
    toggleCart: () => set(s => ({ isOpen: !s.isOpen })),
    openCart: () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),
    getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    getSubtotal: () => get().items.reduce((sum, i) => sum + (i.price * i.quantity), 0),
  }),
  { name: 'foodrush-cart', partialize: (s) => ({ items: s.items, restaurant: s.restaurant }) }
))

export default useCartStore
