import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { Project, ProjectStatus } from '../../types/database';
import { 
  Building2, 
  Search, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Layers,
  DollarSign
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    dataService.getProjects().then((data) => {
      setProjects(data);
      setFilteredProjects(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let list = [...projects];

    if (selectedType !== 'All') {
      list = list.filter((p) => p.project_type.toLowerCase() === selectedType.toLowerCase());
    }

    if (selectedStatus !== 'All') {
      list = list.filter((p) => p.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => 
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        (p.client && p.client.toLowerCase().includes(q)) ||
        p.short_description.toLowerCase().includes(q)
      );
    }

    setFilteredProjects(list);
  }, [selectedType, selectedStatus, searchQuery, projects]);

  const projectTypes = ['All', 'Commercial', 'Residential', 'Civil Works', 'Industrial', 'Renovation'];
  const projectStatuses = ['All', 'Completed', 'In Progress', 'Planning'];

  return (
    <div className="bg-[#0A0B0D] text-[#F9FAFB] min-h-screen">
      {/* Hero Header */}
      <section className="relative py-16 bg-[#0F1115] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-sm uppercase tracking-widest mb-4">
            <Building2 className="w-3.5 h-3.5" /> Landmark Portfolio
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white mb-3">
            Infrastructure & Construction Portfolio
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            Explore our track record of Grade-A office towers, luxury residential enclaves, heavy civil highways, and industrial facilities delivered across Eastern Africa.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="py-6 bg-[#0F1115]/90 border-b border-white/10 sticky top-[65px] z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects, locations, clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0A0B0D] border border-white/10 rounded-sm pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Type & Status Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
              {/* Type Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {projectTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                      selectedType === type
                        ? 'bg-amber-500 text-black shadow-sm'
                        : 'bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Status Select */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-[#0A0B0D] border border-white/10 text-gray-300 text-xs font-semibold rounded-sm px-3 py-1.5 focus:outline-none focus:border-amber-500 uppercase tracking-wider"
                >
                  <option value="All">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Planning">Planning</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-14 bg-[#0A0B0D]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {loading ? (
            <div className="py-24 text-center text-gray-400 text-xs">Loading projects portfolio...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-24 text-center">
              <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1 uppercase tracking-tight">No Projects Match Your Criteria</h3>
              <p className="text-xs text-gray-400 mb-4">Try clearing filters or search queries.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedType('All');
                  setSelectedStatus('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded-sm uppercase tracking-wider"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-[#0F1115] border border-white/10 rounded-sm overflow-hidden flex flex-col group hover:border-white/20 transition-all duration-300 shadow-xl"
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={project.cover_image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                    />

                    {/* Status & Type Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                        {project.project_type}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                          project.status === 'Completed'
                            ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950/90 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>

                    {project.budget && (
                      <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-md px-2.5 py-0.5 rounded-sm text-xs font-bold text-amber-500 border border-white/10">
                        {project.budget}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{project.location}</span>
                      </div>

                      <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-500 transition-colors uppercase tracking-tight">
                        {project.title}
                      </h3>

                      <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">
                        {project.short_description}
                      </p>

                      {project.client && (
                        <p className="text-xs text-gray-500 mb-4">
                          Client: <span className="text-gray-300 font-medium">{project.client}</span>
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">
                        {project.completion_date ? `Completed: ${project.completion_date}` : 'Status: In Progress'}
                      </span>

                      <Link
                        to={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-wider"
                      >
                        Case Study <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
