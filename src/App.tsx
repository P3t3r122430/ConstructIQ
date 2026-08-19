import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import { MainLayout } from './components/layout/MainLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { CustomerPortalLayout } from './pages/customer/CustomerPortalLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { ServiceDetailPage } from './pages/public/ServiceDetailPage';
import { ProjectsPage } from './pages/public/ProjectsPage';
import { ProjectDetailPage } from './pages/public/ProjectDetailPage';
import { RequestQuotePage } from './pages/public/RequestQuotePage';
import { ContactPage } from './pages/public/ContactPage';
import { BlogPage } from './pages/public/BlogPage';
import { BlogDetailPage } from './pages/public/BlogDetailPage';
import { FaqPage } from './pages/public/FaqPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Customer Portal Pages
import { CustomerDashboardPage } from './pages/customer/CustomerDashboardPage';
import { CustomerQuotesPage } from './pages/customer/CustomerQuotesPage';
import { CustomerMessagesPage } from './pages/customer/CustomerMessagesPage';
import { CustomerProfilePage } from './pages/customer/CustomerProfilePage';

// Admin Portal Pages
import { AdminDashboardOverviewPage } from './pages/admin/AdminDashboardOverviewPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminQuotesPage } from './pages/admin/AdminQuotesPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage';
import { AdminTeamPage } from './pages/admin/AdminTeamPage';
import { AdminBlogPage } from './pages/admin/AdminBlogPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Protected Route Guard for Authenticated Users (Clients & Staff)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-500 font-bold text-sm">
        Authenticating session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Admin Route Guard for Staff / Admins (Both Executive Admins & Site Managers)
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isStaff, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-500 font-bold text-sm">
        Verifying security permissions...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isStaff) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            !
          </div>
          <h1 className="text-2xl font-black mb-2 text-white">Access Restricted</h1>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            This management console requires Executive Administrator or Site Manager credentials verified against the database.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/account"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Go to Customer Portal
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-amber-500/20"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Executive Admin Only Route Guard (Restricted from Site Managers)
const ExecutiveAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-500 font-bold text-sm">
        Verifying Executive Administrator permissions...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 bg-slate-900 border border-rose-800/40 rounded-3xl text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center font-bold text-lg">
          !
        </div>
        <h2 className="text-xl font-black text-white">Executive Administrator Authorization Required</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          This system console contains core database schema migrations and company governance settings. Site Managers do not have permissions to modify these records.
        </p>
        <div className="pt-2">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20"
          >
            Return to Site Operations Overview
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// 404 Fallback Page
const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
    <span className="text-6xl font-black text-amber-500 mb-2">404</span>
    <h1 className="text-2xl font-black mb-2">Page Not Found</h1>
    <p className="text-xs text-slate-400 max-w-md mb-6">
      The requested architectural file, project case study, or division route does not exist.
    </p>
    <Link
      to="/"
      className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20"
    >
      Back to ApexBuild Home
    </Link>
  </div>
);

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Layout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:slug" element={<ServiceDetailPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              <Route path="/request-quote" element={<RequestQuotePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/faq" element={<FaqPage />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Customer Portal (Protected) */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <CustomerPortalLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<CustomerDashboardPage />} />
              <Route path="quotes" element={<CustomerQuotesPage />} />
              <Route path="messages" element={<CustomerMessagesPage />} />
              <Route path="profile" element={<CustomerProfilePage />} />
            </Route>

            {/* Admin Dashboard (Protected - Staff Only) */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboardOverviewPage />} />
              <Route path="projects" element={<AdminProjectsPage />} />
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="quotes" element={<AdminQuotesPage />} />
              <Route path="messages" element={<AdminMessagesPage />} />
              <Route path="testimonials" element={<AdminTestimonialsPage />} />
              <Route 
                path="team" 
                element={
                  <ExecutiveAdminRoute>
                    <AdminTeamPage />
                  </ExecutiveAdminRoute>
                } 
              />
              <Route path="blog" element={<AdminBlogPage />} />
              <Route 
                path="customers" 
                element={
                  <ExecutiveAdminRoute>
                    <AdminCustomersPage />
                  </ExecutiveAdminRoute>
                } 
              />
              <Route path="media" element={<AdminMediaPage />} />
              <Route 
                path="settings" 
                element={
                  <ExecutiveAdminRoute>
                    <AdminSettingsPage />
                  </ExecutiveAdminRoute>
                } 
              />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
