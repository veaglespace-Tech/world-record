import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useResetPasswordMutation } from '../store/api/apiSlice';
import { HiOutlineLockClosed, HiOutlineGlobe, HiOutlineArrowLeft, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    } catch (err) {
      setMsg({ type: 'error', text: err.data?.error || 'Failed to reset password. The link might be invalid or expired.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 relative overflow-hidden">
      {/* Background decoration with Dhol Players */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img 
          src="/dhol-player.jpg" 
          alt="Dhol Player Left" 
          className="absolute object-contain mix-blend-multiply transition-all duration-500 opacity-40 sm:opacity-50 md:opacity-60 lg:opacity-70 w-[55vw] h-auto -left-[10vw] top-[2%] sm:w-[50vw] sm:-left-[15vw] sm:top-[5%] md:w-[45vw] md:-left-[15vw] md:top-[10%] lg:w-auto lg:h-[85vh] lg:-left-[5%] lg:top-[5%]" 
        />
        <img 
          src="/dhol-player.jpg" 
          alt="Dhol Player Right" 
          className="absolute object-contain mix-blend-multiply transform scale-x-[-1] transition-all duration-500 opacity-40 sm:opacity-50 md:opacity-60 lg:opacity-70 w-[55vw] h-auto -right-[10vw] top-[2%] sm:w-[50vw] sm:-right-[15vw] sm:top-[5%] md:w-[45vw] md:-right-[15vw] md:top-[10%] lg:w-auto lg:h-[85vh] lg:-right-[5%] lg:top-[5%]" 
        />
      </div>

      <div className="w-full max-w-md bg-white/70 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/60 rounded-3xl mx-auto z-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="px-6 pt-10 pb-8 sm:px-10 sm:pt-12 sm:pb-10 relative z-10">
          
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
            <div className={`alert ${msg.type === 'error' ? 'alert-error' : 'alert-success text-white'} mb-4 text-sm shadow-sm`}>
              <span>{msg.text}</span>
            </div>
          )}

          {msg.type === 'success' ? (
            <div className="mt-6">
              <Link to="/login" className="btn btn-primary w-full shadow-lg shadow-primary/30 font-bold tracking-wide">
                Go to Login Page
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">New Password</span>
                </label>
                <label className="input input-bordered w-full flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 relative">
                  <HiOutlineLockClosed className="w-5 h-5 text-base-content/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="grow pr-10"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-base-content/40 hover:text-base-content transition-colors"
                  >
                    {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                  </button>
                </label>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Confirm Password</span>
                </label>
                <label className="input input-bordered w-full flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 relative">
                  <HiOutlineLockClosed className="w-5 h-5 text-base-content/40" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="grow pr-10"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-base-content/40 hover:text-base-content transition-colors"
                  >
                    {showConfirmPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                  </button>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full shadow-lg shadow-primary/30 mt-4"
                disabled={isLoading}
              >
                {isLoading ? <span className="loading loading-spinner"></span> : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
