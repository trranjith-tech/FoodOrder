import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Plus, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useCartStore from '../store/useCartStore';
import { userService } from '../services/userService';
import { orderService } from '../services/orderService';
import useAuthStore from '../store/useAuthStore';
import OtpModal from '../components/auth/OtpModal';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, restaurant, getSubtotal } = useCartStore();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  const [newAddress, setNewAddress] = useState({ label: 'Home', street: '', city: '', state: '', pincode: '' });

  useEffect(() => {
    if (items.length === 0) {
      navigate('/');
      return;
    }
    const fetchAddresses = async () => {
      try {
        const res = await userService.getAddresses();
        const addressList = res.data?.data || res.data || [];
        setAddresses(addressList);
        if (addressList.length > 0) setSelectedAddress(addressList[0].id);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };
    fetchAddresses();
  }, [items, navigate]);

  const subtotal = getSubtotal();
  const deliveryFee = restaurant?.deliveryFee || 0;
  const total = subtotal + deliveryFee;
  const isBelowMin = restaurant && restaurant.minOrder && subtotal < restaurant.minOrder;

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await userService.addAddress(newAddress);
      const saved = res.data?.data || res.data;
      setAddresses([...addresses, saved]);
      setSelectedAddress(saved.id);
      setShowAddForm(false);
      setNewAddress({ label: 'Home', street: '', city: '', state: '', pincode: '' });
      toast.success('Address added');
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    if (isBelowMin) {
      toast.error(`Minimum order amount is ₹${restaurant.minOrder}`);
      return;
    }

    setIsOrdering(true);
    try {
      const orderData = {
        restaurantId: restaurant.id,
        items: items.map(i => ({ menuItemId: i.id, quantity: i.quantity })),
        addressId: selectedAddress,
        specialInstructions: instructions
      };
      const res = await orderService.create(orderData);
      const createdOrder = res.data?.data || res.data;
      setOrderId(createdOrder.id);
      setShowOtp(true);
      toast.success('Order OTP sent to your registered email! 📧');
    } catch (error) {
      const msg = error?.response?.data?.message || 'Failed to place order';
      toast.error(msg);
    } finally {
      setIsOrdering(false);
    }
  };

  const handleVerifyOtp = async (otp) => {
    setOtpLoading(true);
    setOtpError('');
    try {
      await orderService.confirm(orderId, otp);
      setShowOtp(false);
      toast.success('Order Confirmed! 🎉');
      navigate(`/order/${orderId}/confirmation`);
    } catch (error) {
      const msg = error?.response?.data?.message || 'Invalid OTP. Please try again.';
      setOtpError(msg);
      toast.error(msg);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <h1 className="text-3xl font-bold text-navy mb-8">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
              <MapPin className="text-primary" /> Delivery Address
            </h2>
            
            <div className="space-y-4">
              {addresses.map(addr => (
                <label key={addr.id} className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${selectedAddress === addr.id ? 'border-primary bg-primary-50/30' : 'border-gray-100 hover:border-gray-200'}`}>
                  <div className="mt-1">
                    <input 
                      type="radio" 
                      name="address" 
                      className="w-4 h-4 text-primary focus:ring-primary"
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-navy">{addr.label}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{addr.street}, {addr.city}</p>
                    <p className="text-gray-600 text-sm">{addr.state} - {addr.pincode}</p>
                  </div>
                </label>
              ))}

              {!showAddForm ? (
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:text-primary hover:border-primary transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" /> Add New Address
                </button>
              ) : (
                <form onSubmit={handleSaveAddress} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <select 
                        value={newAddress.label}
                        onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                        className="input-field"
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <input required placeholder="Street Address" className="input-field" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                    </div>
                    <input required placeholder="City" className="input-field" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                    <input required placeholder="State" className="input-field" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} />
                    <input required placeholder="Pincode" className="input-field" value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary flex-1 py-2">Cancel</button>
                    <button type="submit" className="btn-primary flex-1 py-2">Save Address</button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-navy mb-4">Special Instructions</h2>
            <textarea 
              placeholder="Any specific instructions for the restaurant? (e.g. less spicy, extra napkins)"
              className="input-field h-24 resize-none"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-navy mb-4">Order Summary</h2>
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img src={restaurant?.imageUrl || ''} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-navy">{restaurant?.name}</h3>
                <p className="text-sm text-gray-500">{restaurant?.cuisine}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div className="flex gap-2 text-navy font-medium">
                    <span className="text-gray-500">{item.quantity}x</span>
                    <span className="line-clamp-1">{item.name}</span>
                  </div>
                  <span className="font-semibold whitespace-nowrap">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 py-4 border-t border-b border-gray-100 mb-6 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-lg text-navy">Total</span>
              <span className="font-bold text-xl text-primary">₹{total}</span>
            </div>

            {isBelowMin && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2 text-sm text-orange-800">
                <Info className="w-5 h-5 flex-shrink-0" />
                <p>Add ₹{restaurant.minOrderAmount - subtotal} more to reach the minimum order amount.</p>
              </div>
            )}

            <button 
              onClick={handleCreateOrder}
              disabled={!selectedAddress || isBelowMin || isOrdering}
              className="btn-primary w-full py-4 text-lg shadow-[0_4px_14px_rgba(255,69,0,0.35)]"
            >
              {isOrdering ? 'Processing...' : 'Confirm Order with OTP'}
            </button>
          </div>
        </div>
      </div>

      <OtpModal 
        isOpen={showOtp}
        onClose={() => setShowOtp(false)}
        onVerify={handleVerifyOtp}
        email={user?.email || 'your registered email'}
        purpose="ORDER"
        isLoading={otpLoading}
        error={otpError}
      />
    </motion.div>
  );
};

export default Checkout;
