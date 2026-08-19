import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { dataService } from '../../services/dataService';
import confetti from 'canvas-confetti';
import { 
  Building2, 
  HardHat, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles,
  Layers,
  Phone,
  Mail,
  User
} from 'lucide-react';

export const RequestQuotePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user, profile } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: profile?.full_name || '',
    email: profile?.email || user?.email || '',
    phone: profile?.phone || '',
    company: profile?.company_name || '',
    project_type: searchParams.get('project_type') || searchParams.get('service') || 'Commercial Construction',
    location: 'Nairobi, Kenya',
    budget: 'KES 50M - 150M ($400k - $1.2M)',
    estimated_area: '',
    preferred_start_date: '',
    description: '',
    attachments: [] as string[],
  });

  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || profile.full_name,
        email: prev.email || profile.email,
        phone: prev.phone || profile.phone || '',
        company: prev.company || profile.company_name || ''
      }));
    }
  }, [profile]);

  const projectTypes = [
    'Commercial Construction',
    'Civil Engineering & Infrastructure',
    'Luxury Residential Estate / Villa',
    'Industrial Facility & Warehousing',
    'Structural Renovation & Retrofitting',
    'Road Works & Paving',
    'Project Management & Consultancy'
  ];

  const budgetTiers = [
    'Below KES 20 Million (< $150k)',
    'KES 20M - 50M ($150k - $400k)',
    'KES 50M - 150M ($400k - $1.2M)',
    'KES 150M - 500M ($1.2M - $3.8M)',
    'KES 500M - 1.5 Billion ($3.8M - $11.5M)',
    'Over KES 1.5 Billion (> $11.5M)'
  ];

  const handleNext = () => {
    if (step === 1 && !formData.project_type) {
      error('Selection Required', 'Please select a project type.');
      return;
    }
    if (step === 3 && !formData.description.trim()) {
      error('Description Required', 'Please provide a brief outline of the project scope.');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      error('Missing Information', 'Please fill in your name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      let uploadedAttachmentUrl = '';
      if (attachmentFile) {
        uploadedAttachmentUrl = await dataService.uploadFile('quote-attachments', attachmentFile);
      }

      const created = await dataService.createQuote({
        user_id: user?.id || null,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company || null,
        project_type: formData.project_type,
        location: formData.location,
        budget: formData.budget,
        estimated_area: formData.estimated_area || null,
        preferred_start_date: formData.preferred_start_date || null,
        description: formData.description,
        status: 'New',
        admin_notes: null,
        attachments: uploadedAttachmentUrl ? [uploadedAttachmentUrl] : []
      });

      setSubmittedQuoteId(created.id);
      success('Quote Request Submitted', `Reference ID: ${created.id}. Our quantity surveying team will review your specifications.`);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe if confetti fails
      }

      setStep(5); // Success step
    } catch (err: unknown) {
      error('Submission Error', err instanceof Error ? err.message : 'Failed to submit quote request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <section className="relative py-12 sm:py-16 bg-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white hover:border-amber-500/40 text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> NCA 1 Certified Estimators
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
              Request an Itemized Engineering & Construction Quote
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Our registered Quantity Surveyors and Structural Engineers will review your site parameters, draft preliminary BOQs, and schedule a technical consultation within 48 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Main Wizard Card */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* Step Progress Indicator (if not completed) */}
          {step < 5 && (
            <div className="mb-8 pb-6 border-b border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                <span className={step >= 1 ? 'text-amber-400' : ''}>1. Project Type</span>
                <span className={step >= 2 ? 'text-amber-400' : ''}>2. Scope & Budget</span>
                <span className={step >= 3 ? 'text-amber-400' : ''}>3. Technical Notes</span>
                <span className={step >= 4 ? 'text-amber-400' : ''}>4. Contact Details</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300 rounded-full"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* STEP 1: Project Type & Location */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">What type of project are you undertaking?</h3>
                <p className="text-xs text-slate-400">Select the primary category of works required.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projectTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, project_type: type })}
                    className={`p-4 rounded-xl text-left text-xs font-semibold border transition-all flex items-start justify-between ${
                      formData.project_type === type
                        ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{type}</span>
                    {formData.project_type === type && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Project Location / City / County
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Westlands, Nairobi or Kilifi County"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2"
                >
                  Continue to Scope & Budget <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Scope & Budget */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Scope & Estimated Investment Range</h3>
                <p className="text-xs text-slate-400">Help us assign the right engineering division and equipment sizing.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Target Budget Range (KES / USD)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {budgetTiers.map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setFormData({ ...formData, budget: tier })}
                      className={`p-3 rounded-xl text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                        formData.budget === tier
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="truncate">{tier}</span>
                      {formData.budget === tier && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Approximate Built Area / Scale (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.estimated_area}
                    onChange={(e) => setFormData({ ...formData, estimated_area: e.target.value })}
                    placeholder="e.g. 4,500 m² or 12 km road"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Target Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.preferred_start_date}
                    onChange={(e) => setFormData({ ...formData, preferred_start_date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2"
                >
                  Continue to Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Technical Notes & Drawings */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Project Scope & Technical Details</h3>
                <p className="text-xs text-slate-400">Describe site conditions, architectural status, and specific requirements.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Project Description & Requirements *
                </label>
                <textarea
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe number of floors, basement levels, structural specifications, preferred finishes, or required handover timeline..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Upload Site Plan, Architectural Drawings, or BOQ (Optional)
                </label>
                <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 text-center bg-slate-950 cursor-pointer">
                  <input
                    type="file"
                    id="attachment-upload"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAttachmentFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <label htmlFor="attachment-upload" className="cursor-pointer block">
                    <Upload className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-white">
                      {attachmentFile ? `Selected: ${attachmentFile.name}` : 'Click or Drag Drawings / BOQ (PDF, DWG, ZIP)'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">Up to 50MB per file</p>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2"
                >
                  Continue to Contact Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Contact & Final Submission */}
          {step === 4 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Your Contact Information</h3>
                <p className="text-xs text-slate-400">Where should our Quantity Surveying team send the formal quotation proposal?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Eng. / Dr. / Mr. / Ms."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Company / Organization (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Prime Properties PLC"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Official Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+254 700 000 000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Summary recap */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-1">
                <p><span className="text-slate-200 font-semibold">Scope:</span> {formData.project_type} in {formData.location}</p>
                <p><span className="text-slate-200 font-semibold">Target Budget:</span> {formData.budget}</p>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting to Supabase...' : 'Submit Quotation Request'}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: Success State */}
          {step === 5 && (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-slate-950 border border-slate-800 text-amber-400 font-mono text-xs font-bold rounded-lg mb-2">
                  Ref: {submittedQuoteId}
                </span>
                <h3 className="text-2xl font-black text-white mb-2">
                  Quote Request Successfully Logged!
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your project specifications have been submitted to ApexBuild's Estimations & Structural Engineering department. A registered Quantity Surveyor has been assigned to your file.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Link
                  to="/account/quotes"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                >
                  Track Quote in Customer Portal
                </Link>
                <Link
                  to="/projects"
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  Explore More Projects
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
