import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, Plus, Utensils, ClipboardList, CheckCircle2, Clock, 
  Bike, Check, X, AlertCircle, RefreshCw, Sparkles, Image as ImageIcon,
  DollarSign, ChevronRight, ToggleLeft, ToggleRight, Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import { restaurantService } from '../services/restaurantService';
import { orderService } from '../services/orderService';
import Spinner from '../components/common/Spinner';

// Curated high quality food image suggestions for quick 1-click paste
const SAMPLE_FOOD_IMAGES = [
  { label: '🍔 Gourmet Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80', cat: 'Burgers', veg: false },
  { label: '🍕 Margherita Pizza', url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&q=80', cat: 'Pizza', veg: true },
  { label: '🍚 Chicken Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80', cat: 'Biryani', veg: false },
  { label: '🧀 Paneer Butter Masala', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80', cat: 'Main Course', veg: true },
  { label: '🥡 Hakka Noodles', url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80', cat: 'Chinese', veg: true },
  { label: '🍣 Sushi Rolls', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80', cat: 'Sushi', veg: false },
  { label: '🍫 Belgian Waffle', url: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&q=80', cat: 'Desserts', veg: true },
  { label: '🍓 Berry Milkshake', url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80', cat: 'Beverages', veg: true }
];

const SAMPLE_RESTAURANT_BANNERS = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80',
  'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=1200&q=80'
];

const PartnerDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'menu'
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // New restaurant registration modal/form state
  const [regForm, setRegForm] = useState({
    name: '',
    description: '',
    cuisine: 'North Indian',
    imageUrl: SAMPLE_RESTAURANT_BANNERS[0],
    coverImageUrl: SAMPLE_RESTAURANT_BANNERS[1],
    deliveryFee: 30,
    minOrder: 149,
    deliveryTimeMin: 25,
    deliveryTimeMax: 35,
    address: '',
    city: '',
    isVeg: false,
  });

  // New Dish modal state
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [dishForm, setDishForm] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: SAMPLE_FOOD_IMAGES[0].url,
    category: 'Main Course',
    isVeg: false,
    preparationTime: 20,
  });
  const [submittingDish, setSubmittingDish] = useState(false);

  // Fetch restaurant & data
  const loadDashboardData = async () => {
    try {
      const restRes = await restaurantService.getMyRestaurant();
      const restData = restRes.data?.data;
      if (restData) {
        setRestaurant(restData);
        // Load menu
        const menuRes = await restaurantService.getRestaurantMenuItems(restData.id);
        setMenuItems(menuRes.data?.data || []);
        // Load orders
        const ordersRes = await orderService.getRestaurantOrders();
        setOrders(ordersRes.data?.data || []);
      }
    } catch (err) {
      console.error('Error loading restaurant dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  // Register restaurant
  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await restaurantService.createRestaurant(regForm);
      const newRest = res.data?.data;
      setRestaurant(newRest);
      toast.success('Restaurant registered successfully! 🎉');
      loadDashboardData();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to register restaurant.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Add Dish
  const handleAddDish = async (e) => {
    e.preventDefault();
    if (!dishForm.name || !dishForm.price) {
      toast.error('Please enter dish name and price');
      return;
    }
    setSubmittingDish(true);
    try {
      await restaurantService.addMenuItem(restaurant.id, {
        ...dishForm,
        price: parseFloat(dishForm.price),
        preparationTime: parseInt(dishForm.preparationTime || 20),
      });
      toast.success('Dish added to menu! 🍽️');
      setIsDishModalOpen(false);
      setDishForm({
        name: '',
        description: '',
        price: '',
        imageUrl: SAMPLE_FOOD_IMAGES[0].url,
        category: 'Main Course',
        isVeg: false,
        preparationTime: 20,
      });
      // Refresh menu
      const menuRes = await restaurantService.getRestaurantMenuItems(restaurant.id);
      setMenuItems(menuRes.data?.data || []);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to add dish.';
      toast.error(msg);
    } finally {
      setSubmittingDish(false);
    }
  };

  // Toggle dish stock
  const handleToggleDish = async (dishId) => {
    try {
      await restaurantService.toggleMenuItem(dishId);
      setMenuItems(prev => prev.map(item => item.id === dishId ? { ...item, isAvailable: !item.isAvailable } : item));
      toast.success('Dish availability updated');
    } catch (err) {
      toast.error('Failed to update dish');
    }
  };

  // Delete dish
  const handleDeleteDish = async (dishId) => {
    if (!window.confirm('Are you sure you want to remove this dish?')) return;
    try {
      await restaurantService.deleteMenuItem(dishId);
      setMenuItems(prev => prev.filter(item => item.id !== dishId));
      toast.success('Dish deleted');
    } catch (err) {
      toast.error('Failed to delete dish');
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      toast.success(`Order #${orderId} moved to ${newStatus} 🎉`);
      // Update local state
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  // If partner hasn't created a restaurant yet
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/60 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-4xl">🏪</span>
            <h1 className="text-3xl font-extrabold text-navy mt-2">Welcome, Restaurant Partner!</h1>
            <p className="text-gray-600 mt-1">Let's set up your restaurant profile so you can start receiving orders.</p>
          </div>

          {/* Glassmorphic Setup Card */}
          <div className="backdrop-blur-xl bg-white/80 border border-white/60 shadow-2xl rounded-3xl p-8 sm:p-10">
            <form onSubmit={handleCreateRestaurant} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1.5">Restaurant Name *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. Royal Kitchen Bistro"
                    value={regForm.name}
                    onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy mb-1.5">Cuisine Type *</label>
                  <select
                    className="input-field"
                    value={regForm.cuisine}
                    onChange={e => setRegForm({ ...regForm, cuisine: e.target.value })}
                  >
                    <option value="North Indian">North Indian</option>
                    <option value="Biryani">Biryani</option>
                    <option value="Burgers & Fast Food">Burgers & Fast Food</option>
                    <option value="Italian & Pizza">Italian & Pizza</option>
                    <option value="Chinese">Chinese</option>
                    <option value="South Indian">South Indian</option>
                    <option value="Desserts & Bakery">Desserts & Bakery</option>
                    <option value="Japanese & Sushi">Japanese & Sushi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Short Description</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Authentic recipes made fresh with love"
                  value={regForm.description}
                  onChange={e => setRegForm({ ...regForm, description: e.target.value })}
                />
              </div>

              {/* Sample Cover Images */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Restaurant Banner Image URL</label>
                <input
                  type="url"
                  required
                  className="input-field mb-2"
                  value={regForm.coverImageUrl}
                  onChange={e => setRegForm({ ...regForm, coverImageUrl: e.target.value })}
                />
                <div className="text-xs text-gray-500 mb-2">Or choose from sample premium aesthetic banners:</div>
                <div className="grid grid-cols-4 gap-2">
                  {SAMPLE_RESTAURANT_BANNERS.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Banner sample"
                      onClick={() => setRegForm({ ...regForm, coverImageUrl: url, imageUrl: url })}
                      className={`h-16 w-full object-cover rounded-xl cursor-pointer border-2 transition-all hover:scale-105 ${
                        regForm.coverImageUrl === url ? 'border-primary ring-2 ring-primary/40' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1.5">Street Address</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. 104, Park Avenue Road"
                    value={regForm.address}
                    onChange={e => setRegForm({ ...regForm, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1.5">City</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. Mumbai, Bangalore, Chennai"
                    value={regForm.city}
                    onChange={e => setRegForm({ ...regForm, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Delivery Fee (₹)</label>
                  <input
                    type="number"
                    required
                    className="input-field"
                    value={regForm.deliveryFee}
                    onChange={e => setRegForm({ ...regForm, deliveryFee: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    required
                    className="input-field"
                    value={regForm.minOrder}
                    onChange={e => setRegForm({ ...regForm, minOrder: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Pure Veg Only?</label>
                  <select
                    className="input-field"
                    value={regForm.isVeg ? 'true' : 'false'}
                    onChange={e => setRegForm({ ...regForm, isVeg: e.target.value === 'true' })}
                  >
                    <option value="false">Non-Veg & Veg</option>
                    <option value="true">100% Pure Veg</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full h-13 text-lg font-bold shadow-xl shadow-primary/30 hover:shadow-2xl transition-all"
              >
                Create Restaurant Profile & Open for Business 🚀
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* 3D Glassmorphic Header Card */}
        <div className="relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-white/85 border border-white/60 shadow-xl p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl -z-10 -mr-20 -mt-20"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img
                src={restaurant.imageUrl || SAMPLE_RESTAURANT_BANNERS[0]}
                alt={restaurant.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-lg border-2 border-white ring-2 ring-primary/20"
              />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-black text-navy tracking-tight">{restaurant.name}</h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                    Active Partner
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">{restaurant.cuisine} • {restaurant.city} • ₹{restaurant.minOrder} Min Order</p>
                <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-gray-600">
                  <span>⭐ {restaurant.rating || 4.5} Rating</span>
                  <span>🛵 ₹{restaurant.deliveryFee} Delivery</span>
                  <span>📍 {restaurant.address}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 self-start md:self-center">
              <button
                onClick={handleRefresh}
                className="p-3 bg-white/80 hover:bg-white text-navy rounded-2xl border border-gray-200 shadow-sm transition-all hover:scale-105 active:scale-95"
                title="Refresh dashboard"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin text-primary' : ''}`} />
              </button>
              <button
                onClick={() => setIsDishModalOpen(true)}
                className="btn-primary flex items-center gap-2 py-3 px-5 rounded-2xl shadow-primary/30 hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Add Food Dish</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-4 mt-8 border-b border-gray-200/80">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 pb-3 px-2 font-bold text-sm tracking-wide transition-all border-b-2 ${
                activeTab === 'orders'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-navy'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Live Orders ({orders.length})</span>
              {orders.filter(o => o.status === 'CONFIRMED' || o.status === 'PREPARING').length > 0 && (
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-2 pb-3 px-2 font-bold text-sm tracking-wide transition-all border-b-2 ${
                activeTab === 'menu'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-navy'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Menu & Dishes ({menuItems.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: LIVE ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-navy">Customer Orders</h2>
              <span className="text-sm text-gray-500">Live order status updates</span>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 backdrop-blur-md bg-white/70 rounded-3xl border border-gray-200">
                <span className="text-5xl">🛵</span>
                <h3 className="text-lg font-bold text-navy mt-4">No orders placed yet</h3>
                <p className="text-gray-500 text-sm mt-1">Orders placed by customers will appear here in real-time.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => {
                  const statusColors = {
                    PENDING_OTP: 'bg-amber-50 text-amber-700 border-amber-200',
                    CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
                    PREPARING: 'bg-orange-50 text-orange-700 border-orange-200',
                    OUT_FOR_DELIVERY: 'bg-purple-50 text-purple-700 border-purple-200',
                    DELIVERED: 'bg-green-50 text-green-700 border-green-200',
                    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
                  };

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="backdrop-blur-xl bg-white/90 border border-white/80 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl p-6 flex flex-col justify-between"
                    >
                      <div>
                        {/* Order Header */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-extrabold text-navy text-lg">Order #{order.id}</span>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Customer Info */}
                        <div className="text-xs text-gray-500 mb-4 pb-3 border-b border-gray-100 space-y-1">
                          <div className="font-semibold text-navy text-sm">{order.customerName || 'Customer'}</div>
                          {order.customerPhone && <div>📞 {order.customerPhone}</div>}
                          <div>📍 {order.deliveryAddress || 'Standard Delivery'}</div>
                          {order.specialInstructions && (
                            <div className="text-primary italic mt-1">Note: {order.specialInstructions}</div>
                          )}
                        </div>

                        {/* Items list */}
                        <div className="space-y-2 mb-4">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span className="font-medium text-navy">
                                <span className="text-primary font-bold">{item.quantity}x</span> {item.name}
                              </span>
                              <span className="text-gray-600 font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer & Actions */}
                      <div className="pt-4 border-t border-gray-100 mt-2">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xs text-gray-400 font-medium">Grand Total</span>
                          <span className="text-xl font-black text-primary">₹{order.total?.toFixed(2)}</span>
                        </div>

                        {/* Action buttons based on status */}
                        <div className="flex flex-col gap-2">
                          {order.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'PREPARING')}
                              className="w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                            >
                              <span>🍳 Start Preparing</span>
                            </button>
                          )}

                          {order.status === 'PREPARING' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'OUT_FOR_DELIVERY')}
                              className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                            >
                              <Bike className="w-4 h-4" />
                              <span>Dispatch for Delivery</span>
                            </button>
                          )}

                          {order.status === 'OUT_FOR_DELIVERY' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}
                              className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Mark as Delivered</span>
                            </button>
                          )}

                          {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                              className="w-full py-1.5 px-4 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MENU & DISH MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-navy">Restaurant Menu Items</h2>
                <p className="text-gray-500 text-sm">Add dishes with image URLs, toggle in-stock availability, or update prices.</p>
              </div>
              <button
                onClick={() => setIsDishModalOpen(true)}
                className="btn-primary flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Dish</span>
              </button>
            </div>

            {menuItems.length === 0 ? (
              <div className="text-center py-16 backdrop-blur-md bg-white/70 rounded-3xl border border-gray-200">
                <span className="text-5xl">🍽️</span>
                <h3 className="text-lg font-bold text-navy mt-4">Your menu is empty</h3>
                <p className="text-gray-500 text-sm mt-1">Click "Add Food Dish" above to upload your first delicious item!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {menuItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -4 }}
                    className="backdrop-blur-xl bg-white/90 border border-white/80 shadow-card hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Dish Image */}
                      <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                        <img
                          src={item.imageUrl || SAMPLE_FOOD_IMAGES[0].url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-bold backdrop-blur-md ${
                            item.isVeg ? 'bg-green-600/90 text-white' : 'bg-red-600/90 text-white'
                          }`}>
                            {item.isVeg ? '🟢 VEG' : '🔴 NON-VEG'}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md bg-white/90 text-navy shadow-sm">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-extrabold text-navy text-lg leading-tight">{item.name}</h3>
                          <span className="font-black text-primary text-lg">₹{item.price}</span>
                        </div>
                        <p className="text-gray-500 text-xs line-clamp-2 mt-1">
                          {item.description || 'Deliciously prepared dish made with fresh ingredients.'}
                        </p>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
                      <button
                        onClick={() => handleToggleDish(item.id)}
                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                          item.isAvailable
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {item.isAvailable ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        <span>{item.isAvailable ? 'In Stock' : 'Sold Out'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteDish(item.id)}
                        className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete dish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ADD DISH MODAL */}
      <AnimatePresence>
        {isDishModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🍽️</span>
                  <h3 className="text-xl font-bold text-navy">Add New Food Item</h3>
                </div>
                <button
                  onClick={() => setIsDishModalOpen(false)}
                  className="text-gray-400 hover:text-navy p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddDish} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Dish Name *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. Smoky BBQ Bacon Burger"
                    value={dishForm.name}
                    onChange={e => setDishForm({ ...dishForm, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="input-field"
                      placeholder="249"
                      value={dishForm.price}
                      onChange={e => setDishForm({ ...dishForm, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Category *</label>
                    <select
                      className="input-field"
                      value={dishForm.category}
                      onChange={e => setDishForm({ ...dishForm, category: e.target.value })}
                    >
                      <option value="Starters">Starters</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Burgers">Burgers</option>
                      <option value="Pizza">Pizza</option>
                      <option value="Biryani">Biryani</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                    </select>
                  </div>
                </div>

                {/* Example Quick Image Selector */}
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Food Image URL *</label>
                  <input
                    type="url"
                    required
                    className="input-field mb-2"
                    placeholder="https://..."
                    value={dishForm.imageUrl}
                    onChange={e => setDishForm({ ...dishForm, imageUrl: e.target.value })}
                  />
                  <div className="text-xs text-gray-500 mb-2">Or click an example photo to insert:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_FOOD_IMAGES.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setDishForm({ 
                          ...dishForm, 
                          imageUrl: sample.url, 
                          category: sample.cat, 
                          isVeg: sample.veg,
                          name: dishForm.name || sample.label.split(' ')[1] 
                        })}
                        className="text-xs font-semibold px-2.5 py-1 bg-gray-100 hover:bg-primary-50 hover:text-primary rounded-lg border border-gray-200 transition-colors"
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Description</label>
                  <textarea
                    rows={2}
                    className="input-field resize-none"
                    placeholder="Crispy patty loaded with caramelized onions and signature sauce..."
                    value={dishForm.description}
                    onChange={e => setDishForm({ ...dishForm, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Diet Type</label>
                    <select
                      className="input-field"
                      value={dishForm.isVeg ? 'true' : 'false'}
                      onChange={e => setDishForm({ ...dishForm, isVeg: e.target.value === 'true' })}
                    >
                      <option value="false">🔴 Non-Vegetarian</option>
                      <option value="true">🟢 Vegetarian</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Prep Time (mins)</label>
                    <input
                      type="number"
                      className="input-field"
                      value={dishForm.preparationTime}
                      onChange={e => setDishForm({ ...dishForm, preparationTime: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingDish}
                  className="btn-primary w-full h-12 flex justify-center items-center text-base font-bold shadow-lg shadow-primary/30 mt-6"
                >
                  {submittingDish ? <Spinner size="sm" /> : 'Publish Dish to Menu 🚀'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PartnerDashboard;
