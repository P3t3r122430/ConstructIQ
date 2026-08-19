import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { QuoteRequest, ContactMessage } from '../../types/database';
import { 
  FileSpreadsheet, 
  Mail, 
  Building2, 
  PlusCircle, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  DollarSign
} from 'lucide-react';

export const CustomerDashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      dataService.getQuotes(user?.id, profile?.email),
      dataService.getContactMessages(user?.id, profile?.email)
    ]).then(([qList, mList]) => {
      setQuotes(qList);
      setMessages(mList);
      setLoading(false);
    });
  }, [user, profile]);

  const activeQuotesCount = quotes.filter(q =>
    ['New', 'Reviewing', 'Contacted', 'Site Visit Scheduled'].includes(q.status)
  ).length;
  const readyQuotesCount = quotes.filter(q =>
    ['Quotation Sent', 'Approved', 'Completed'].includes(q.status)
  ).length;

  const getStatusBadgeClass = (status: QuoteRequest['status']) => {
    switch (status) {
      case 'New':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'Reviewing':
        return 'bg-blue-950 text-blue-400 border-blue-800';
      case 'Contacted':
        return 'bg-sky-950 text-sky-400 border-sky-800';
      case 'Site Visit Scheduled':
        return 'bg-indigo-950 text-indigo-400 border-indigo-800';
      case 'Quotation Sent':
        return 'bg-purple-950 text-purple-400 border-purple-800';
      case 'Approved':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'Completed':
        return 'bg-teal-950 text-teal-400 border-teal-800';
      case 'Rejected':
        return 'bg-rose-950 text-rose-400 border-rose-800';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-1">
            Client Portal Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome, {profile?.full_name || 'Client'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            {profile?.company_name ? `${profile.company_name} Account` : 'Track your active civil and commercial estimates, submit revisions, and view engineering correspondence.'}
          </p>
        </div>

        <Link
          to="/request-quote"
          className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Request New Project Quote
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">Total Project Quotes</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{quotes.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">{activeQuotesCount} in estimation review</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">Completed Estimates</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{readyQuotesCount}</p>
          <p className="text-[11px] text-emerald-400 mt-1">Ready for contract negotiation</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">Inquiries Logged</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{messages.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Official messages & tenders</p>
        </div>
      </div>

      {/* Recent Quotes Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Project Quotation Requests</h2>
            <p className="text-xs text-slate-400">Latest submissions and status reports from our Quantity Surveying desk</p>
          </div>
          <Link
            to="/account/quotes"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            View All Quotes <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading your project files...</div>
        ) : quotes.length === 0 ? (
          <div className="text-center py-12 bg-slate-950 rounded-xl border border-slate-800/80">
            <FileSpreadsheet className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">No Quotation Requests Found</h3>
            <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
              Submit your project specifications or architectural drawings for itemized preliminary pricing.
            </p>
            <Link
              to="/request-quote"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg"
            >
              Start First Quote Request
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {quotes.slice(0, 5).map((q) => (
              <div
                key={q.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{q.project_type}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeClass(
                        q.status
                      )}`}
                    >
                      {q.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate max-w-md">
                    {q.location} • Budget: {q.budget}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Logged on {new Date(q.created_at).toLocaleDateString('en-GB')} • Ref #{q.id.slice(0, 8)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/account/quotes?id=${q.id}`}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium"
                  >
                    View Details & BOQ
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
