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
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col h-screen overflow-hidden">
        {/* Mobile Navbar */}
        <div className="w-full navbar bg-base-300 lg:hidden border-b border-base-content/10 shadow-sm sticky top-0 z-40">
          <div className="flex-none">
            <label htmlFor="dashboard-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 font-bold text-lg flex items-center gap-2">
            <span>🌍</span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent truncate">
              Guinness World Records
            </span>
          </div>
        </div>
        
        <main className="flex-1 flex flex-col p-4 md:p-8 overflow-auto">
          <div className="flex-1">
            {isHome ? <DashboardHome /> : <Outlet />}
          </div>
          
          {/* Dashboard Footer */}
          <footer className="mt-8 pt-4 border-t border-base-content/10 text-center text-xs sm:text-sm text-base-content/60">
            <p>
              Designed & Developed by <a href="https://veaglespace.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Veagle Space Technology Pvt. Ltd.</a>
              <span className="hidden sm:inline px-2">|</span>
              <span className="block sm:inline mt-1 sm:mt-0">© 2026 All Rights Reserved.</span>
            </p>
          </footer>
        </main>
      </div> 
      
      <div className="drawer-side z-[99]">
        <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label> 
        <Sidebar />
      </div>
    </div>
  );
}
