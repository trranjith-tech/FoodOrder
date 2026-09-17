import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Package, LogOut } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { userService } from '../services/userService';

const Profile = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('orders');

  const tabs = [
    { id: 'orders', label: 'Order History', icon: Package },
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'addresses', label: 'My Addresses', icon: MapPin },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12"
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4 text-center">
            <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg shadow-primary/30">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <h2 className="font-bold text-navy text-xl line-clamp-1">{user?.name || 'User Name'}</h2>
            <p className="text-gray-500 text-sm">{user?.email || 'user@example.com'}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors font-medium border-l-4 ${
                  activeTab === tab.id 
                    ? 'bg-primary-50 text-primary border-primary' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border-transparent'
                }`}
              >
                <tab.icon className="w-5 h-5" /> {tab.label}
              </button>
            ))}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-6 py-4 text-left transition-colors font-medium text-red-600 hover:bg-red-50 border-l-4 border-transparent"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold text-navy mb-6">Order History</h2>
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">📦</span>
                  <h3 className="text-lg font-bold text-navy">No orders yet</h3>
                  <p className="text-gray-500 mt-2">When you place an order, it will appear here.</p>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold text-navy mb-6">Profile Information</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" className="input-field" defaultValue={user?.name} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" className="input-field bg-gray-50" defaultValue={user?.email} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="tel" className="input-field" defaultValue={user?.phone || 'Not provided'} readOnly />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-2xl font-bold text-navy mb-6">My Addresses</h2>
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No saved addresses</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
