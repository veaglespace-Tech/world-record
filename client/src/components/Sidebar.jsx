import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logout } from '../store/slices/authSlice';
import { apiSlice } from '../store/api/apiSlice';
import {
  HiOutlineLink,
  HiOutlineUsers,
  HiOutlineOfficeBuilding,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineHome,
} from 'react-icons/hi';

export default function Sidebar() {
  const admin = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(apiSlice.util.resetApiState()); // Clear RTK Query cache
    navigate('/login');
  };

  const closeDrawer = () => {
    const drawer = document.getElementById('dashboard-drawer');
    if (drawer) drawer.checked = false;
  };

  const navItems = [
    { to: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { to: '/dashboard/referral', icon: HiOutlineLink, label: 'My Referral Link' },
    { to: '/dashboard/users', icon: HiOutlineUsers, label: 'All Users' },
    { to: '/dashboard/pathak', icon: HiOutlineOfficeBuilding, label: 'All Pathak' },
  ];

  return (
    <div className="w-72 h-full bg-base-100/90 backdrop-blur-2xl flex flex-col border-r border-base-content/5 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-50">
      {/* Brand */}
      <div className="p-6 border-b border-base-content/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <h1 className="text-xl font-extrabold flex items-center gap-2 relative z-10">
          <span className="text-2xl drop-shadow-sm">🌍</span>
          <span className="bg-gradient-to-r from-primary via-blue-600 to-secondary bg-clip-text text-transparent leading-tight tracking-tight">
            Guinness Book of World Record
          </span>
        </h1>
        <p className="text-[11px] font-semibold text-base-content/40 mt-1.5 uppercase tracking-widest relative z-10">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            onClick={closeDrawer}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary font-bold shadow-sm border border-primary/20 relative overflow-hidden'
                  : 'text-base-content/60 hover:bg-base-content/5 hover:text-base-content font-medium hover:translate-x-1.5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"></div>}
                <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'}`} />
                <span className="tracking-wide">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Admin Profile & Logout */}
      <div className="p-4 border-t border-base-content/5 bg-gradient-to-b from-transparent to-base-200/30">
        <NavLink
          to="/dashboard/settings"
          onClick={closeDrawer}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 mb-3 rounded-2xl transition-all duration-300 group ${
              isActive
                ? 'bg-primary/10 border border-primary/20 shadow-sm'
                : 'bg-base-100 hover:bg-base-200 border border-base-content/5 hover:shadow-md hover:-translate-y-0.5'
            }`
          }
          title="Update Profile"
        >
          <div className="avatar placeholder">
            <div className="bg-gradient-to-br from-primary to-blue-500 text-white rounded-full w-10 h-10 shadow-md ring-2 ring-white group-hover:ring-primary/30 transition-all">
              <span className="text-lg font-bold">
                {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-base-content group-hover:text-primary transition-colors">{admin?.name || 'Admin'}</p>
            <p className="text-[10px] uppercase tracking-wider text-base-content/50 truncate font-semibold mt-0.5">{admin?.email}</p>
          </div>
          <HiOutlineCog className="w-5 h-5 text-base-content/30 ml-auto shrink-0 group-hover:text-primary transition-colors group-hover:rotate-90 duration-500" />
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-error/80 hover:text-error bg-error/5 hover:bg-error/10 border border-transparent hover:border-error/20 transition-all duration-300"
        >
          <HiOutlineLogout className="w-4 h-4" />
          Secure Logout
        </button>
      </div>
    </div>
  );
}
