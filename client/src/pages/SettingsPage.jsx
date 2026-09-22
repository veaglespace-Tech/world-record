import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, setCredentials, selectCurrentToken } from '../store/slices/authSlice';
import { useUpdateSettingsMutation } from '../store/api/apiSlice';
import { HiOutlineCog, HiOutlineUser, HiOutlineLockClosed } from 'react-icons/hi';

export default function SettingsPage() {
  const admin = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const dispatch = useDispatch();
  
  const [updateSettings, { isLoading }] = useUpdateSettingsMutation();

  const [name, setName] = useState(admin?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <HiOutlineCog className="w-5 h-5 text-warning" />
          </div>
          Settings
        </h2>
        <p className="text-base-content/60 mt-2 ml-13">
          Manage your profile and security settings.
        </p>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} text-sm`}>
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Section */}
        <div className="card bg-base-100 border border-base-content/5 shadow-sm">
          <div className="card-body">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <HiOutlineUser className="w-5 h-5" />
              Profile Information
            </h3>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered focus:input-primary"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-control mt-3">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                value={admin?.email || ''}
                disabled
              />
              <label className="label">
                <span className="label-text-alt text-base-content/40">Email cannot be changed</span>
              </label>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="card bg-base-100 border border-base-content/5 shadow-sm">
          <div className="card-body">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <HiOutlineLockClosed className="w-5 h-5" />
              Change Password
            </h3>
            <div className="space-y-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Current Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered focus:input-primary"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">New Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered focus:input-primary"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Confirm New Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered focus:input-primary"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
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
