import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Utensils, Store, X } from 'lucide-react';
import { restaurantService } from '../services/restaurantService';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import MenuItemCard from '../components/restaurant/MenuItemCard';
import SkeletonCard from '../components/common/SkeletonCard';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Live search popover states (Swiggy / Zomato style)
  const [matchedDishes, setMatchedDishes] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchPopover, setShowSearchPopover] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restRes, catRes] = await Promise.all([
          restaurantService.getAll(),
          restaurantService.getCategories()
        ]);
        const restData = restRes.data?.data || restRes.data || [];
        const catData = catRes.data?.data || catRes.data || [];
        setRestaurants(Array.isArray(restData) ? restData : []);
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle live search input change (debounced dish search)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setMatchedDishes([]);
      setShowSearchPopover(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setShowSearchPopover(true);
      try {
        const res = await restaurantService.searchDishes(searchQuery);
        const dishes = res.data?.data || res.data || [];
        setMatchedDishes(Array.isArray(dishes) ? dishes : []);
      } catch (e) {
        console.error('Dish search error:', e);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Hide search popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkCategoryMatch = (restaurant, cat) => {
    if (cat === 'All') return true;
    const catLower = cat.toLowerCase();
    const rCuisine = (restaurant.cuisine || '').toLowerCase();
    const rName = (restaurant.name || '').toLowerCase();
    const rDesc = (restaurant.description || '').toLowerCase();

    if (rCuisine.includes(catLower) || rName.includes(catLower) || rDesc.includes(catLower)) {
      return true;
    }
    if (catLower === 'biryani' && (rCuisine.includes('indian') || rName.includes('spice') || rName.includes('biryani'))) return true;
    if (catLower === 'burgers' && (rCuisine.includes('american') || rName.includes('burger'))) return true;
    if (catLower === 'pizza' && (rCuisine.includes('italian') || rName.includes('pizza'))) return true;
    if (catLower === 'crispy chicken' && (rName.includes('chicken') || rCuisine.includes('chicken') || rCuisine.includes('fast food'))) return true;
    if (catLower === 'south indian' && (rCuisine.includes('south indian') || rName.includes('udupi'))) return true;
    if (catLower === 'north indian' && (rCuisine.includes('indian') || rName.includes('spice'))) return true;
    if (catLower === 'rolls & wraps' && (rName.includes('roll') || rName.includes('shawarma') || rCuisine.includes('roll'))) return true;
    if (catLower === 'desserts' && (rCuisine.includes('dessert') || rName.includes('sweet') || rName.includes('cake'))) return true;
    if (catLower === 'beverages' && (rCuisine.includes('dessert') || rName.includes('sweet') || rName.includes('burger'))) return true;
    if (catLower === 'chaat & snacks' && (rCuisine.includes('indian') || rName.includes('udupi') || rName.includes('spice'))) return true;

    return false;
  };

  const filteredRestaurants = restaurants.filter(r => {
    const matchesCat = checkCategoryMatch(r, activeCategory);
    const matchesSearch = !searchQuery || 
      (r.name && r.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.cuisine && r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen bg-[#FAFAFA] pb-16"
    >
      {/* Hero Banner Section */}
      <section className="bg-gradient-to-br from-[#FF4500] via-[#FF6B35] to-[#1A1A2E] pt-20 pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHRleHQgeT0iMjAiIGZvbnQtc2l6ZT0iMjAiPvCfjZQ8L3RleHQ+PC9zdmc+')]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 border border-white/30 uppercase tracking-widest shadow-md">
              ✨ Fast 25-Min Delivery & Real-Time Tracking
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
              Order Food You Love, <br className="hidden md:block"/>Delivered Lightning Fast.
            </h1>
            <p className="text-white/90 text-base md:text-xl mb-10 max-w-2xl mx-auto font-medium">
              Discover top restaurants & dishes near you with instant OTP order confirmation.
            </p>
          </motion.div>
          
          {/* Swiggy / Zomato Style Search Bar & Live Popover */}
          <div ref={searchContainerRef} className="relative max-w-2xl mx-auto z-30">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 flex items-center shadow-2xl border border-white/50">
              <div className="hidden sm:flex flex-1 items-center px-4 border-r border-gray-200">
                <MapPin className="text-primary w-5 h-5 mr-2 shrink-0" />
                <input 
                  type="text" 
                  defaultValue="Indiranagar, Bangalore" 
                  className="w-full bg-transparent border-none focus:ring-0 text-navy font-semibold placeholder-gray-400 py-3 text-sm" 
                />
              </div>
              <div className="flex-1 flex items-center px-4 relative">
                <Search className="text-gray-400 w-5 h-5 mr-2 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search for dish, restaurant or cuisine..." 
                  value={searchQuery}
                  onFocus={() => searchQuery && setShowSearchPopover(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-navy font-medium placeholder-gray-400 py-3 text-sm" 
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(''); setShowSearchPopover(false); }} className="text-gray-400 hover:text-navy p-1">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button className="bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold transition-colors text-sm shadow-primary">
                Search
              </button>
            </div>

            {/* Live Search Popover */}
            <AnimatePresence>
              {showSearchPopover && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-100 p-4 text-left max-h-[480px] overflow-y-auto z-50 text-navy"
                >
                  {isSearching ? (
                    <div className="py-8 text-center text-gray-400 font-medium">Searching matching dishes & restaurants...</div>
                  ) : (
                    <div className="space-y-6">
                      {/* Matched Dishes Section */}
                      {matchedDishes.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <Utensils className="w-4 h-4 text-primary" /> Matching Dishes ({matchedDishes.length})
                          </div>
                          <div className="space-y-3">
                            {matchedDishes.slice(0, 4).map(item => (
                              <MenuItemCard key={item.id} item={item} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Matched Restaurants Section */}
                      {filteredRestaurants.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-t border-gray-100 pt-4">
                            <Store className="w-4 h-4 text-primary" /> Restaurants ({filteredRestaurants.length})
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {filteredRestaurants.slice(0, 4).map(r => (
                              <RestaurantCard key={r.id} restaurant={r} />
                            ))}
                          </div>
                        </div>
                      )}

                      {matchedDishes.length === 0 && filteredRestaurants.length === 0 && (
                        <div className="py-8 text-center">
                          <p className="text-gray-500 font-medium">No dishes or restaurants found for "{searchQuery}"</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-5 border border-white/60">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
            <button 
              onClick={() => setActiveCategory('All')}
              className={`flex flex-col items-center min-w-[90px] p-3 rounded-2xl transition-all duration-200 ${
                activeCategory === 'All' 
                  ? 'bg-primary text-white shadow-primary scale-105' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              <span className="text-3xl mb-1">🍽️</span>
              <span className="text-xs font-bold">All</span>
            </button>
            {categories.map((cat, i) => (
              <button 
                key={i}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex flex-col items-center min-w-[90px] p-3 rounded-2xl transition-all duration-200 ${
                  activeCategory === cat.name 
                    ? 'bg-primary text-white shadow-primary scale-105' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100'
                }`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden mb-1 shadow-sm border border-white">
                  <img src={cat.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80'} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Top Restaurants Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">Top Restaurants Near You</h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">{filteredRestaurants.length} premium restaurants available</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map(r => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-12 text-center shadow-card border border-gray-100">
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-xl font-bold text-navy mb-2">No restaurants match your filter</h3>
            <p className="text-gray-500">Try clearing your search query or selecting "All" category.</p>
            <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} className="mt-4 btn-primary py-2 px-6 text-sm">
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default Home;
