import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const OrderConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    clearCart();
    // Generate random confetti particles
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -20,
      size: Math.random() * 10 + 5,
      color: ['#FF4500', '#FFD700', '#4CAF50', '#2196F3'][Math.floor(Math.random() * 4)],
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 0.5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[80vh] flex flex-col items-center justify-center p-4 relative overflow-hidden"
    >
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: p.x, y: p.y, opacity: 1 }}
          animate={{ y: window.innerHeight, opacity: 0 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
          className="absolute rounded-full z-0"
          style={{ width: p.size, height: p.size, backgroundColor: p.color }}
        />
      ))}

      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center relative z-10 border border-gray-100">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/30">
            <Check className="w-8 h-8" strokeWidth={3} />
          </div>
        </motion.div>
        
        <h1 className="text-3xl font-extrabold text-navy mb-2">Order Confirmed! 🎉</h1>
        <p className="text-gray-500 mb-6">Your order has been placed successfully.</p>
        
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Order ID</p>
          <p className="font-mono font-bold text-navy text-lg">#{id.substring(0,8).toUpperCase()}</p>
          
          <div className="border-t border-gray-200 my-4"></div>
          
          <p className="text-sm text-gray-500 mb-1">Estimated Delivery Time</p>
          <p className="font-bold text-primary text-xl">30 - 45 mins</p>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={() => navigate(`/order/${id}/tracking`)}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            Track Order <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => navigate('/')}
            className="btn-secondary w-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderConfirmation;
