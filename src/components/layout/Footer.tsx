import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { SiteSettings, Service } from '../../types/database';
import { 
  HardHat, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare,
  Lock
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const { success } = useToast();

  useEffect(() => {
    dataService.getSettings().then(setSettings);
    dataService.getServices(true).then((data) => setServices(data.slice(0, 6)));
  }, []);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    success('Subscribed Successfully', 'You will receive our quarterly East Africa Construction & Engineering Market Reports.');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#0A0B0D] text-gray-400 border-t border-white/10 pt-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500 rounded-sm flex items-center justify-center font-bold text-black shadow-lg shadow-amber-500/20">
                <HardHat className="w-5 h-5 text-black stroke-[2.4]" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tighter uppercase text-white flex items-center gap-1">
                  Nbyte<span className="text-amber-500">.</span>
                </span>
                <span className="block text-[9px] uppercase font-bold tracking-widest text-gray-400">
                  Architecture & Construction
                </span>
              </div>
            </Link>

            <p className="text-xs text-gray-400 leading-relaxed max-w-md">
              Tier-1 (NCA 1) certified architectural design, civil engineering, and general contracting firm delivering landmark commercial high-rises, heavy civil infrastructure, luxury residential estates, and industrial facilities across East Africa.
            </p>

            {/* Certifications badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase bg-white/5 text-amber-500 border border-white/10 px-2.5 py-1 rounded-sm">
                <ShieldCheck className="w-3.5 h-3.5" /> NCA 1 Registered
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase bg-white/5 text-gray-300 border border-white/10 px-2.5 py-1 rounded-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ISO 9001:2015
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase bg-white/5 text-gray-300 border border-white/10 px-2.5 py-1 rounded-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Zero-Harm Safety
              </span>
            </div>

            {/* WhatsApp Quick Action */}
            {settings?.whatsapp_number && (
              <div className="pt-1">
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=Hello%20Nbyte%20Architecture%20%26%20Construction%2C%20I%20would%20like%20to%20inquire%20about%20a%20construction%20project.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-800/50 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp: {settings.whatsapp_number}
                </a>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-xs tracking-widest uppercase mb-4 text-gray-300">
              Company
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Nbyte
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-white transition-colors">
                  Projects Portfolio
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Engineering Services
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Technical Insights & News
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Contracting FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact & Locations
                </Link>
              </li>
            </ul>
          </div>

          {/* Services List */}
          <div>
            <h3 className="text-white font-bold text-xs tracking-widest uppercase mb-4 text-gray-300">
              Services
            </h3>
            <ul className="space-y-2 text-xs">
              {services.map((s) => (
                <li key={s.id}>
                  <Link
                    to={`/services/${s.slug}`}
                    className="hover:text-white transition-colors truncate block"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xs tracking-widest uppercase mb-4 text-gray-300">
              Nairobi HQ
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>{settings?.address || 'Axon Tower, 8th Floor, Chiromo Road, Westlands, Nairobi'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{settings?.phone || '+254 (0) 20 780 4000'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{settings?.email || 'contracts@nbyte.co.ke'}</span>
              </li>
              <li className="flex items-start gap-2 text-gray-500">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>{settings?.business_hours || 'Mon - Fri: 7:30 AM - 5:30 PM'}</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-2">Quarterly Reports</p>
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-sm px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 flex-1"
                  required
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 rounded-sm transition-colors font-bold"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 mt-1">Subscribed successfully.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar matching SaaS Split Footer */}
      <div className="border-t border-white/10 py-3.5 px-6 sm:px-8 bg-black/40 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-semibold flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>&copy; {new Date().getFullYear()} NBYTE ARCHITECTURE & CONSTRUCTION</div>
        <div className="flex items-center gap-6">
          <span>Secure Node: NBO-01</span>
          <span className="inline-flex items-center gap-1.5 text-green-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            System Live
          </span>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1 text-gray-400 hover:text-amber-400 transition-colors border-l border-white/10 pl-4"
          >
            <Lock className="w-3 h-3 text-gray-500" />
            Staff
          </Link>
        </div>
      </div>
    </footer>
  );
};
