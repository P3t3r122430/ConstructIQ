import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { Service } from '../../types/database';
import { 
  Building2, 
  HardHat, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  FileText,
  Filter,
  Wrench
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    dataService.getServices(true).then((data) => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];

  const filtered = selectedCategory === 'All'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="bg-[#0A0B0D] text-[#F9FAFB] min-h-screen">
      {/* Header Banner */}
      <section className="relative py-16 bg-[#0F1115] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-sm uppercase tracking-widest mb-4">
            <Wrench className="w-3.5 h-3.5" /> NCA 1 Tier-1 Capabilities
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white mb-3">
            Construction & Engineering Disciplines
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            Full-lifecycle design, procurement, structural engineering, and heavy general contracting for commercial, residential, and infrastructure clients across East Africa.
          </p>
        </div>
      </section>

      {/* Services Grid & Filters */}
      <section className="py-14 bg-[#0A0B0D]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-400 text-xs">Loading services catalog...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((service) => (
                <div
                  key={service.id}
                  className="bg-[#0F1115] border border-white/10 rounded-sm overflow-hidden flex flex-col group hover:border-white/20 transition-all duration-300 shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                    />
                    <span className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider text-amber-500 border border-white/10">
                      {service.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-500 transition-colors uppercase tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed mb-5">
                        {service.short_description}
                      </p>

                      {/* Features */}
                      {service.features && service.features.length > 0 && (
                        <div className="space-y-1.5 mb-5">
                          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                            Key Specifications:
                          </p>
                          <ul className="space-y-1">
                            {service.features.slice(0, 3).map((feat, idx) => (
                              <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                <span className="truncate">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <Link
                        to={`/services/${service.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-wider"
                      >
                        Scope <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        to={`/request-quote?service=${encodeURIComponent(service.title)}`}
                        className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-500" />
                        Quote
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quote Banner */}
      <section className="py-14 bg-amber-500 text-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-black mb-2">
            Need a Custom Engineering Solution?
          </h2>
          <p className="text-black/80 font-medium text-xs sm:text-sm mb-6 max-w-xl mx-auto leading-relaxed">
            Our engineering team prepares comprehensive bill of quantities (BOQ) and constructability analyses within 48 hours.
          </p>
          <Link
            to="/request-quote"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-black/90 text-white font-bold rounded-sm text-xs uppercase tracking-wider shadow-lg transition-colors"
          >
            Submit Project Specifications <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
