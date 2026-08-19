import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { Service, Project } from '../../types/database';
import { 
  Building2, 
  HardHat, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  ShieldCheck, 
  Phone, 
  Wrench,
  Layers,
  Award
} from 'lucide-react';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    dataService.getServiceBySlug(slug).then(async (srv) => {
      setService(srv);
      if (srv) {
        const [all, prjs] = await Promise.all([
          dataService.getServices(true),
          dataService.getProjects()
        ]);
        setAllServices(all.filter(s => s.id !== srv.id));
        setRelatedProjects(prjs.filter(p => p.project_type.toLowerCase() === srv.category.toLowerCase() || p.project_type === 'Commercial').slice(0, 2));
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading service specifications...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Service Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">The requested engineering service division could not be located.</p>
        <Link to="/services" className="px-6 py-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold text-sm">
          Return to Services Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Hero Banner */}
      <section className="relative py-20 bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src={service.image_url}
            alt={service.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Services
          </Link>

          <div className="max-w-3xl">
            <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              {service.category} Division
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              {service.title}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              {service.short_description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Details (Col 1 & 2) */}
            <div className="lg:col-span-2 space-y-12">
              {/* Feature Image */}
              <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl h-80 sm:h-96">
                <img
                  src={service.image_url}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* In-depth Scope Description */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <h2 className="text-2xl font-black text-white mb-4">
                  Engineering Scope & Technical Methodology
                </h2>
                <div className="text-slate-300 text-sm leading-relaxed space-y-4">
                  <p>{service.description}</p>
                </div>
              </div>

              {/* Technical Specifications Checklist */}
              {service.features && service.features.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                  <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-500" />
                    Key Standards & Technical Deliverables
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-xs font-medium text-slate-200">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Projects */}
              {relatedProjects.length > 0 && (
                <div>
                  <h3 className="text-xl font-black text-white mb-6">
                    Relevant Completed Case Studies
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {relatedProjects.map((p) => (
                      <div
                        key={p.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-amber-500/40 transition-all"
                      >
                        <div className="h-44 overflow-hidden relative">
                          <img
                            src={p.cover_image_url}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute top-3 left-3 bg-slate-950/80 px-2.5 py-0.5 rounded text-[10px] font-bold text-amber-400">
                            {p.location}
                          </span>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-sm text-white mb-1 group-hover:text-amber-400 transition-colors truncate">
                            {p.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-2 mb-3">{p.short_description}</p>
                          <Link
                            to={`/projects/${p.slug}`}
                            className="text-xs font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
                          >
                            View Case Study <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar (Col 3) */}
            <div className="space-y-8">
              {/* Direct Quote CTA Box */}
              <div className="bg-gradient-to-br from-amber-500/20 to-amber-950/40 border border-amber-500/30 rounded-2xl p-6 text-slate-100 shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center mb-4 font-black">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Request {service.title} Quote
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Submit your preliminary site plans or BOQ for an itemized estimate prepared by our registered Quantity Surveyors.
                </p>
                <Link
                  to={`/request-quote?service=${encodeURIComponent(service.title)}`}
                  className="block w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm text-center rounded-xl transition-colors shadow-md"
                >
                  Start Quote Request
                </Link>
              </div>

              {/* Other Services Navigation */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h4 className="text-base font-bold text-white mb-4 pb-2 border-b border-slate-800">
                  Other Engineering Divisions
                </h4>
                <ul className="space-y-2.5">
                  {allServices.map((s) => (
                    <li key={s.id}>
                      <Link
                        to={`/services/${s.slug}`}
                        className="text-xs font-medium text-slate-300 hover:text-amber-400 flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/60 transition-colors"
                      >
                        <span className="truncate">{s.title}</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Emergency / Direct line */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-xs text-slate-400 space-y-3">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Phone className="w-4 h-4 text-amber-500" />
                  <span>Direct Contracts Desk</span>
                </div>
                <p>Call our chief estimators directly for urgent tenders and statutory inquiries.</p>
                <a
                  href="tel:+254207804000"
                  className="block text-amber-400 font-mono font-bold text-sm hover:underline"
                >
                  +254 (0) 20 780 4000
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
