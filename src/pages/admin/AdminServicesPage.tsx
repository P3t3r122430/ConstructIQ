import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { useToast } from '../../context/ToastContext';
import { Service } from '../../types/database';
import { Wrench, Plus, Edit, Trash2, CheckCircle2, X, Upload } from 'lucide-react';

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Commercial',
    icon_name: 'Building2',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f7?w=1200&auto=format&fit=crop&q=80',
    short_description: '',
    description: '',
    features: [] as string[],
    featuresInput: '',
    display_order: 1,
    is_active: true
  });

  const fetchServices = async () => {
    setLoading(true);
    const list = await dataService.getServices(false);
    setServices(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Commercial',
      icon_name: 'Building2',
      image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f7?w=1200&auto=format&fit=crop&q=80',
      short_description: '',
      description: '',
      features: ['Full Turnkey Procurement', 'Eurocode Structural Compliance', 'Zero Lost-Time Safety Plan'],
      featuresInput: '',
      display_order: services.length + 1,
      is_active: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      category: service.category,
      icon_name: service.icon || 'Building2',
      image_url: service.image_url,
      short_description: service.short_description,
      description: service.description,
      features: service.features || [],
      featuresInput: '',
      display_order: service.display_order,
      is_active: service.active
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    const slugified = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: editingService ? prev.slug : slugified
    }));
  };

  const addFeature = () => {
    if (formData.featuresInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, prev.featuresInput.trim()],
        featuresInput: ''
      }));
    }
  };

  const removeFeature = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.short_description) {
      error('Validation error', 'Please fill in all required fields.');
      return;
    }

    try {
      const payload: Partial<Service> = {
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        icon: formData.icon_name,
        image_url: formData.image_url,
        short_description: formData.short_description,
        description: formData.description,
        features: formData.features,
        display_order: Number(formData.display_order),
        active: formData.is_active
      };

      if (editingService) {
        await dataService.updateService(editingService.id, payload);
        success('Service Updated', `${formData.title} has been updated.`);
      } else {
        await dataService.createService(payload);
        success('Service Created', `${formData.title} added to catalog.`);
      }

      setIsModalOpen(false);
      fetchServices();
    } catch (err: unknown) {
      error('Operation Failed', err instanceof Error ? err.message : 'Could not save service');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Delete service "${title}"?`)) {
      try {
        await dataService.deleteService(id);
        success('Service Deleted', `${title} removed.`);
        fetchServices();
      } catch (err: unknown) {
        error('Delete Failed', err instanceof Error ? err.message : 'Error');
      }
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-1">
            Service Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Engineering Services & Capabilities
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage construction categories, scope descriptions, and technical specifications.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Engineering Service
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading services...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Deliverables Count</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.image_url}
                          alt={s.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                        />
                        <div className="truncate max-w-xs">
                          <p className="font-bold text-white truncate">{s.title}</p>
                          <p className="text-[11px] text-slate-400 font-mono">/{s.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-200">{s.category}</td>
                    <td className="px-6 py-4 text-slate-400">{s.features?.length || 0} items</td>
                    <td className="px-6 py-4 font-mono">{s.display_order}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          s.active
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {s.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(s)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(s.id, s.title)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingService ? `Edit: ${editingService.title}` : 'Add New Service Division'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Turnkey Civil Works & Highway Construction"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Commercial, Residential, Civil Works"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Short Description *
                </label>
                <textarea
                  rows={2}
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full In-Depth Scope & Methodology *
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Key Technical Deliverables & Specifications
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.featuresInput}
                    onChange={(e) => setFormData({ ...formData, featuresInput: e.target.value })}
                    placeholder="e.g. Geotechnical Soil Core Drilling & Analysis"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-slate-950 text-slate-300 border border-slate-800"
                    >
                      {f}
                      <button type="button" onClick={() => removeFeature(i)} className="text-slate-500 hover:text-rose-400">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="service-active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-amber-500"
                  />
                  <label htmlFor="service-active" className="text-xs text-slate-300 font-semibold cursor-pointer">
                    Active in Public Catalog
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
                  >
                    Save Service
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
