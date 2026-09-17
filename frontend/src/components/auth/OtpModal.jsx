import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Spinner from '../common/Spinner';

const OtpModal = ({ isOpen, onClose, onVerify, email, purpose, isLoading, error, onResend }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setTimeLeft(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (timeLeft > 0 && isOpen) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isOpen]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    if (pastedData.length < 6) {
      inputRefs.current[pastedData.length].focus();
    } else {
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      onVerify(otpValue);
    }
  };

  const handleResend = () => {
    if (timeLeft === 0) {
      setTimeLeft(60);
      if (onResend) onResend();
    }
  };

  const getTitle = () => {
    switch (purpose) {
      case 'REGISTER': return 'Verify your email';
      case 'LOGIN': return 'Verify your login';
      case 'ORDER': return 'Confirm your order';
      case 'FORGOT_PASSWORD': return 'Reset password';
      default: return 'Enter OTP';
    }
  };

  const getIcon = () => {
    if (purpose === 'ORDER') return '🍔';
    return '✉️';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-navy transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="text-4xl mb-2">{getIcon()}</div>
            <h2 className="text-2xl font-bold text-navy mb-2">{getTitle()}</h2>
            <p className="text-gray-500 text-sm">
              Enter the 6-digit code sent to <br /><span className="font-medium text-navy">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <motion.div 
              className="flex justify-center gap-2 sm:gap-3 mb-6"
              animate={error ? 'shake' : ''}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="number"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-10 sm:w-12 h-12 sm:h-14 text-center text-xl font-bold rounded-lg border-2 focus:outline-none transition-colors
                    ${error ? 'border-red-500 text-red-500' : 'border-gray-200 focus:border-primary text-navy'}
                  `}
                />
              ))}
            </motion.div>

            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

            <button
              type="submit"
              disabled={otp.join('').length < 6 || isLoading}
              className="btn-primary w-full flex justify-center items-center h-12 mb-4"
            >
              {isLoading ? <Spinner size="sm" /> : 'Verify OTP'}
            </button>

            <div className="text-center text-sm text-gray-500">
              {timeLeft > 0 ? (
                <span>Resend in {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-primary font-medium hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OtpModal;
