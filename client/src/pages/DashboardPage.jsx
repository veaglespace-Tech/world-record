import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/slices/authSlice';
import { useGetUsersQuery, useGetPathakListQuery, useGetReferralLinkQuery } from '../store/api/apiSlice';
import { HiOutlineUsers, HiOutlineOfficeBuilding, HiOutlineLink } from 'react-icons/hi';

function DashboardHome() {
  const admin = useSelector(selectCurrentUser);
  const { data: users = [], isLoading: loadingUsers } = useGetUsersQuery();
  const { data: pathakData = {}, isLoading: loadingPathak } = useGetPathakListQuery({ page: 1, limit: 10 });
  const pathakList = pathakData.data || [];
  const totalPathak = pathakData.total || 0;
  const { data: referralData } = useGetReferralLinkQuery();
  const loading = loadingUsers || loadingPathak;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="card relative overflow-hidden bg-white shadow-sm border border-base-content/5 rounded-3xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="card-body px-6 pt-8 pb-8 md:px-10 md:pt-10 md:pb-10 relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight pb-1">
            Welcome back, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{admin?.name || 'Admin'}</span> 👋
          </h2>
          <p className="text-sm md:text-base text-base-content/60 mt-2 font-medium">Here's what's happening with your platform today.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-white shadow-sm border border-base-content/5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 rounded-3xl">
          <div className="card-body p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/50 font-bold uppercase tracking-wider">Total Users</p>
                <p className="text-4xl font-extrabold mt-2 text-base-content">
                  {loading ? <span className="loading loading-spinner loading-md text-info"></span> : users.length}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-info/10 to-info/5 flex items-center justify-center border border-info/10 shadow-inner">
                <HiOutlineUsers className="w-7 h-7 text-info" />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-sm border border-base-content/5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 rounded-3xl">
          <div className="card-body p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/50 font-bold uppercase tracking-wider">Total Pathak</p>
                <p className="text-4xl font-extrabold mt-2 text-base-content">
                  {loading ? <span className="loading loading-spinner loading-md text-success"></span> : totalPathak}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success/10 to-success/5 flex items-center justify-center border border-success/10 shadow-inner">
                <HiOutlineOfficeBuilding className="w-7 h-7 text-success" />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-sm border border-base-content/5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 rounded-3xl">
          <div className="card-body p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/50 font-bold uppercase tracking-wider">Referral Code</p>
                <p className="text-2xl font-bold mt-2 font-mono bg-primary/5 text-primary px-3 py-1 rounded-xl inline-block border border-primary/10">
                  {referralData?.referralCode || admin?.referralCode || '—'}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/10 shadow-inner">
                <HiOutlineLink className="w-7 h-7 text-primary" />
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
    <div className="drawer lg:drawer-open min-h-screen bg-[#f8fafc]">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col h-screen overflow-hidden">
        {/* Mobile Navbar */}
        <div className="w-full navbar bg-white/80 backdrop-blur-md lg:hidden border-b border-base-content/5 shadow-sm sticky top-0 z-40">
          <div className="flex-none">
            <label htmlFor="dashboard-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 font-bold text-lg flex items-center gap-2">
            <span>🌍</span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent whitespace-normal leading-tight">
              Guinness Book of World Record
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
