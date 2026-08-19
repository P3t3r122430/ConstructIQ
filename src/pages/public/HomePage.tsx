import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { Project, Service, Testimonial, BlogPost, SiteSettings } from '../../types/database';
import { 
  Building2, 
  HardHat, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Clock, 
  Award, 
  ChevronRight, 
  Layers, 
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Compass,
  FileCheck2,
  Hammer
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [activeProjectFilter, setActiveProjectFilter] = useState<string>('All');

  useEffect(() => {
    Promise.all([
      dataService.getProjects(),
      dataService.getServices(true),
      dataService.getTestimonials(true),
      dataService.getBlogPosts(true),
      dataService.getSettings()
    ]).then(([prjs, srvs, tests, blogs, sttgs]) => {
      setProjects(prjs);
      setServices(srvs);
      setTestimonials(tests);
      setBlogPosts(blogs.slice(0, 3));
      setSettings(sttgs);
    });
  }, []);

  const projectCategories = ['All', 'Commercial', 'Residential', 'Civil Works', 'Industrial'];
  const filteredProjects = activeProjectFilter === 'All'
    ? projects.slice(0, 6)
    : projects.filter(p => p.project_type.toLowerCase() === activeProjectFilter.toLowerCase()).slice(0, 6);

  const stats = [
    { value: '180+', label: 'Landmark Projects Delivered', icon: Building2 },
    { value: '99.8%', label: 'Zero-Harm Safety Record', icon: ShieldCheck },
    { value: '18+', label: 'Years of Engineering Mastery', icon: Award },
    { value: '100%', label: 'NCA 1 Tier-1 Certified', icon: FileCheck2 },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Geotechnical & Feasibility',
      description: 'Rigorous site core drilling, environmental impact assessments (NEMA), and structural feasibility simulations.',
      icon: Compass
    },
    {
      step: '02',
      title: 'BIM 3D/4D & Value Engineering',
      description: 'Detailed structural modeling, clash detection, and quantity surveying to optimize budget efficiency.',
      icon: Layers
    },
    {
      step: '03',
      title: 'Statutory Approvals & Permitting',
      description: 'End-to-end county government stamping, NCA project registration, and utility connection permits.',
      icon: FileCheck2
    },
    {
      step: '04',
      title: 'Heavy Precision Execution',
      description: 'Deployment of in-house heavy plant, post-tensioned concrete casting, and daily drone telemetry audits.',
      icon: HardHat
    },
    {
      step: '05',
      title: 'Quality QA/QC & Handover',
      description: 'Comprehensive non-destructive load testing, MEP commissioning, and 10-year structural warranty issuance.',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="bg-[#0A0B0D] text-[#F9FAFB] min-h-screen">
      {/* 1. SAAS SPLIT HERO SECTION */}
      <section className="relative border-b border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left Column: SaaS Value Proposition */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-sm text-[10px] bg-amber-500/10 text-amber-500 font-bold tracking-widest uppercase border border-amber-500/20">
                    Enterprise Construction Platform
                  </span>
                  <div className="h-px w-12 bg-white/20"></div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                    NCA 1 Certified
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] uppercase">
                  ENGINEERED<br />
                  <span className="text-amber-500">INTEGRITY.</span>
                </h1>

                <p className="text-sm text-gray-400 leading-relaxed max-w-lg">
                  Managing East Africa's most ambitious civil and structural projects through a unified digital ecosystem. Tier-1 certified delivery with real-time operational telemetry and rigorous governance.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to="/request-quote"
                    className="bg-amber-500 text-black text-xs font-bold px-5 py-3 rounded-sm shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all uppercase tracking-wider flex items-center gap-2"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    Request Formal Quotation
                  </Link>

                  <Link
                    to="/projects"
                    className="bg-white/5 border border-white/10 text-xs font-bold px-5 py-3 rounded-sm hover:bg-white/10 text-white transition-all uppercase tracking-wider flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4 text-amber-500" />
                    Project Portfolio
                  </Link>
                </div>
              </div>

              {/* Stats Footer Metric Bar */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xl sm:text-2xl font-bold tracking-tight text-white">180+</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">Projects Delivered</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold tracking-tight text-amber-500">99.8%</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">Safety Zero-Harm</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold tracking-tight text-white">18+ Yrs</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">Tier-1 NCA 1 Record</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Real-Time Feed & Live Monitor */}
            <div className="lg:col-span-6 bg-[#0F1115] border border-white/10 rounded-sm p-5 flex flex-col justify-between shadow-2xl space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                    Active Telemetry Feed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/request-quote"
                    className="px-2 py-1 text-[10px] font-bold bg-white/5 border border-white/10 hover:border-white/20 rounded-sm text-gray-300 hover:text-white uppercase transition-colors"
                  >
                    + New Quote
                  </Link>
                  <Link
                    to="/admin"
                    className="px-2 py-1 text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 rounded-sm uppercase transition-colors"
                  >
                    Portal Login
                  </Link>
                </div>
              </div>

              {/* Status Row: Dual Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Active Site Card */}
                <div className="p-3 bg-black/40 border border-white/5 rounded-sm">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1.5">
                    <span>FLAGSHIP SITE</span>
                    <span className="flex items-center gap-1 text-green-400 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      ON TRACK
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white truncate">Lavington Heights - Phase 3</div>
                  <div className="mt-2.5">
                    <div className="flex justify-between text-[9px] text-gray-500 mb-1">
                      <span>Progress (Structural Core)</span>
                      <span className="text-amber-500 font-bold">72%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[72%]"></div>
                    </div>
                  </div>
                </div>

                {/* Real-time Enquiries Card */}
                <div className="p-3 bg-black/40 border border-white/5 rounded-sm">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1.5">
                    <span>LIVE INTAKE</span>
                    <span className="text-amber-500 font-bold">ACTIVE</span>
                  </div>
                  <div className="text-xs font-bold text-white truncate">NCA 1 Tender Evaluation</div>
                  <div className="mt-2 space-y-1 text-[10px] text-gray-400">
                    <div className="flex items-center justify-between">
                      <span>Commercial Tower (Kilimani)</span>
                      <span className="text-gray-500 text-[9px]">4m ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Civil Highway Drainage</span>
                      <span className="text-gray-500 text-[9px]">18m ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terminal Logs View */}
              <div className="bg-black/60 border border-white/10 rounded-sm p-3 font-mono text-[11px] space-y-2">
                <div className="flex items-center justify-between text-[9px] text-gray-500 border-b border-white/5 pb-1">
                  <span>SYSTEM OPERATION LOGS</span>
                  <span className="text-amber-500/80">LIVE SYNC</span>
                </div>
                <div className="space-y-1.5 text-gray-400 leading-tight">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-[10px]">14:22:01</span>
                    <span className="text-emerald-400">[Supply]</span>
                    <span className="truncate">C35/45 Ready-Mix Batch QA verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-[10px]">14:18:40</span>
                    <span className="text-amber-400">[Safety]</span>
                    <span className="truncate">OSHA daily structural crane audit passed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-[10px]">13:55:12</span>
                    <span className="text-blue-400">[BIM 3D]</span>
                    <span className="truncate">MEP clash resolution approved by PM</span>
                  </div>
                </div>
              </div>

              {/* Node Telemetry Bar */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-gray-500 uppercase tracking-widest font-semibold">
                <span>Core DB: Connected</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Supabase RLS: Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="bg-[#0F1115] border-b border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-sm bg-white/5 border border-white/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CORE SERVICES OVERVIEW */}
      <section className="py-16 bg-[#0A0B0D]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-white/10 pb-6">
            <div>
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5">
                Engineering Disciplines
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                Turnkey Construction Capabilities
              </h2>
            </div>
            <Link
              to="/services"
              className="mt-3 md:mt-0 inline-flex items-center gap-1 text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-wider"
            >
              View Full Services Catalog <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service) => (
              <div
                key={service.id}
                className="group bg-[#0F1115] border border-white/10 rounded-sm overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col shadow-xl"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                  />
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider text-amber-500 border border-white/10">
                    {service.category}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-500 transition-colors uppercase tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed mb-4">
                      {service.short_description}
                    </p>

                    {/* Features list */}
                    {service.features && service.features.length > 0 && (
                      <ul className="space-y-1 mb-5">
                        {service.features.slice(0, 3).map((feat, fIdx) => (
                          <li key={fIdx} className="text-xs text-gray-300 flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-white group-hover:text-amber-500 transition-colors pt-3 border-t border-white/10 uppercase tracking-wider"
                  >
                    Service Scope & Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS SHOWCASE */}
      <section className="py-16 bg-[#0F1115] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-white/10 pb-6">
            <div>
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5">
                Proven Delivery
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                Featured Landmark Projects
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              {projectCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveProjectFilter(cat)}
                  className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider transition-all ${
                    activeProjectFilter === cat
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-[#0A0B0D] border border-white/10 rounded-sm overflow-hidden hover:border-white/20 transition-all flex flex-col group shadow-xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={project.cover_image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                      {project.project_type}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                      project.status === 'Completed'
                        ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950/90 text-amber-400 border border-amber-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  {project.budget && (
                    <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-md px-2.5 py-0.5 rounded-sm text-xs font-bold text-amber-500 border border-white/10">
                      {project.budget}
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>{project.location}</span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-500 transition-colors uppercase tracking-tight">
                      {project.title}
                    </h3>

                    <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">
                      {project.short_description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Client: <span className="text-gray-300 font-medium">{project.client || 'Institutional Developer'}</span>
                    </span>
                    <Link
                      to={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 hover:text-amber-400 uppercase tracking-wider"
                    >
                      Case Study <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-sm text-xs uppercase tracking-wider transition-colors border border-white/10"
            >
              Browse All Projects & Galleries <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. THE 5-STAGE CONSTRUCTION PROCESS */}
      <section className="py-16 bg-[#0A0B0D]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5">
              Methodology
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
              5-Stage Project Delivery Lifecycle
            </h2>
            <p className="mt-2 text-gray-400 text-xs leading-relaxed">
              How we ensure on-schedule completion, strict budget fidelity, and zero-compromise structural safety on every site.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#0F1115] border border-white/10 rounded-sm p-5 relative flex flex-col justify-between hover:border-white/20 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-amber-500 font-mono">
                        {step.step}
                      </span>
                      <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 text-amber-500 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. VERIFIED TESTIMONIALS */}
      <section className="py-16 bg-[#0F1115] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5">
              Client Validation
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
              Trusted by Leading Institutional Developers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-[#0A0B0D] border border-white/10 rounded-sm p-6 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center gap-1 mb-3 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-gray-300 text-xs leading-relaxed italic mb-5">
                    "{t.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                  {t.image_url ? (
                    <img
                      src={t.image_url}
                      alt={t.customer_name}
                      className="w-10 h-10 rounded-full object-cover border border-amber-500/30"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-xs">
                      {t.customer_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-white">{t.customer_name}</p>
                    <p className="text-[11px] text-amber-500">{t.company}</p>
                    {t.project_title && (
                      <p className="text-[10px] text-gray-500 truncate max-w-[180px]">
                        Ref: {t.project_title}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. LATEST BLOG / INDUSTRY ARTICLES */}
      <section className="py-16 bg-[#0A0B0D]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-white/10 pb-6">
            <div>
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5">
                Technical Knowledge
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                Technical Insights & Market Research
              </h2>
            </div>
            <Link
              to="/blog"
              className="mt-3 md:mt-0 inline-flex items-center gap-1 text-xs font-bold text-amber-500 hover:text-amber-400 uppercase tracking-wider"
            >
              Browse All Articles <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-[#0F1115] border border-white/10 rounded-sm overflow-hidden flex flex-col group hover:border-white/20 transition-all"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider text-amber-500 border border-white/10">
                    {post.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        {post.read_time}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-2 group-hover:text-amber-500 transition-colors line-clamp-2 uppercase tracking-tight">
                      {post.title}
                    </h3>

                    <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 hover:text-amber-400 pt-3 border-t border-white/10 uppercase tracking-wider"
                  >
                    Read Technical Paper <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAST QUOTE / CONTACT BANNER */}
      <section className="py-14 bg-amber-500 text-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              <span className="text-[10px] font-bold tracking-widest uppercase text-black/70 block mb-1">
                Commercial & Infrastructure Procurement
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase text-black mb-2">
                Have a Complex Civil or Structural Project?
              </h2>
              <p className="text-black/80 font-medium text-xs sm:text-sm leading-relaxed">
                Connect with our Senior Structural Engineers and Quantity Surveyors for comprehensive feasibility, BOQ analysis, and statutory guidance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              <Link
                to="/request-quote"
                className="px-6 py-3 bg-black hover:bg-black/90 text-white rounded-sm text-xs font-bold text-center uppercase tracking-wider transition-colors shadow-xl"
              >
                Request a Detailed Quote
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 bg-white hover:bg-white/90 text-black font-bold rounded-sm text-xs text-center uppercase tracking-wider transition-colors shadow-sm"
              >
                Contact Nairobi HQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
