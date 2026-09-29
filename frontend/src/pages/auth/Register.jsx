import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UtensilsCrossed, Store } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';
import Spinner from '../../components/common/Spinner';
import OtpModal from '../../components/auth/OtpModal';
import { authService } from '../../services/authService';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  // OTP modal state
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(-10);
      setForm((prev) => ({ ...prev, phone: digitsOnly }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'password') setPassword(value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: role,
      });
      toast.success('OTP sent to your email! Please verify.');
      setOtpOpen(true);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp) => {
    setOtpLoading(true);
    setOtpError('');
    try {
      const res = await authService.verifyRegistrationOtp({ email: form.email, otp });
      const data = res.data?.data || res.data;
      setAuth(
        { id: data.id, name: data.name, email: data.email, role: data.role },
        data.token
      );
      setOtpOpen(false);
      toast.success(
        data.role === 'RESTAURANT'
          ? 'Restaurant Partner Account verified! Welcome aboard 🏪'
          : 'Account verified! Welcome to FoodRush 🍔'
      );
      if (data.role === 'RESTAURANT') {
        navigate('/partner-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid OTP. Please try again.';
      setOtpError(msg);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await authService.resendOtp({ email: form.email, purpose: 'REGISTER' });
      toast.success('A new OTP has been sent to your email.');
      setOtpError('');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to resend OTP. Please wait and try again.';
      toast.error(msg);
    }
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 33;
    if (password.length < 10) return 66;
    return 100;
  };

  const strength = getPasswordStrength();
  const strengthColor = strength === 33 ? 'bg-red-500' : strength === 66 ? 'bg-yellow-500' : strength === 100 ? 'bg-green-500' : 'bg-gray-200';

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex bg-gray-50/50">
        {/* Left Hero side */}
        <div className="hidden lg:flex lg:w-1/2 bg-navy relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-navy/95 to-slate-900"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
          <div className="relative z-10 p-12 flex flex-col justify-center h-full text-white max-w-lg mx-auto">
            <span className="text-4xl mb-4">🍔</span>
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">
              {role === 'RESTAURANT' ? 'Grow your food business with FoodRush Partner.' : 'Discover the best food from top restaurants.'}
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              {role === 'RESTAURANT'
                ? 'Join thousands of restaurants reaching hungry customers every day. Upload menus, manage live orders, and track deliveries seamlessly.'
                : 'Fast delivery in under 30 minutes, real-time OTP security, and delicious local food right at your doorstep.'}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="backdrop-blur-md bg-white/10 p-4 rounded-xl border border-white/10">
                <div className="font-bold text-xl text-primary-300 mb-1">30 Mins</div>
                <div className="text-gray-400">Average Delivery Time</div>
              </div>
              <div className="backdrop-blur-md bg-white/10 p-4 rounded-xl border border-white/10">
                <div className="font-bold text-xl text-primary-300 mb-1">100% Verified</div>
                <div className="text-gray-400">Secure OTP Protection</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form side */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
          <div className="max-w-md w-full py-8">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
                <span className="text-3xl group-hover:scale-110 transition-transform">🍔</span>
                <span className="font-extrabold text-2xl text-primary tracking-tight">FoodRush</span>
              </Link>
              <h1 className="text-3xl font-extrabold text-navy mb-2">Create an account</h1>
              <p className="text-gray-500 text-sm">Choose your account type and get started in seconds.</p>
            </div>

            {/* Role Switcher Glassmorphism Tabs */}
            <div className="grid grid-cols-2 gap-3 mb-6 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200">
              <button
                type="button"
                onClick={() => setRole('USER')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  role === 'USER'
                    ? 'bg-white text-primary shadow-md shadow-gray-200 border border-primary/20 scale-[1.02]'
                    : 'text-gray-600 hover:text-navy hover:bg-white/50'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Customer</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('RESTAURANT')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  role === 'RESTAURANT'
                    ? 'bg-white text-primary shadow-md shadow-gray-200 border border-primary/20 scale-[1.02]'
                    : 'text-gray-600 hover:text-navy hover:bg-white/50'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Restaurant Partner</span>
              </button>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  {role === 'RESTAURANT' ? 'Restaurant Manager / Owner Name' : 'Full Name'}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="input-field"
                  placeholder={role === 'RESTAURANT' ? 'Restaurant Manager / Owner Name' : 'Enter your full name'}
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="input-field"
                  placeholder={role === 'RESTAURANT' ? 'partner@restaurant.com' : 'user@gmail.com'}
                  value={form.email}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-400 mt-1">We will send a 6-digit OTP code to verify this email.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1">Mobile Phone (10 digits)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-gray-500 font-semibold text-sm select-none pointer-events-none">+91</span>
                  <input
                    type="tel"
                    name="phone"
                    required
                    maxLength="10"
                    pattern="[0-9]{10}"
                    className="input-field pl-12"
                    placeholder="91234 56789"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Enter 10-digit mobile number</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    className="input-field pr-12"
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2 flex gap-1 h-1.5">
                    <div className={`flex-1 rounded-full ${strength >= 33 ? strengthColor : 'bg-gray-200'}`}></div>
                    <div className={`flex-1 rounded-full ${strength >= 66 ? strengthColor : 'bg-gray-200'}`}></div>
                    <div className={`flex-1 rounded-full ${strength >= 100 ? strengthColor : 'bg-gray-200'}`}></div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || password.length < 8}
                className="btn-primary w-full h-12 flex justify-center items-center text-lg mt-6 shadow-primary hover:shadow-xl transition-all"
              >
                {loading ? <Spinner size="sm" /> : role === 'RESTAURANT' ? 'Register Restaurant Account' : 'Create Customer Account'}
              </button>
            </form>

            <p className="text-center mt-6 text-gray-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* OTP Modal */}
      <OtpModal
        isOpen={otpOpen}
        onClose={() => setOtpOpen(false)}
        onVerify={handleVerifyOtp}
        email={form.email}
        purpose="REGISTER"
        isLoading={otpLoading}
        error={otpError}
        onResend={handleResendOtp}
      />
    </>
  );
};

export default Register;
