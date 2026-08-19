import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { Project, ProjectImage } from '../../types/database';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  FileText, 
  X, 
  Image as ImageIcon,
  ShieldCheck
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<ProjectImage | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    dataService.getProjectBySlug(slug).then((p) => {
      setProject(p);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading project case study...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">The requested landmark project case study could not be located.</p>
        <Link to="/projects" className="px-6 py-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold text-sm">
          Return to Projects Portfolio
        </Link>
      </div>
    );
  }

  const allImages: ProjectImage[] = [
    {
      id: 'cover',
      project_id: project.id,
      image_url: project.cover_image_url,
      caption: `${project.title} - Main Perspective`,
      display_order: 0,
      created_at: project.created_at
    },
    ...(project.images || [])
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Header Banner */}
      <section className="relative py-20 bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src={project.cover_image_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Projects
          </Link>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {project.project_type}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  project.status === 'Completed'
                    ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950/90 text-amber-400 border border-amber-800'
                }`}
              >
                {project.status}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              {project.title}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
              {project.location}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Content (Col 1 & 2) */}
            <div className="lg:col-span-2 space-y-12">
              {/* Main Cover Image */}
              <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl h-96 sm:h-[480px]">
                <img
                  src={project.cover_image_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Project Overview Narrative */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <h2 className="text-2xl font-black text-white mb-4">Project Overview & Engineering Highlights</h2>
                <div className="text-slate-300 text-sm leading-relaxed space-y-4">
                  <p>{project.description}</p>
                </div>
              </div>

              {/* Scope of Work */}
              {project.scope && project.scope.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                  <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-500" />
                    Key Engineering Scope & Deliverables
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.scope.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-xs font-medium text-slate-200">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Multi-Image Gallery */}
              {allImages.length > 1 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                  <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-amber-500" />
                    High-Resolution Site & Architectural Gallery
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allImages.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedGalleryImage(img)}
                        className="relative h-44 rounded-xl overflow-hidden cursor-pointer group border border-slate-800 hover:border-amber-500/50 transition-all shadow-md"
                      >
                        <img
                          src={img.image_url}
                          alt={img.caption || `Site image ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <p className="text-[11px] text-white font-medium truncate">{img.caption || 'Click to view high-res'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar Specs (Col 3) */}
            <div className="space-y-8">
              {/* Project Specifications Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-base font-black text-white uppercase tracking-wider mb-6 pb-3 border-b border-slate-800">
                  Project Specifications
                </h3>

                <ul className="space-y-4 text-xs">
                  {project.client && (
                    <li className="flex justify-between items-start pb-3 border-b border-slate-800/60">
                      <span className="text-slate-400">Client / Developer</span>
                      <span className="text-white font-semibold text-right">{project.client}</span>
                    </li>
                  )}
                  <li className="flex justify-between items-start pb-3 border-b border-slate-800/60">
                    <span className="text-slate-400">Location</span>
                    <span className="text-white font-semibold text-right">{project.location}</span>
                  </li>
                  <li className="flex justify-between items-start pb-3 border-b border-slate-800/60">
                    <span className="text-slate-400">Sector</span>
                    <span className="text-amber-400 font-semibold">{project.project_type}</span>
                  </li>
                  <li className="flex justify-between items-start pb-3 border-b border-slate-800/60">
                    <span className="text-slate-400">Status</span>
                    <span className="text-white font-semibold">{project.status}</span>
                  </li>
                  {project.budget && (
                    <li className="flex justify-between items-start pb-3 border-b border-slate-800/60">
                      <span className="text-slate-400">Project Value</span>
                      <span className="text-amber-400 font-mono font-bold">{project.budget}</span>
                    </li>
                  )}
                  {project.start_date && (
                    <li className="flex justify-between items-start pb-3 border-b border-slate-800/60">
                      <span className="text-slate-400">Commencement</span>
                      <span className="text-white font-semibold">{project.start_date}</span>
                    </li>
                  )}
                  {project.completion_date && (
                    <li className="flex justify-between items-start pb-3 border-b border-slate-800/60">
                      <span className="text-slate-400">Completion</span>
                      <span className="text-white font-semibold">{project.completion_date}</span>
                    </li>
                  )}
                </ul>

                {/* Direct CTA */}
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <Link
                    to={`/request-quote?project_type=${encodeURIComponent(project.project_type)}`}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md"
                  >
                    <FileText className="w-4 h-4" />
                    Request Quote for Similar Project
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedGalleryImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedGalleryImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedGalleryImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedGalleryImage.image_url}
              alt={selectedGalleryImage.caption || 'Gallery preview'}
              className="max-w-full max-h-[75vh] object-contain rounded-xl border border-slate-800 shadow-2xl"
            />
            {selectedGalleryImage.caption && (
              <p className="mt-4 text-sm text-slate-300 font-medium text-center">
                {selectedGalleryImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
