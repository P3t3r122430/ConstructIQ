import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { TeamMember, SiteSettings } from '../../types/database';
import { 
  HardHat, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  Building2, 
  Users, 
  ArrowRight, 
  Target, 
  Eye, 
  FileCheck2,
  Phone,
  Mail,
  Linkedin
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    Promise.all([
      dataService.getTeamMembers(true),
      dataService.getSettings()
    ]).then(([t, s]) => {
      setTeam(t);
      setSettings(s);
    });
  }, []);

  const coreValues = [
    {
      title: 'Zero-Harm Safety First',
      description: 'Human life and physical safety transcend all operational considerations. Every employee and contractor has mandatory stop-work authority.',
      icon: ShieldCheck
    },
    {
      title: 'Uncompromising Structural Rigor',
      description: 'We build strictly to Eurocode and BS 8110 standards, validated through continuous geotechnical and non-destructive load testing.',
      icon: HardHat
    },
    {
      title: 'Transparent Quantity Surveying',
      description: 'Open-book milestone accounting, certified interim valuations, and zero hidden price escalations.',
      icon: FileCheck2
    },
    {
      title: 'Sustainable & EDGE-Certified',
      description: 'Pioneering low-embodied carbon concrete mixes, solar microgrid integration, and water-recycling infrastructure.',
      icon: Award
    }
  ];

  return (
    <div className="bg-[#0A0B0D] text-[#F9FAFB] min-h-screen">
      {/* Header Banner */}
      <section className="relative py-16 bg-[#0F1115] border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&auto=format&fit=crop&q=80"
            alt="Engineering Infrastructure"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-sm uppercase tracking-widest mb-4">
            <Award className="w-3.5 h-3.5" /> Established 2008 • Nairobi, Kenya
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white mb-3">
            Engineering Excellence & Enduring Landmarks
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            Delivering Tier-1 civil engineering, commercial architecture, and infrastructure developments with zero-harm safety and unyielding structural integrity across East Africa.
          </p>
        </div>
      </section>

      {/* Story & Heritage */}
      <section className="py-16 bg-[#0A0B0D]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5">
                Our Heritage & Scale
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mb-6">
                Over 18 Years Shaping East Africa’s Built Environment
              </h2>
              <div className="space-y-4 text-gray-300 text-xs leading-relaxed">
                <p>
                  Founded in Nairobi in 2008 by a consortium of registered structural engineers and project managers, ApexBuild has grown from a specialized civil earthworks contractor into one of East Africa’s premier Tier-1 (NCA 1) registered general engineering and construction companies.
                </p>
                <p>
                  Today, we maintain an active in-house fleet of tower cranes, batching plants, heavy excavators, laser-guided paving machines, and specialized piling rigs. Our multidisciplinary engineering team coordinates complex capital expenditure projects from deep-basement excavation in Upper Hill to high-altitude highway concessions and pharmaceutical-grade logistics centers.
                </p>
                <p>
                  With over 1.2 billion KES in active project delivery and more than 3.8 million consecutive safe working hours logged without a lost-time incident, ApexBuild represents the gold standard in modern African engineering.
                </p>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
                <div className="bg-[#0F1115] border border-white/10 p-4 rounded-sm">
                  <p className="text-2xl font-bold text-amber-500 font-mono">NCA 1</p>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Unlimited Value Category Contractor</p>
                </div>
                <div className="bg-[#0F1115] border border-white/10 p-4 rounded-sm">
                  <p className="text-2xl font-bold text-white font-mono">ISO 9001</p>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Quality Management System</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-sm overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&auto=format&fit=crop&q=80"
                  alt="ApexBuild Site Engineers on Site"
                  className="w-full h-full object-cover filter brightness-90"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Core Values */}
      <section className="py-16 bg-[#0F1115] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Mission & Vision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            <div className="bg-[#0A0B0D] border border-white/10 p-6 rounded-sm shadow-xl">
              <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 text-amber-500 flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">Our Mission</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                {settings?.mission || 'To deliver superior infrastructure and architectural landmarks that drive economic progress, uphold unyielding structural integrity, and ensure zero-harm safety for every worker and community.'}
              </p>
            </div>

            <div className="bg-[#0A0B0D] border border-white/10 p-6 rounded-sm shadow-xl">
              <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 text-amber-500 flex items-center justify-center mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">Our Vision</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                {settings?.vision || 'To be East Africa’s most trusted, technologically advanced, and environmentally sustainable engineering and construction powerhouse.'}
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div>
            <div className="text-center max-w-xl mx-auto mb-10">
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5">
                Operational Culture
              </p>
              <h3 className="text-2xl font-bold uppercase tracking-tight text-white">Our Non-Negotiable Core Values</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {coreValues.map((v, idx) => {
                const Icon = v.icon;
                return (
                  <div
                    key={idx}
                    className="bg-[#0A0B0D] border border-white/10 p-5 rounded-sm hover:border-white/20 transition-all shadow-xl"
                  >
                    <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 text-amber-500 flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1.5 uppercase tracking-tight">{v.title}</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{v.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Executive Engineering Team */}
      <section className="py-16 bg-[#0A0B0D]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5">
              Executive Leadership
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
              Experienced Engineers & Project Directors
            </h2>
            <p className="text-gray-400 text-xs mt-2">
              Registered with the Engineers Board of Kenya (EBK), Institution of Engineers of Kenya (IEK), and Board of Registration of Architects and Quantity Surveyors (BORAQS).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.id}
                className="bg-[#0F1115] border border-white/10 rounded-sm overflow-hidden flex flex-col group hover:border-white/20 transition-all shadow-xl"
              >
                <div className="relative h-64 overflow-hidden bg-black/40">
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1 group-hover:text-amber-500 transition-colors uppercase tracking-tight">
                      {member.name}
                    </h3>
                    <p className="text-[11px] font-semibold text-amber-500 mb-2 uppercase tracking-wider">{member.position}</p>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                      {member.biography}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="hover:text-white flex items-center gap-1 text-[11px]"
                        title={member.email}
                      >
                        <Mail className="w-3.5 h-3.5 text-amber-500" />
                        <span className="truncate max-w-[120px]">{member.email}</span>
                      </a>
                    )}
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 hover:text-amber-500 transition-colors"
                        aria-label={`${member.name} LinkedIn Profile`}
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct CTA */}
      <section className="py-14 bg-amber-500 text-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-black mb-2">
            Partner with East Africa’s Premier Tier-1 Contractor
          </h2>
          <p className="text-black/80 font-medium text-xs sm:text-sm mb-6 leading-relaxed">
            Whether you are preparing a commercial high-rise tender, an infrastructure concession, or a master-planned residential community, our team is ready to assist.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/request-quote"
              className="px-6 py-3 bg-black hover:bg-black/90 text-white rounded-sm font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
            >
              Request a Project Quotation
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 bg-white hover:bg-white/90 text-black rounded-sm font-bold text-xs uppercase tracking-wider border border-black/10 transition-colors"
            >
              Speak with Head of Engineering
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
