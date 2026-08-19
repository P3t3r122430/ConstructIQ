import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SiteSettings } from '../../types/database';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck, 
  HardHat
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { success, error } = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const [formData, setFormData] = useState({
    name: profile?.full_name || '',
    email: profile?.email || user?.email || '',
    phone: profile?.phone || '',
    subject: 'General Construction Inquiry',
    message: ''
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);

  useEffect(() => {
    dataService.getSettings().then(setSettings);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      error('Missing Fields', 'Please fill in your name, email, and message.');
      return;
    }

    setSubmitting(true);
    try {
      await dataService.createContactMessage({
        user_id: user?.id || null,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
        status: 'unread'
      });

      setSent(true);
      success('Message Sent', 'Our executive client relations team will respond within 24 business hours.');
      setFormData({
        name: profile?.full_name || '',
        email: profile?.email || '',
        phone: '',
        subject: 'General Construction Inquiry',
        message: ''
      });
    } catch (err: unknown) {
      error('Error Sending Message', err instanceof Error ? err.message : 'Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const offices = [
    {
      city: 'Nairobi Headquarters (Main Operations)',
      address: 'Apex Tower, 8th Floor, Chiromo Road, Westlands, Nairobi',
      phone: '+254 (0) 20 780 4000',
      email: 'hq@apexbuild.co.ke'
    },
    {
      city: 'Mombasa Coastal Logistics & Batching Yard',
      address: 'Mbaraki Wharf Industrial Zone, Port Reitz, Mombasa',
      phone: '+254 (0) 41 222 8900',
      email: 'coast@apexbuild.co.ke'
    },
    {
      city: 'Western Region Equipment Depot',
      address: 'Obote Road Light Industrial Area, Kisumu',
      phone: '+254 (0) 57 202 3400',
      email: 'western@apexbuild.co.ke'
    }
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Header Banner */}
      <section className="relative py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            <Mail className="w-3.5 h-3.5" /> Corporate Inquiries & Tenders
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Get in Touch with ApexBuild
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Contact our engineering headquarters in Nairobi, arrange a site visit, or discuss large-scale civil tenders.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Info (Col 1-5) */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4 pb-2 border-b border-slate-800">
                  Head Office Information
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white text-sm">Physical Address</p>
                      <p className="text-slate-300 leading-relaxed mt-0.5">
                        {settings?.address || 'Apex Tower, 8th Floor, Chiromo Road, Westlands, Nairobi, Kenya'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white text-sm">Direct Phone Lines</p>
                      <p className="text-slate-300 font-mono mt-0.5">
                        {settings?.phone || '+254 (0) 20 780 4000'}
                      </p>
                      <p className="text-slate-500 text-[11px]">Emergency Plant Line: +254 (0) 711 900 100</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white text-sm">Official Email</p>
                      <p className="text-slate-300 font-mono mt-0.5">
                        {settings?.email || 'contracts@apexbuild.co.ke'}
                      </p>
                      <p className="text-slate-500 text-[11px]">Tenders: tenders@apexbuild.co.ke</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white text-sm">Working Hours</p>
                      <p className="text-slate-300 mt-0.5">
                        {settings?.business_hours || 'Mon - Fri: 7:30 AM - 5:30 PM | Sat: 8:00 AM - 1:00 PM'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp button */}
                {settings?.whatsapp_number && (
                  <div className="pt-4 border-t border-slate-800">
                    <a
                      href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=Hello%20ApexBuild%2C%20I%20would%20like%20to%20inquire%20about%20a%20construction%20project.`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat on WhatsApp: {settings.whatsapp_number}
                    </a>
                  </div>
                )}
              </div>

              {/* Regional Yards List */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
                <h4 className="text-base font-bold text-white mb-2">Regional Operational Depots</h4>
                <div className="space-y-4">
                  {offices.slice(1).map((off, idx) => (
                    <div key={idx} className="text-xs border-b border-slate-800/80 pb-3 last:border-0 last:pb-0">
                      <p className="font-bold text-amber-400">{off.city}</p>
                      <p className="text-slate-300">{off.address}</p>
                      <p className="text-slate-400 mt-0.5 font-mono">{off.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form (Col 6-12) */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl">
                <h3 className="text-2xl font-black text-white mb-2">Send a Message to Our Team</h3>
                <p className="text-xs text-slate-400 mb-6">
                  For formal contract inquiries, supplier partnerships, media requests, or general information.
                </p>

                {sent ? (
                  <div className="bg-slate-950 border border-emerald-800/50 rounded-2xl p-8 text-center space-y-4">
                    <div className="w-14 h-14 bg-emerald-950/80 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-800">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-white">Message Received</h4>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      Thank you for contacting ApexBuild. Your message has been routed to our corporate relations desk.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSent(false)}
                      className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your Name"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Official Email Address *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@organization.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+254 700 000 000"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Inquiry Subject *
                        </label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="General Construction Inquiry">General Construction Inquiry</option>
                          <option value="Tender / RFP Submission">Tender / RFP Submission</option>
                          <option value="Subcontractor & Supplier Registration">Subcontractor & Supplier Registration</option>
                          <option value="Careers & Internship">Careers & Internship</option>
                          <option value="Corporate Partnership">Corporate Partnership</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Your Message / Specifications *
                      </label>
                      <textarea
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please describe your requirements, project location, or inquiry in detail..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
                    >
                      {submitting ? 'Submitting to Supabase...' : 'Send Message'}
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
