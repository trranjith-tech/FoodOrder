import React from 'react';
import { Minus, Plus, Star } from 'lucide-react';
import useCartStore from '../../store/useCartStore';

const MenuItemCard = ({ item, restaurant, onAdd }) => {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find(i => i.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    if (onAdd) onAdd();
    addItem(item, restaurant || { id: item.restaurantId, name: item.restaurantName });
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-gray-100 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 flex justify-between gap-4">
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className={`w-4 h-4 border-2 ${item.isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center rounded-sm`}>
              <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
            </div>
            {item.rating && (
              <span className="flex items-center gap-0.5 text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {item.rating}
              </span>
            )}
            {item.restaurantName && (
              <span className="text-xs font-semibold text-gray-500 truncate max-w-[150px]">
                by {item.restaurantName}
              </span>
            )}
          </div>
          
          <h3 className="font-bold text-navy text-base group-hover:text-primary transition-colors">{item.name}</h3>
          <p className="font-extrabold text-primary text-lg mt-1">₹{item.price}</p>
          {item.description && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
          )}
        </div>
      </div>
      
      <div className="w-[120px] flex flex-col items-center relative">
        <div className="w-[120px] h-[100px] rounded-xl overflow-hidden bg-gray-100 shadow-sm relative">
          <img 
            src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'} 
            alt={item.name} 
            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500" 
          />
        </div>
        
        <div className="w-[100px] -mt-5 relative z-10">
          {quantity === 0 ? (
            <button 
              onClick={handleAdd}
              className="w-full bg-white text-primary border-2 border-primary/20 hover:border-primary font-extrabold py-1.5 px-3 rounded-xl shadow-lg hover:bg-primary hover:text-white transition-all duration-200 text-sm active:scale-95"
            >
              ADD +
            </button>
          ) : (
            <div className="w-full bg-white border-2 border-primary rounded-xl shadow-lg flex items-center justify-between p-1">
              <button 
                onClick={() => quantity === 1 ? removeItem(item.id) : updateQuantity(item.id, quantity - 1)}
                className="w-6 h-6 flex items-center justify-center text-primary hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-extrabold text-sm text-navy">{quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, quantity + 1)}
                className="w-6 h-6 flex items-center justify-center text-primary hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
