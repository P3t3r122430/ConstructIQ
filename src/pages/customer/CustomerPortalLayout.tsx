import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HardHat, 
  FileSpreadsheet, 
  Mail, 
  User, 
  LogOut, 
  PlusCircle, 
  ExternalLink,
  LayoutDashboard,
  Shield,
  ArrowLeft
} from 'lucide-react';

export const CustomerPortalLayout: React.FC = () => {
  const { profile, isStaff, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard Overview', path: '/account', icon: LayoutDashboard, exact: true },
    { name: 'My Quote Requests', path: '/account/quotes', icon: FileSpreadsheet },
    { name: 'My Inquiries & Messages', path: '/account/messages', icon: Mail },
    { name: 'Profile & Security', path: '/account/profile', icon: User },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-amber-400 hover:text-amber-300 text-xs font-bold transition-all"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Website</span>
            </Link>

            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                <HardHat className="w-5 h-5" />
              </div>
              <span className="font-black text-white text-base tracking-tight hidden md:inline">
                APEX<span className="text-amber-500">BUILD</span> CLIENT PORTAL
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {isStaff && (
              <Link
                to="/admin"
                className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Go to Admin Management Console"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Staff Console</span>
              </Link>
            )}

            <Link
              to="/request-quote"
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Quote Request</span>
            </Link>

            <div className="h-5 w-px bg-slate-800" />

            <Link
              to="/account/profile"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity p-1 rounded-lg"
              title="View Profile & Security Settings"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">
                {profile?.full_name?.charAt(0) || 'C'}
              </div>
              <span className="text-xs font-semibold text-white hidden sm:inline max-w-[120px] truncate">
                {profile?.full_name || 'Client'}
              </span>
            </Link>

            <button
              type="button"
              onClick={async () => {
                await signOut();
                navigate('/');
              }}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center border-t border-slate-800 px-4 py-2 gap-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                  active
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
