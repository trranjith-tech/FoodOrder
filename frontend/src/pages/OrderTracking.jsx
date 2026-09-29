import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageSquare } from 'lucide-react';
import { orderService } from '../services/orderService';
import Spinner from '../components/common/Spinner';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Mock API call to get order details
        // const res = await orderService.getById(id);
        // setOrder(res.data);
        setTimeout(() => {
          setOrder({
            id,
            status: 'PREPARING',
            restaurant: { name: 'Burger King', phone: '1234567890' },
            items: [{ name: 'Whopper', quantity: 2, price: 299 }],
            totalAmount: 598,
            deliveryAddress: { street: '123 Main St', city: 'City' }
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch order', error);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="min-h-[60vh] flex justify-center items-center"><Spinner size="lg" /></div>;
  if (!order) return <div className="text-center py-20">Order not found</div>;

  const steps = [
    { key: 'PENDING', label: 'Order Placed', emoji: '📝' },
    { key: 'CONFIRMED', label: 'Order Confirmed', emoji: '✅' },
    { key: 'PREPARING', label: 'Preparing Your Food', emoji: '🍳' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', emoji: '🛵' },
    { key: 'DELIVERED', label: 'Delivered', emoji: '🎉' }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.status) >= 0 ? steps.findIndex(s => s.key === order.status) : 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 py-8"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="bg-primary/5 p-6 border-b border-primary/10 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-navy">Order #{id.substring(0,8).toUpperCase()}</h1>
            <p className="text-sm text-gray-500 mt-1">From <span className="font-semibold text-navy">{order.restaurant.name}</span></p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-0.5">ETA</p>
            <p className="text-xl font-bold text-primary">24 mins</p>
          </div>
        </div>

        <div className="p-8">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-100 -ml-0.5 rounded-full z-0"></div>
            
            <div className="space-y-8 relative z-10">
              {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div key={step.key} className="flex items-center gap-6">
                    <div className="relative">
                      {isCompleted && <div className="absolute top-8 left-1/2 -ml-[2px] w-1 h-12 bg-green-500 -z-10"></div>}
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-sm border-4 border-white
                        ${isCompleted ? 'bg-green-100 text-green-600 ring-2 ring-green-500' : 
                          isCurrent ? 'bg-orange-100 text-orange-500 ring-4 ring-orange-200 animate-pulse' : 
                          'bg-gray-50 text-gray-400 grayscale'}`}
                      >
                        {step.emoji}
                      </div>
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${isCompleted || isCurrent ? 'text-navy' : 'text-gray-400'}`}>
                        {step.label}
                      </h3>
                      {isCurrent && <p className="text-sm text-gray-500 mt-1">Working on it right now!</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-navy mb-4 border-b border-gray-100 pb-2">Order Details</h3>
          <div className="space-y-3 mb-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.quantity}x {item.name}</span>
                <span className="font-medium text-navy">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-navy">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-navy mb-4 border-b border-gray-100 pb-2">Need Help?</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-200 text-navy font-medium hover:bg-gray-50 transition-colors">
              <Phone className="w-4 h-4" /> Call Restaurant
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-200 text-navy font-medium hover:bg-gray-50 transition-colors">
              <MessageSquare className="w-4 h-4" /> Support Chat
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderTracking;
