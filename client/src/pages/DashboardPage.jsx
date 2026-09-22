import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/slices/authSlice';
import { useGetUsersQuery, useGetPataksQuery } from '../store/api/apiSlice';
import { HiOutlineUsers, HiOutlineOfficeBuilding, HiOutlineLink } from 'react-icons/hi';

function DashboardHome() {
  const admin = useSelector(selectCurrentUser);
  const { data: users = [], isLoading: loadingUsers } = useGetUsersQuery();
  const { data: pataks = [], isLoading: loadingPataks } = useGetPataksQuery();

  const loading = loadingUsers || loadingPataks;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-8 border border-primary/10">
        <h2 className="text-3xl font-bold">
          Welcome back, <span className="text-primary">{admin?.name || 'Admin'}</span> 👋
        </h2>
        <p className="text-base-content/60 mt-2">Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 border border-base-content/5 shadow-sm hover:shadow-md transition-shadow">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/50 font-medium">Total Users</p>
                <p className="text-3xl font-bold mt-1">
                  {loading ? <span className="loading loading-spinner loading-sm"></span> : users.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                <HiOutlineUsers className="w-6 h-6 text-info" />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-content/5 shadow-sm hover:shadow-md transition-shadow">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/50 font-medium">Total Pataks</p>
                <p className="text-3xl font-bold mt-1">
                  {loading ? <span className="loading loading-spinner loading-sm"></span> : pataks.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <HiOutlineOfficeBuilding className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-content/5 shadow-sm hover:shadow-md transition-shadow">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/50 font-medium">Referral Code</p>
                <p className="text-lg font-mono font-bold mt-1 text-primary">
                  {admin?.referralCode || '...'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <HiOutlineLink className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const location = useLocation();
  const isHome = location.pathname === '/dashboard';

  return (
    <div className="flex min-h-screen bg-base-200">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        {isHome ? <DashboardHome /> : <Outlet />}
      </main>
    </div>
  );
}
