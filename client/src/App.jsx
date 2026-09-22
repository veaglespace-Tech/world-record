import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLazyGetMeQuery } from './store/api/apiSlice';
import { setCredentials, selectCurrentToken } from './store/slices/authSlice';

import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ReferralPage from './pages/ReferralPage';
import AllUsersPage from './pages/AllUsersPage';
import AllPathakPage from './pages/AllPathakPage';
import SettingsPage from './pages/SettingsPage';
import UserRegistrationPage from './pages/UserRegistrationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function AppInit({ children }) {
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);
  const [triggerGetMe, { isLoading }] = useLazyGetMeQuery();

  useEffect(() => {
    if (token) {
      triggerGetMe().unwrap().then((admin) => {
        dispatch(setCredentials({ admin, token }));
      }).catch(() => {
        // Token invalid or error
        localStorage.removeItem('token');
      });
    }
  }, [token, dispatch, triggerGetMe]);

  if (token && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return children;
}

function App() {
  return (
    <Router>
      <AppInit>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/register/:referralCode" element={<UserRegistrationPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          >
            <Route path="referral" element={<ReferralPage />} />
            <Route path="users" element={<AllUsersPage />} />
            <Route path="pathak" element={<AllPathakPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppInit>
    </Router>
  );
}

export default App;
