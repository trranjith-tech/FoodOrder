import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Bike } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  const deliveryTime = restaurant.deliveryTimeMin 
    ? `${restaurant.deliveryTimeMin}-${restaurant.deliveryTimeMax} min`
    : (restaurant.deliveryTime ? `${restaurant.deliveryTime} min` : '25-35 min');
    
  const minOrder = restaurant.minOrder || restaurant.minOrderAmount || 149;

  return (
    <Link to={`/restaurant/${restaurant.id}`} className="block group">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-100 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_30px_rgba(255,69,0,0.15)] transition-all duration-300 transform group-hover:-translate-y-1">
        <div className="relative h-52 overflow-hidden">
          <img 
            src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80'} 
            alt={restaurant.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-2.5 py-1 text-xs font-bold rounded-full backdrop-blur-md shadow-md ${
              restaurant.isOpen || restaurant.open !== false 
                ? 'bg-green-500/90 text-white' 
                : 'bg-gray-900/80 text-white'
            }`}>
              {(restaurant.isOpen || restaurant.open !== false) ? 'OPEN NOW' : 'CLOSED'}
            </span>
          </div>
          
          {restaurant.isVeg && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
              <span className="text-[10px] font-bold text-green-700">PURE VEG</span>
            </div>
          )}

          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
            <span className="text-xs bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg font-medium border border-white/20">
              {restaurant.cuisine}
            </span>
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-navy group-hover:text-primary transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-2 py-0.5 rounded-lg text-xs font-bold shadow-sm">
              <Star className="w-3 h-3 fill-current" />
              <span>{restaurant.rating || '4.5'}</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mb-4 line-clamp-1">{restaurant.address || 'Central District'}</p>

          <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>{deliveryTime}</span>
            </div>
            
            <div className="flex items-center gap-1.5 font-medium">
              <Bike className="w-3.5 h-3.5 text-emerald-600" />
              <span>₹{restaurant.deliveryFee || 30} delivery</span>
            </div>

            <div className="text-gray-400 font-normal">
              Min ₹{minOrder}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
