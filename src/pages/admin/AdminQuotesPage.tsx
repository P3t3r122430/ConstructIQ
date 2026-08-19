import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { useToast } from '../../context/ToastContext';
import { QuoteRequest } from '../../types/database';
import { 
  FileSpreadsheet, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  DollarSign, 
  Calendar, 
  FileText, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  Send
} from 'lucide-react';

export const AdminQuotesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<QuoteRequest[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeQuote, setActiveQuote] = useState<QuoteRequest | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState<string>('');
  const [statusSelect, setStatusSelect] = useState<QuoteRequest['status']>('New');
  const [savingNotes, setSavingNotes] = useState<boolean>(false);

  const { success, error } = useToast();

  const fetchQuotes = async () => {
    setLoading(true);
    const list = await dataService.getQuotes();
    setQuotes(list);
    setFilteredQuotes(list);
    setLoading(false);

    const targetId = searchParams.get('id');
    if (targetId) {
      const found = list.find(q => q.id === targetId);
      if (found) {
        openQuoteModal(found);
      }
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [searchParams]);

  useEffect(() => {
    let list = [...quotes];
    if (selectedStatus !== 'All') {
      list = list.filter(q => q.status === selectedStatus);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        item =>
          item.name.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          (item.company && item.company.toLowerCase().includes(q)) ||
          item.project_type.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q)
      );
    }
    setFilteredQuotes(list);
  }, [selectedStatus, searchQuery, quotes]);

  const openQuoteModal = (quote: QuoteRequest) => {
    setActiveQuote(quote);
    setAdminNotesInput(quote.admin_notes || '');
    setStatusSelect(quote.status);
  };

  const handleSaveEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuote) return;

    setSavingNotes(true);
    try {
      const updated = await dataService.updateQuote(activeQuote.id, {
        admin_notes: adminNotesInput,
        status: statusSelect
      });
      if (updated) {
        setQuotes(quotes.map(q => q.id === activeQuote.id ? updated : q));
        setActiveQuote(updated);
        success('Quote Updated', `Estimator evaluation saved for ${updated.name}`);
      }
    } catch (err: unknown) {
      error('Failed to update quote', err instanceof Error ? err.message : 'Error');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDeleteQuote = async (id: string, name: string) => {
    if (window.confirm(`Delete quote request from ${name}?`)) {
      try {
        await dataService.deleteQuote(id);
        success('Quote Deleted', 'Removed from database');
        if (activeQuote?.id === id) setActiveQuote(null);
        fetchQuotes();
      } catch (err: unknown) {
        error('Delete Failed', err instanceof Error ? err.message : 'Error');
      }
    }
  };

  const statuses = [
    'All',
    'New',
    'Reviewing',
    'Contacted',
    'Site Visit Scheduled',
    'Quotation Sent',
    'Approved',
    'Rejected',
    'Completed'
  ];

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
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-1">
            Estimation & Quantity Surveying
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Client Quotations & Tender Requests
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage project scopes, review architectural drawings, and issue certified BOQ estimates.
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client, company, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {statuses.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === st
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading quotes pipeline...</div>
        ) : filteredQuotes.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-400">No quotation requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">Client / Developer</th>
                  <th className="px-6 py-4">Scope & Location</th>
                  <th className="px-6 py-4">Target Budget</th>
                  <th className="px-6 py-4">Logged Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-white">{q.name}</p>
                        {q.company && <p className="text-[11px] text-slate-400">{q.company}</p>}
                        <p className="text-[11px] text-slate-500 font-mono">{q.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-200">{q.project_type}</p>
                      <p className="text-slate-400">{q.location}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-amber-400">
                      {q.budget}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(q.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadgeClass(
                          q.status
                        )}`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openQuoteModal(q)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center gap-1 px-2.5"
                          title="Evaluate Quote"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>Review</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuote(q.id, q.name)}
                          className="p-1.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-300 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quote Evaluation Modal */}
      {activeQuote && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                  Quote ID: {activeQuote.id}
                </span>
                <h2 className="text-xl font-bold text-white">
                  {activeQuote.project_type} — {activeQuote.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveQuote(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Client Contact</span>
                <span className="text-white font-semibold">{activeQuote.name}</span>
                <p className="text-slate-400 mt-0.5">{activeQuote.phone}</p>
              </div>
              <div>
                <span className="text-slate-500 block">Organization</span>
                <span className="text-white font-semibold">{activeQuote.company || 'Private Developer'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Location</span>
                <span className="text-white font-semibold">{activeQuote.location}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Budget Tier</span>
                <span className="text-amber-400 font-semibold">{activeQuote.budget}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Client's Submitted Specifications
              </h4>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {activeQuote.description}
              </div>
            </div>

            {/* Attachments */}
            {activeQuote.attachments && activeQuote.attachments.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Client Attachments (Drawings / BOQ)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeQuote.attachments.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-slate-950 border border-slate-800 hover:border-amber-500 text-amber-400 text-xs font-semibold rounded-xl transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Download File #{i + 1}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Estimator Evaluation Form */}
            <form onSubmit={handleSaveEvaluation} className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Senior Estimator Notes & Official BOQ Valuation
                </h4>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-300 font-semibold">Lifecycle Status:</label>
                  <select
                    value={statusSelect}
                    onChange={(e) => setStatusSelect(e.target.value as QuoteRequest['status'])}
                    className="bg-slate-950 border border-slate-800 text-xs font-bold text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500"
                  >
                    <option value="New">New</option>
                    <option value="Reviewing">Reviewing</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                    <option value="Quotation Sent">Quotation Sent (Ready)</option>
                    <option value="Approved">Approved (Contract)</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <textarea
                rows={4}
                value={adminNotesInput}
                onChange={(e) => setAdminNotesInput(e.target.value)}
                placeholder="Enter itemized quantities, preliminary concrete cubic meters, structural notes, or pricing breakdowns visible to the client in their portal..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
              />

              <div className="flex justify-between items-center pt-2">
                <a
                  href={`mailto:${activeQuote.email}?subject=ApexBuild%20Quotation%20Ref%20%23${activeQuote.id}&body=Dear%20${encodeURIComponent(activeQuote.name)}%2C%0A%0AThank%20you%20for%20submitting%20your%20project%20specifications%20to%20ApexBuild.`}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-amber-500" />
                  Email Client Directly
                </a>

                <button
                  type="submit"
                  disabled={savingNotes}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {savingNotes ? 'Saving Evaluation...' : 'Save & Publish Evaluation'}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
