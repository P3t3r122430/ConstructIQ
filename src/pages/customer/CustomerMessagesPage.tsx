import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { ContactMessage } from '../../types/database';
import { Mail, Clock, CheckCircle2, MessageSquare, PlusCircle } from 'lucide-react';

export const CustomerMessagesPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    dataService.getContactMessages(user?.id, profile?.email).then((data) => {
      setMessages(data);
      setLoading(false);
    });
  }, [user, profile]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Your Inquiries & Messages</h1>
          <p className="text-xs text-slate-400">
            Track communication with our client relations desk and engineering departments.
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Send New Message
        </Link>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading inquiries...</div>
        ) : messages.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <Mail className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">No Inquiries Found</h3>
            <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
              If you have any contract questions or tender clarifications, send a message to our headquarters.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
            >
              Contact Nairobi HQ
            </Link>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{msg.subject}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      msg.admin_reply
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : msg.status === 'read'
                        ? 'bg-blue-950 text-blue-400 border border-blue-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {msg.admin_reply ? 'Replied' : msg.status}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(msg.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {msg.message}
              </div>

              {msg.admin_reply && (
                <div className="bg-amber-950/20 border border-amber-500/20 p-4 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Nbyte Engineering Desk Response:</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed pl-5">
                    {msg.admin_reply}
                  </p>
                  {msg.replied_at && (
                    <p className="text-[10px] text-slate-500 pl-5">
                      Replied on {new Date(msg.replied_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
