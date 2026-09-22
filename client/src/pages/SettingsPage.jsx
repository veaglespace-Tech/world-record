import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, setCredentials, selectCurrentToken } from '../store/slices/authSlice';
import { useUpdateSettingsMutation } from '../store/api/apiSlice';
import { HiOutlineCog, HiOutlineUser, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineMail, HiOutlineShieldCheck, HiOutlineCheckCircle } from 'react-icons/hi';

export default function SettingsPage() {
  const admin = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const dispatch = useDispatch();
  
  const [updateSettings, { isLoading }] = useUpdateSettingsMutation();

  const [name, setName] = useState(admin?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword && !currentPassword) {
      setMessage({ type: 'error', text: 'Please enter your current password.' });
      return;
    }

    try {
      const payload = { name };
      if (currentPassword && newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await updateSettings(payload).unwrap();
      
      // Update Redux state with new admin details
      dispatch(setCredentials({ admin: res.admin, token }));
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.data?.error || 'Failed to update settings.',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="card bg-base-100/95 backdrop-blur-md shadow-2xl border border-base-content/5">
        <div className="card-body px-6 pt-6 pb-6 md:px-8 md:pt-8 md:pb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-warning to-amber-500 flex items-center justify-center shadow-lg shadow-warning/25">
              <HiOutlineCog className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-1">
                Settings
              </h2>
              <p className="text-sm text-base-content/50">
                Manage your profile and security settings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} text-sm shadow-sm`}>
          <HiOutlineCheckCircle className="w-5 h-5" />
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Section */}
        <div className="card bg-base-100 border border-base-content/5 shadow-sm">
          <div className="card-body">
            <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2 mb-5 pb-3 border-b border-base-200">
              <HiOutlineUser className="w-5 h-5 text-primary" />
              Profile Information
            </h3>
            
            <div className="space-y-4">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Full Name</span>
                </label>
                <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full">
                  <HiOutlineUser className="w-5 h-5 text-base-content/40" />
                  <input
                    type="text"
                    className="grow bg-transparent outline-none"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Email Address</span>
                </label>
                <label className="input input-bordered flex items-center gap-3 shadow-sm bg-base-200/50 border-base-content/10 w-full cursor-not-allowed opacity-70">
                  <HiOutlineMail className="w-5 h-5 text-base-content/40" />
                  <input
                    type="email"
                    className="grow bg-transparent outline-none cursor-not-allowed"
                    value={admin?.email || ''}
                    disabled
                  />
                </label>
                <label className="label py-1">
                  <span className="label-text-alt text-base-content/40 italic text-xs">Email cannot be changed</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="card bg-base-100 border border-base-content/5 shadow-sm">
          <div className="card-body">
            <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2 mb-5 pb-3 border-b border-base-200">
              <HiOutlineShieldCheck className="w-5 h-5 text-warning" />
              Change Password
            </h3>
            
            <div className="space-y-4">
              {/* Current Password */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Current Password</span>
                </label>
                <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full relative">
                  <HiOutlineLockClosed className="w-5 h-5 text-base-content/40" />
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    className="grow pr-10 bg-transparent outline-none"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
                    className="absolute right-3 text-base-content/40 hover:text-base-content transition-colors"
                  >
                    {showPasswords.current ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                  </button>
                </label>
              </div>

              {/* New Password */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">New Password</span>
                </label>
                <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full relative">
                  <HiOutlineLockClosed className="w-5 h-5 text-base-content/40" />
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    className="grow pr-10 bg-transparent outline-none"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                    className="absolute right-3 text-base-content/40 hover:text-base-content transition-colors"
                  >
                    {showPasswords.new ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                  </button>
                </label>
              </div>

              {/* Confirm Password */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Confirm New Password</span>
                </label>
                <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full relative">
                  <HiOutlineLockClosed className="w-5 h-5 text-base-content/40" />
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    className="grow pr-10 bg-transparent outline-none"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                    className="absolute right-3 text-base-content/40 hover:text-base-content transition-colors"
                  >
                    {showPasswords.confirm ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                  </button>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary text-primary-content shadow-md shadow-primary/20 w-full sm:w-auto px-8"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            'Save Changes'
          )}
        </button>
      </form>
    </div>
  );
}
