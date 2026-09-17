import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';
import Spinner from '../../components/common/Spinner';
import OtpModal from '../../components/auth/OtpModal';
import { authService } from '../../services/authService';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  // OTP modal state (for unverified accounts)
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login({ email: form.email, password: form.password });
      const data = res.data;

      if (data.otpRequired) {
        // Unverified account — OTP was sent, show OTP modal
        toast('Please verify your email with the OTP sent.', { icon: '📧' });
        setOtpOpen(true);
      } else {
        // Fully verified — JWT returned directly
        setAuth(
          { id: data.id, name: data.name, email: data.email, role: data.role },
          data.token
        );
        toast.success(`Welcome back, ${data.name || 'there'}! 👋`);
        if (data.role === 'RESTAURANT') {
          navigate('/partner-dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid email or password.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLoginOtp = async (otp) => {
    setOtpLoading(true);
    setOtpError('');
    try {
      const res = await authService.verifyLoginOtp({ email: form.email, otp });
      const data = res.data?.data || res.data;
      setAuth(
        { id: data.id, name: data.name, email: data.email, role: data.role },
        data.token
      );
      setOtpOpen(false);
      toast.success(`Welcome back, ${data.name || 'there'}! 👋`);
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

  const handleResendLoginOtp = async () => {
    try {
      await authService.resendOtp({ email: form.email, purpose: 'LOGIN' });
      toast.success('A new OTP has been sent to your email.');
      setOtpError('');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to resend OTP. Please wait and try again.';
      toast.error(msg);
    }
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF4500] to-[#902700]"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
          <div className="relative z-10 p-12 flex flex-col justify-end h-full text-white pb-24">
            <h2 className="text-5xl font-extrabold mb-4">Delicious food,<br/>delivered fast.</h2>
            <p className="text-xl text-primary-100 max-w-md">Join thousands of foodies who use FoodRush daily to satisfy their cravings.</p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="max-w-md w-full">
            <div className="text-center mb-10">
              <Link to="/" className="inline-flex items-center gap-2 mb-8">
                <span className="text-3xl">🍔</span>
                <span className="font-bold text-2xl text-primary">FoodRush</span>
              </Link>
              <h1 className="text-3xl font-bold text-navy mb-2">Welcome back 👋</h1>
              <p className="text-gray-500">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="input-field"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    className="input-field pr-12"
                    placeholder="••••••••"
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
                <div className="flex justify-end mt-2">
                  <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full h-12 flex justify-center items-center text-lg mt-8"
              >
                {loading ? <Spinner size="sm" /> : 'Sign In'}
              </button>
            </form>

            <p className="text-center mt-8 text-gray-600">
              Don't have an account? <Link to="/register" className="font-bold text-primary hover:underline">Register now</Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* OTP Modal — shown when account is unverified */}
      <OtpModal
        isOpen={otpOpen}
        onClose={() => setOtpOpen(false)}
        onVerify={handleVerifyLoginOtp}
        email={form.email}
        purpose="LOGIN"
        isLoading={otpLoading}
        error={otpError}
        onResend={handleResendLoginOtp}
      />
    </>
  );
};

export default Login;
