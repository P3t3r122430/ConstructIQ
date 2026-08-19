import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { useToast } from '../../context/ToastContext';
import { ContactMessage } from '../../types/database';
import { Mail, Search, Trash2, CheckCircle2, Send, Eye, X } from 'lucide-react';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);

  const [replyText, setReplyText] = useState<string>('');
  const [sendingReply, setSendingReply] = useState<boolean>(false);

  const { success, error } = useToast();

  const fetchMessages = async () => {
    setLoading(true);
    const list = await dataService.getMessages();
    setMessages(list);
    setFilteredMessages(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    let list = [...messages];
    if (selectedStatus !== 'All') {
      list = list.filter(m => m.status === selectedStatus.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        m =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
      );
    }
    setFilteredMessages(list);
  }, [selectedStatus, searchQuery, messages]);

  const handleUpdateStatus = async (id: string, status: ContactMessage['status']) => {
    try {
      const updated = await dataService.updateMessageStatus(id, status);
      if (updated) {
        setMessages(messages.map(m => m.id === id ? updated : m));
        if (activeMessage?.id === id) setActiveMessage(updated);
        success('Message Status Updated', `Status changed to ${status}`);
      }
    } catch (err: unknown) {
      error('Failed to update status', err instanceof Error ? err.message : 'Error');
    }
  };

  const handleSendReply = async () => {
    if (!activeMessage || !replyText.trim()) return;
    setSendingReply(true);
    try {
      const updated = await dataService.replyToMessage(activeMessage.id, replyText.trim());
      if (updated) {
        setMessages(messages.map(m => m.id === activeMessage.id ? updated : m));
        setActiveMessage(updated);
        setReplyText('');
        success('Reply Recorded', 'In-app response recorded and visible to client.');
      }
    } catch (err: unknown) {
      error('Reply Failed', err instanceof Error ? err.message : 'Error');
    } finally {
      setSendingReply(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete message from ${name}?`)) {
      try {
        await dataService.deleteMessage(id);
        success('Message Deleted', 'Removed from inbox');
        if (activeMessage?.id === id) setActiveMessage(null);
        fetchMessages();
      } catch (err: unknown) {
        error('Delete Failed', err instanceof Error ? err.message : 'Error');
      }
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl w-full mx-auto">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-1">
          Communications & Inquiries
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Headquarters Contact Inbox
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Inquiries submitted through the public website portal and tender information requests.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1">
          {['All', 'Unread', 'Read', 'Archived'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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

      {/* Messages Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading messages...</div>
        ) : filteredMessages.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-400">No messages in inbox.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">Sender</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Received Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredMessages.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-white">{m.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{m.email}</p>
                        {m.phone && <p className="text-[11px] text-slate-500">{m.phone}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-200 truncate max-w-sm">{m.subject}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{m.message}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(m.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          m.status === 'unread'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : m.status === 'read'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {m.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMessage(m);
                            if (m.status === 'unread') handleUpdateStatus(m.id, 'read');
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center gap-1 px-2.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>View</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(m.id, m.name)}
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

      {/* Message Reader Modal */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  Subject: {activeMessage.subject}
                </span>
                <h2 className="text-xl font-bold text-white">{activeMessage.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveMessage(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-1 text-slate-400">
              <p><span className="text-slate-200 font-semibold">Email:</span> {activeMessage.email}</p>
              {activeMessage.phone && <p><span className="text-slate-200 font-semibold">Phone:</span> {activeMessage.phone}</p>}
              <p><span className="text-slate-200 font-semibold">Received:</span> {new Date(activeMessage.created_at).toLocaleString('en-GB')}</p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {activeMessage.message}
            </div>

            {/* In-App Reply Section */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <label className="block text-xs font-bold text-slate-300">
                Official In-App Response (Visible in Customer Portal)
              </label>
              {activeMessage.admin_reply ? (
                <div className="bg-amber-950/20 border border-amber-500/20 p-4 rounded-xl space-y-1">
                  <p className="text-xs text-amber-400 font-bold">Current Response:</p>
                  <p className="text-xs text-slate-200">{activeMessage.admin_reply}</p>
                  {activeMessage.replied_at && (
                    <p className="text-[10px] text-slate-500">
                      Logged at {new Date(activeMessage.replied_at).toLocaleString('en-GB')}
                    </p>
                  )}
                </div>
              ) : null}
              <div className="flex gap-2">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type an official response to be logged for this inquiry..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || sendingReply}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 disabled:opacity-50 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  {sendingReply ? 'Recording Reply...' : 'Save In-App Reply'}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Status:</span>
                <select
                  value={activeMessage.status}
                  onChange={(e) => handleUpdateStatus(activeMessage.id, e.target.value as ContactMessage['status'])}
                  className="bg-slate-950 border border-slate-800 text-xs font-bold text-white rounded-lg px-3 py-1.5"
                >
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <a
                href={`mailto:${activeMessage.email}?subject=RE:%20${encodeURIComponent(activeMessage.subject)}&body=Dear%20${encodeURIComponent(activeMessage.name)}%2C%0A%0AThank%20you%20for%20contacting%20ApexBuild%20Engineering%20%26%20Construction.%0A%0A`}
                onClick={() => handleUpdateStatus(activeMessage.id, 'read')}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                Reply via External Email Client
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
