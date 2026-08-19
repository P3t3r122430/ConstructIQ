import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Project, 
  QuoteRequest, 
  ContactMessage, 
  Service, 
  Profile 
} from '../../types/database';
import { 
  Building2, 
  FileSpreadsheet, 
  Mail, 
  Wrench, 
  Users, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Database,
  ShieldCheck,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export const AdminDashboardOverviewPage: React.FC = () => {
  const { profile, role, isConfigured } = useAuth();
  const { success, error } = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      dataService.getProjects(),
      dataService.getQuotes(),
      dataService.getContactMessages(),
      dataService.getServices(),
      dataService.getProfiles()
    ]).then(([prjs, qts, msgs, srvs, prfs]) => {
      setProjects(prjs);
      setQuotes(qts);
      setMessages(msgs);
      setServices(srvs);
      setCustomers(prfs);
      setLoading(false);
    });
  }, []);

  const handleUpdateQuoteStatus = async (quoteId: string, newStatus: QuoteRequest['status']) => {
    try {
      const updated = await dataService.updateQuote(quoteId, { status: newStatus });
      if (updated) {
        setQuotes(quotes.map(q => q.id === quoteId ? updated : q));
        success('Quote Status Updated', `Quote #${quoteId.slice(0, 6)} updated to ${newStatus}`);
      }
    } catch (err: unknown) {
      error('Failed to update quote', err instanceof Error ? err.message : 'Error');
    }
  };

  const handleMarkMessageRead = async (messageId: string) => {
    try {
      const updated = await dataService.updateContactMessage(messageId, 'read');
      if (updated) {
        setMessages(messages.map(m => m.id === messageId ? updated : m));
        success('Message Updated', 'Marked as read');
      }
    } catch (err: unknown) {
      error('Failed to update message', err instanceof Error ? err.message : 'Error');
    }
  };

  const pendingQuotes = quotes.filter(q => q.status === 'New' || q.status === 'Reviewing');
  const unreadMessages = messages.filter(m => m.status === 'unread');
  const activeProjects = projects.filter(p => p.status === 'In Progress');

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl w-full mx-auto">
      {/* Top Header & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className={`text-xs font-bold uppercase tracking-widest block mb-1 ${role === 'admin' ? 'text-amber-500' : 'text-sky-400'}`}>
            {role === 'admin' ? 'Executive Governance & Enterprise Control' : 'Site Operations & Field Engineering'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {role === 'admin' ? 'Executive Management Console' : 'Site Operations Dashboard'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <span className="text-white font-semibold">{profile?.full_name}</span> ({role === 'admin' ? 'EXECUTIVE ADMIN' : 'SITE MANAGER'})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/projects"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Landmark Project
          </Link>
          <Link
            to="/admin/quotes"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-400" /> Review Estimates ({pendingQuotes.length})
          </Link>
        </div>
      </div>

      {/* Connection & Security Diagnostics Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
            isConfigured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
          }`}>
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-white">
                {isConfigured ? 'Connected to Live Supabase Engine' : 'Running on Resilient Local Mock Storage'}
              </p>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-950 border border-slate-800 text-slate-300">
                PostgreSQL RLS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isConfigured 
                ? 'Direct high-speed connection to cloud database, storage buckets, and auth policies.'
                : 'Development preview active. You can execute full CRUD operations and export SQL migrations.'}
            </p>
          </div>
        </div>

        {role === 'admin' ? (
          <Link
            to="/admin/settings"
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-400 rounded-lg text-xs font-semibold shrink-0 transition-colors"
          >
            View SQL & Connection Config
          </Link>
        ) : (
          <Link
            to="/admin/projects"
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-sky-400 rounded-lg text-xs font-semibold shrink-0 transition-colors"
          >
            Manage Active Site Projects
          </Link>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Projects</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{projects.length}</p>
          <p className="text-xs text-emerald-400 mt-1 font-semibold">
            {activeProjects.length} Currently under physical construction
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tender Pipeline</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{quotes.length}</p>
          <p className="text-xs text-amber-400 mt-1 font-semibold">
            {pendingQuotes.length} Quotes awaiting quantity survey
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Client Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{messages.length}</p>
          <p className="text-xs text-purple-400 mt-1 font-semibold">
            {unreadMessages.length} Unread corporate inquiries
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Accounts</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{customers.length}</p>
          <p className="text-xs text-slate-400 mt-1">Clients, PMs, and Executives</p>
        </div>
      </div>

      {/* Grid: Quotes Pipeline & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quotes Pipeline (Col 1-7) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Pending Quotation Requests</h2>
              <p className="text-xs text-slate-400">Incoming civil & commercial project tender requests</p>
            </div>
            <Link
              to="/admin/quotes"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              All Quotes ({quotes.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {quotes.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">No quotation requests yet.</div>
          ) : (
            <div className="space-y-3">
              {quotes.slice(0, 5).map((q) => (
                <div
                  key={q.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{q.name}</span>
                      {q.company && <span className="text-xs text-slate-400">({q.company})</span>}
                    </div>
                    <p className="text-xs text-amber-400 font-medium truncate max-w-sm">
                      {q.project_type} • {q.location}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Budget: {q.budget} • Logged: {new Date(q.created_at).toLocaleDateString('en-GB')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={q.status}
                      onChange={(e) => handleUpdateQuoteStatus(q.id, e.target.value as QuoteRequest['status'])}
                      className="bg-slate-900 border border-slate-800 text-xs font-semibold text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
                    >
                      <option value="New">New</option>
                      <option value="Reviewing">Reviewing</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                      <option value="Quotation Sent">Quotation Sent</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <Link
                      to={`/admin/quotes?id=${q.id}`}
                      className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
                      title="Open full BOQ record"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inquiries (Col 8-12) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Contact Messages</h2>
              <p className="text-xs text-slate-400">Direct inquiries from Nairobi HQ portal</p>
            </div>
            <Link
              to="/admin/messages"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Inbox ({messages.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">No contact messages yet.</div>
          ) : (
            <div className="space-y-3">
              {messages.slice(0, 5).map((m) => (
                <div
                  key={m.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white truncate">{m.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        m.status === 'unread'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-semibold truncate">{m.subject}</p>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{m.message}</p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{m.email}</span>
                    {m.status === 'unread' && (
                      <button
                        type="button"
                        onClick={() => handleMarkMessageRead(m.id)}
                        className="text-amber-400 hover:underline font-semibold"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
