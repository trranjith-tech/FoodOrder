import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Star, Bike } from 'lucide-react';
import { restaurantService } from '../services/restaurantService';
import MenuItemCard from '../components/restaurant/MenuItemCard';
import useCartStore from '../store/useCartStore';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');
  const { items, openCart, getSubtotal } = useCartStore();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await restaurantService.getById(id);
        const data = res.data?.data || res.data;
        setRestaurant(data);
        if (data && data.menu) {
          const categories = Object.keys(data.menu);
          if (categories.length > 0) setActiveTab(categories[0]);
        }
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const scrollToCategory = (categoryName) => {
    setActiveTab(categoryName);
    const element = document.getElementById(`category-${categoryName}`);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 180;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-navy">Restaurant not found</h2>
        <button onClick={() => navigate('/')} className="mt-4 btn-primary">Back to Home</button>
      </div>
    );
  }

  const cartTotal = getSubtotal();
  const menuCategories = restaurant.menu ? Object.entries(restaurant.menu) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="pb-24 relative"
    >
      <div className="relative h-[300px] w-full">
        <img 
          src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80'} 
          alt={restaurant.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-2">{restaurant.name}</h1>
              <p className="text-gray-500 text-lg">{restaurant.cuisine}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-bold text-sm shadow-sm ${restaurant.isOpen || restaurant.open ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {(restaurant.isOpen || restaurant.open) ? 'OPEN NOW' : 'CLOSED'}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="font-bold text-navy">{restaurant.rating || '4.5'}</p>
                <p className="text-xs text-gray-500">Rating</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-navy">{restaurant.deliveryTimeMin || 25}-{restaurant.deliveryTimeMax || 35} mins</p>
                <p className="text-xs text-gray-500">Delivery Time</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-navy">₹{restaurant.deliveryFee || 30}</p>
                <p className="text-xs text-gray-500">Delivery Fee</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                <span className="font-bold">₹</span>
              </div>
              <div>
                <p className="font-bold text-navy">₹{restaurant.minOrder || 149}</p>
                <p className="text-xs text-gray-500">Min. Order</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {menuCategories.length > 0 && (
          <div className="sticky top-16 z-40 bg-gray-50/95 backdrop-blur-sm py-4 border-b border-gray-200 overflow-x-auto no-scrollbar">
            <div className="flex space-x-2">
              {menuCategories.map(([categoryName]) => (
                <button
                  key={categoryName}
                  onClick={() => scrollToCategory(categoryName)}
                  className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                    activeTab === categoryName 
                      ? 'bg-primary text-white shadow-primary' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {categoryName}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 space-y-12">
          {menuCategories.map(([categoryName, itemsList]) => (
            <div key={categoryName} id={`category-${categoryName}`}>
              <h2 className="text-2xl font-bold text-navy mb-6 pb-2 border-b-2 border-gray-100">{categoryName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {itemsList.map((item) => (
                  <MenuItemCard key={item.id} item={item} restaurant={restaurant} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {items.length > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none flex justify-center"
        >
          <div 
            className="bg-primary text-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 max-w-4xl w-full flex justify-between items-center pointer-events-auto cursor-pointer hover:bg-primary-600 transition-colors" 
            onClick={openCart}
          >
            <div>
              <p className="text-xs text-primary-100 font-medium mb-0.5">{items.length} ITEM{items.length > 1 ? 'S' : ''}</p>
              <p className="font-bold text-lg">₹{cartTotal} <span className="text-sm font-normal text-primary-100">+ taxes</span></p>
            </div>
            <div className="flex items-center gap-2 font-bold">
              View Cart <ArrowLeft className="w-5 h-5 rotate-180" />
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RestaurantDetail;
