import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { SiteSettings } from '../../types/database';
import { 
  Building2, 
  Phone, 
  Mail, 
  Clock, 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  ShieldCheck, 
  FileText, 
  LogOut, 
  HardHat,
  Layers
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, profile, role, isStaff, signOut } = useAuth();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    dataService.getSettings().then(setSettings);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-[#0A0B0D]/95 backdrop-blur-md border-b border-white/10 transition-all duration-200">
      {/* Top utility bar */}
      <div className="hidden lg:block bg-[#0A0B0D] border-b border-white/10 text-xs text-gray-400 py-2 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-gray-300 font-medium">
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              {settings?.phone || '+254 (0) 20 780 4000'}
            </span>
            <span className="inline-flex items-center gap-1.5 text-gray-300">
              <Mail className="w-3.5 h-3.5 text-amber-500" />
              {settings?.email || 'contracts@apexbuild.co.ke'}
            </span>
            <span className="inline-flex items-center gap-1.5 text-gray-500">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Mon - Fri: 7:30AM - 5:30PM | Nairobi (EAT)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-sm uppercase">
              <ShieldCheck className="w-3 h-3 text-amber-500 inline" />
              NCA 1 Registered Contractor
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className={`flex items-center justify-between transition-all duration-200 ${scrolled ? 'py-3' : 'py-4'}`}>
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-amber-500 rounded-sm flex items-center justify-center font-bold text-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <HardHat className="w-5 h-5 text-black stroke-[2.4]" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tighter uppercase text-white flex items-center gap-1.5">
                APEX<span className="text-amber-500">BUILD</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-gray-400">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors text-xs uppercase tracking-wider font-semibold ${
                  isActive(link.path)
                    ? 'text-white border-b-2 border-amber-500 pb-1 cursor-default'
                    : 'hover:text-white pb-1'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA & User Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/request-quote"
              className="bg-amber-500 text-black text-xs font-bold px-4 py-2 rounded-sm shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all flex items-center gap-2 uppercase tracking-wider"
            >
              <FileText className="w-3.5 h-3.5" />
              Request Quote
            </Link>

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pr-2.5 rounded-sm bg-white/5 border border-white/10 hover:border-white/20 text-white transition-all text-xs"
                >
                  <div className="text-right hidden xl:block">
                    <p className="text-xs font-semibold leading-tight text-white truncate max-w-[120px]">
                      {profile?.full_name || 'Admin Lead'}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                      {role}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center font-bold text-amber-400 text-xs">
                    {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#0F1115] border border-white/10 rounded-md shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="font-bold text-xs text-white truncate">{profile?.full_name || user.email}</p>
                      <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold uppercase rounded-sm bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        {role} Account
                      </span>
                    </div>

                    {isStaff && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-amber-500 hover:bg-white/5 transition-colors font-bold uppercase tracking-wider"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/account"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      Customer Portal
                    </Link>

                    <Link
                      to="/account/quotes"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5 text-gray-400" />
                      My Submitted Quotes
                    </Link>

                    <div className="border-t border-white/10 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={async () => {
                          await signOut();
                          navigate('/');
                        }}
                        className="flex items-center gap-2.5 w-full px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/20 transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-gray-400" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/request-quote"
              className="px-3 py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg"
            >
              Get Quote
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F1115] border-b border-white/10 px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-2.5 rounded-sm text-sm font-bold uppercase tracking-wider ${
                  isActive(link.path)
                    ? 'text-amber-500 bg-white/5 border border-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2">
            <Link
              to="/request-quote"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-amber-500 text-black font-bold rounded-sm text-center text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
            >
              <FileText className="w-4 h-4" />
              Request a Formal Quote
            </Link>

            {user ? (
              <>
                {isStaff && (
                  <Link
                    to="/admin"
                    className="flex items-center justify-center gap-2 w-full py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold rounded-sm text-center text-xs uppercase tracking-wider"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    Admin Management Portal
                  </Link>
                )}
                <Link
                  to="/account"
                  className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 border border-white/10 text-white font-medium rounded-sm text-center text-xs"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  My Customer Account ({role})
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    navigate('/');
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2 text-rose-400 hover:bg-rose-950/20 rounded-sm text-xs"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  className="py-2 bg-white/5 text-white font-bold rounded-sm text-center text-xs uppercase tracking-wider border border-white/10"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="py-2 bg-amber-500 text-black font-bold rounded-sm text-center text-xs uppercase tracking-wider"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
