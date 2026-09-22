import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPasswordMutation } from '../store/api/apiSlice';
import { HiOutlineMail, HiOutlineGlobe, HiOutlineArrowLeft } from 'react-icons/hi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (!email) {
      return setMsg({ type: 'error', text: 'Please enter your email.' });
    }

    try {
      const res = await forgotPassword({ email }).unwrap();
      setMsg({ type: 'success', text: res.message });
      setEmail('');
    } catch (err) {
      setMsg({ type: 'error', text: err.data?.error || 'Failed to send reset link.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-300 via-base-200 to-base-300 p-4">
      {/* Background decoration with Dhol Players */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img 
          src="/dhol-player.jpg" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-[0.03] mix-blend-overlay"
        />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="premium-section w-full max-w-md mx-auto z-10">
        <div className="p-2">
          
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-base-content/50 hover:text-primary transition-colors mb-4 w-fit">
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back to login
          </Link>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4 shadow-lg shadow-primary/25">
              <HiOutlineGlobe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Forgot Password
            </h1>
            <p className="text-base-content/60 text-sm mt-2">
              Enter your registered admin email and we'll send you a link to reset your password.
            </p>
          </div>

          {msg.text && (
            <div className={`alert ${msg.type === 'error' ? 'alert-error' : 'alert-success text-white'} mb-4 text-sm`}>
              <span>{msg.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="premium-label">Email Address</span>
              </label>
              <label className="premium-input-group">
                <HiOutlineMail className="premium-icon" />
                <input
                  type="email"
                  className="premium-input"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full shadow-lg shadow-primary/30 mt-2"
              disabled={isLoading}
            >
              {isLoading ? <span className="loading loading-spinner"></span> : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
