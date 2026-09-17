import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, ChevronDown, LogOut, Package, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getTotalItems, toggleCart } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const cartItemsCount = getTotalItems();

  const isRestaurantPartner = user?.role === 'RESTAURANT';

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-xl border-b border-gray-100/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">🍔</span>
            <span className="font-extrabold text-xl text-primary tracking-tight">FoodRush</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-navy hover:text-primary transition-colors font-medium">Home</Link>
            {isAuthenticated && (
              <Link to="/profile" className="text-navy hover:text-primary transition-colors font-medium">My Orders</Link>
            )}
            {isRestaurantPartner && (
              <Link 
                to="/partner-dashboard" 
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-orange-100 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Partner Dashboard</span>
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-5">
            <button onClick={toggleCart} className="relative p-2 text-navy hover:text-primary transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <motion.span
                  key={cartItemsCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 text-navy hover:text-primary transition-colors focus:outline-none p-1 rounded-xl hover:bg-gray-50"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {user?.name?.charAt(0) || <User className="w-4 h-4" />}
                  </div>
                  <div className="text-left hidden lg:block">
                    <div className="text-xs font-bold leading-tight">{user?.name?.split(' ')[0] || 'User'}</div>
                    <div className="text-[10px] text-gray-400 font-medium">{isRestaurantPartner ? 'Partner' : 'Customer'}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-xs font-semibold text-navy">{user?.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                    </div>

                    {isRestaurantPartner && (
                      <Link 
                        to="/partner-dashboard" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-primary font-bold hover:bg-primary-50 transition-colors"
                      >
                        <Store className="w-4 h-4" /> Partner Dashboard
                      </Link>
                    )}

                    <Link 
                      to="/profile" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-navy hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-400" /> My Profile
                    </Link>
                    <Link 
                      to="/profile" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-navy hover:bg-gray-50 transition-colors"
                    >
                      <Package className="w-4 h-4 text-gray-400" /> Order History
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={() => { logout(); setIsProfileOpen(false); }} 
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-navy font-semibold text-sm hover:text-primary transition-colors px-3 py-2">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm font-bold shadow-md shadow-primary/20">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <button onClick={toggleCart} className="relative p-2 text-navy">
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartItemsCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-navy p-2">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 py-4 px-5 space-y-3">
          <Link to="/" className="block text-navy font-semibold text-base py-1" onClick={() => setIsMenuOpen(false)}>Home</Link>
          {isAuthenticated ? (
            <>
              {isRestaurantPartner && (
                <Link 
                  to="/partner-dashboard" 
                  className="flex items-center gap-2 text-primary font-bold text-base py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Store className="w-4 h-4" /> Partner Dashboard
                </Link>
              )}
              <Link to="/profile" className="block text-navy font-semibold text-base py-1" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
              <Link to="/profile" className="block text-navy font-semibold text-base py-1" onClick={() => setIsMenuOpen(false)}>Profile</Link>
              <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block text-red-600 font-semibold text-base py-1 w-full text-left">Logout</button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" className="block text-navy font-semibold text-base text-center py-2.5 bg-gray-100 rounded-xl" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="block btn-primary text-center py-2.5 rounded-xl font-bold" onClick={() => setIsMenuOpen(false)}>Create Account</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
