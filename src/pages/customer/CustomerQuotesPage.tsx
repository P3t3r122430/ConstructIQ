import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { QuoteRequest } from '../../types/database';
import { 
  FileSpreadsheet, 
  MapPin, 
  Calendar, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ExternalLink,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export const CustomerQuotesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user, profile } = useAuth();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  useEffect(() => {
    dataService.getQuotes(user?.id, profile?.email).then((data) => {
      setQuotes(data);
      setLoading(false);

      const targetId = searchParams.get('id');
      if (targetId) {
        const found = data.find(q => q.id === targetId);
        if (found) setSelectedQuote(found);
      }
    });
  }, [user, profile, searchParams]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Your Project Quotations & BOQs</h1>
          <p className="text-xs text-slate-400">
            View engineering review stages, certified estimates, and uploaded architectural files.
          </p>
        </div>
        <Link
          to="/request-quote"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New Quote Request
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quotes List (Col 1-5) */}
        <div className="lg:col-span-5 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading quotes...</div>
          ) : quotes.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
              <FileSpreadsheet className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No quotation requests found.</p>
            </div>
          ) : (
            quotes.map((q) => {
              const isSelected = selectedQuote?.id === q.id;
              return (
                <div
                  key={q.id}
                  onClick={() => setSelectedQuote(q)}
                  className={`bg-slate-900 border rounded-2xl p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-slate-850 shadow-md shadow-amber-500/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-white truncate">{q.project_type}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${getStatusBadgeClass(
                        q.status
                      )}`}
                    >
                      {q.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 truncate mb-2">
                    <MapPin className="w-3 h-3 text-amber-500 inline mr-1" />
                    {q.location}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                    <span>{new Date(q.created_at).toLocaleDateString('en-GB')}</span>
                    <span className="font-mono text-amber-400/80">Ref: #{q.id.slice(0, 6)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quote Details View (Col 6-12) */}
        <div className="lg:col-span-7">
          {selectedQuote ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl sticky top-24">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
                    Reference #{selectedQuote.id}
                  </span>
                  <h2 className="text-xl font-bold text-white">{selectedQuote.project_type}</h2>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadgeClass(
                    selectedQuote.status
                  )}`}
                >
                  Status: {selectedQuote.status}
                </span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block mb-0.5">Location</span>
                  <span className="text-white font-semibold">{selectedQuote.location}</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block mb-0.5">Target Budget</span>
                  <span className="text-amber-400 font-semibold">{selectedQuote.budget}</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block mb-0.5">Built Area</span>
                  <span className="text-white font-semibold">{selectedQuote.estimated_area || 'Not specified'}</span>
                </div>
              </div>

              {/* Project Scope Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Submitted Specifications
                </h4>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {selectedQuote.description}
                </div>
              </div>

              {/* Estimator's Official Response / Admin Notes */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Engineering Review & Estimator Notes
                </h4>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  {selectedQuote.admin_notes ? (
                    <div className="text-xs text-emerald-400 space-y-1">
                      <p className="font-semibold">Formal Evaluation Notes:</p>
                      <p className="text-slate-300">{selectedQuote.admin_notes}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      Our Senior Estimator is currently conducting preliminary quantity take-offs. Formal BOQ notes will appear here upon completion.
                    </p>
                  )}
                </div>
              </div>

              {/* Attachments */}
              {selectedQuote.attachments && selectedQuote.attachments.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Attached Site Plans / Drawings
                  </h4>
                  <div className="space-y-2">
                    {selectedQuote.attachments.map((att, idx) => (
                      <a
                        key={idx}
                        href={att}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 hover:border-amber-500 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="truncate flex-1">Document Attachment #{idx + 1}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
              Select a quote from the list on the left to view comprehensive engineering details and status reports.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
