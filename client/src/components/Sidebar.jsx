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
    { to: '/dashboard/pataks', icon: HiOutlineOfficeBuilding, label: 'All Pathaks' },
    { to: '/dashboard/settings', icon: HiOutlineCog, label: 'Settings' },
  ];

  return (
    <div className="w-72 h-full bg-base-300 flex flex-col border-r border-base-content/10">
      {/* Brand */}
      <div className="p-6 border-b border-base-content/10">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span>🌍</span>
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
            Guinness Book of World Record
          </span>
        </h1>
        <p className="text-xs text-base-content/50 mt-1">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            onClick={closeDrawer}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-content shadow-lg shadow-primary/25'
                  : 'text-base-content/70 hover:bg-base-content/5 hover:text-base-content'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Admin Profile & Logout */}
      <div className="p-4 border-t border-base-content/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-10 h-10">
              <span className="text-lg font-bold">
                {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{admin?.name || 'Admin'}</p>
            <p className="text-xs text-base-content/50 truncate">{admin?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-ghost btn-sm w-full justify-start gap-2 text-error hover:bg-error/10"
        >
          <HiOutlineLogout className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
