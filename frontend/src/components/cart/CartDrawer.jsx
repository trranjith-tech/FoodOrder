import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';

const CartDrawer = () => {
  const { isOpen, closeCart, items, restaurant, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const subtotal = getSubtotal();
  const deliveryFee = restaurant?.deliveryFee || 0;
  const total = subtotal > 0 ? subtotal + deliveryFee : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-[380px] sm:w-[380px] bg-white shadow-2xl z-[101] flex flex-col"
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <h2 className="text-lg font-bold text-navy">Your Cart</h2>
                {restaurant && <p className="text-sm text-gray-500">{restaurant.name}</p>}
              </div>
              <button onClick={closeCart} className="p-2 text-gray-400 hover:text-navy rounded-full hover:bg-gray-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <span className="text-6xl">🛒</span>
                  <div>
                    <h3 className="font-semibold text-navy text-lg">Your cart is empty</h3>
                    <p className="text-gray-500 text-sm mt-1">Looks like you haven't added anything yet.</p>
                  </div>
                  <button onClick={closeCart} className="btn-secondary mt-4">Browse restaurants</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🍲</div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-medium text-navy text-sm line-clamp-2">{item.name}</h4>
                          <span className="font-semibold text-primary whitespace-nowrap">₹{item.price}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-primary bg-white rounded shadow-sm">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-primary bg-white rounded shadow-sm">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-100 bg-white p-4 space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex justify-between font-bold text-lg text-navy">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
                <button onClick={handleCheckout} className="btn-primary w-full py-4 text-lg">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
