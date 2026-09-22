import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useResetPasswordMutation } from '../store/api/apiSlice';
import { HiOutlineLockClosed, HiOutlineGlobe, HiOutlineArrowLeft } from 'react-icons/hi';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (newPassword.length < 6) {
      return setMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
    }

    if (newPassword !== confirmPassword) {
      return setMsg({ type: 'error', text: 'Passwords do not match.' });
    }

    try {
      const res = await resetPassword({ token, newPassword }).unwrap();
      setMsg({ type: 'success', text: res.message });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setMsg({ type: 'error', text: err.data?.error || 'Failed to reset password. The link might be invalid or expired.' });
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

      <div className="card bg-base-100/95 backdrop-blur-md shadow-2xl border border-base-content/5 w-full max-w-md mx-auto z-10">
        <div className="card-body px-6 pt-6 pb-6 md:px-8 md:pt-8 md:pb-8">
          
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-base-content/50 hover:text-primary transition-colors mb-4 w-fit">
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back to login
          </Link>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4 shadow-lg shadow-primary/25">
              <HiOutlineGlobe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Reset Password
            </h1>
            <p className="text-base-content/60 text-sm mt-2">
              Enter your new password below.
            </p>
          </div>

          {msg.text && (
            <div className={`alert ${msg.type === 'error' ? 'alert-error' : 'alert-success text-white'} mb-4 text-sm`}>
              <span>{msg.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">New Password</span>
              </label>
              <label className="input input-bordered w-full flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 relative">
                <HiOutlineLockClosed className="w-5 h-5 text-base-content/40" />
                <input
                  type="password"
                  className="grow"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Confirm Password</span>
              </label>
              <label className="input input-bordered w-full flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 relative">
                <HiOutlineLockClosed className="w-5 h-5 text-base-content/40" />
                <input
                  type="password"
                  className="grow"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full shadow-lg shadow-primary/30 mt-4"
              disabled={isLoading || msg.type === 'success'}
            >
              {isLoading ? <span className="loading loading-spinner"></span> : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
