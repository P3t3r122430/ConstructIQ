import React, { useState, useEffect, useRef } from 'react';
import { dataService } from '../../services/dataService';
import { useToast } from '../../context/ToastContext';
import { Testimonial } from '../../types/database';
import { 
  MessageSquareQuote, 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  CheckCircle2, 
  X, 
  Upload, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Sparkles, 
  User,
  Loader2
} from 'lucide-react';

const CLIENT_AVATAR_PRESETS = [
  { label: 'Infrastructure Director', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { label: 'Managing Partner', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
  { label: 'Logistics Officer', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
  { label: 'Commercial Developer', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80' },
  { label: 'Real Estate Executive', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80' },
  { label: 'Senior Civil Engineer', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80' },
  { label: 'Institutional Investor', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80' },
  { label: 'Project Principal', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
];

export const AdminTestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const { success, error } = useToast();

  // Tab State for Image Management
  const [imageTab, setImageTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    customer_name: '',
    company: '',
    role: '',
    content: '',
    rating: 5,
    project_title: '',
    image_url: '',
    is_approved: true
  });

  const fetchItems = async () => {
    setLoading(true);
    const list = await dataService.getTestimonials(false);
    setTestimonials(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      customer_name: '',
      company: '',
      role: 'Project Director',
      content: '',
      rating: 5,
      project_title: '',
      image_url: '',
      is_approved: true
    });
    setImageTab('upload');
    setIsModalOpen(true);
  };

  const openEditModal = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      customer_name: item.customer_name,
      company: item.company || '',
      role: '',
      content: item.content,
      rating: item.rating,
      project_title: item.project_title || '',
      image_url: item.image_url || '',
      is_approved: item.active
    });
    // Set appropriate tab based on current image
    if (item.image_url && CLIENT_AVATAR_PRESETS.some(p => p.url === item.image_url)) {
      setImageTab('presets');
    } else if (item.image_url) {
      setImageTab('url');
    } else {
      setImageTab('upload');
    }
    setIsModalOpen(true);
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      error('Invalid File', 'Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      error('File Too Large', 'Image size should be less than 5MB.');
      return;
    }

    setIsUploading(true);
    try {
      const url = await dataService.uploadFile('testimonials', file);
      setFormData(prev => ({ ...prev, image_url: url }));
      success('Image Uploaded', 'Client portrait image uploaded successfully.');
    } catch (err: unknown) {
      error('Upload Failed', err instanceof Error ? err.message : 'Could not upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.content) {
      error('Validation error', 'Please fill in client name and testimonial text.');
      return;
    }

    try {
      const payload: Partial<Testimonial> = {
        customer_name: formData.customer_name,
        company: formData.company || null,
        content: formData.content,
        rating: Number(formData.rating),
        project_title: formData.project_title || null,
        image_url: formData.image_url || null,
        active: formData.is_approved,
        featured: true
      };

      if (editingItem) {
        await dataService.updateTestimonial(editingItem.id, payload);
        success('Review Updated', 'Testimonial saved.');
      } else {
        await dataService.createTestimonial(payload);
        success('Review Created', 'New reference added.');
      }

      setIsModalOpen(false);
      fetchItems();
    } catch (err: unknown) {
      error('Failed to save testimonial', err instanceof Error ? err.message : 'Error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete review from ${name}?`)) {
      try {
        await dataService.deleteTestimonial(id);
        success('Review Deleted', 'Removed from database');
        fetchItems();
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
            Social Proof & Trust
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Client Testimonials & References
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage institutional client references and reviews displayed across the site.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Client Reference
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-400 space-y-3">
            <MessageSquareQuote className="w-10 h-10 text-slate-600 mx-auto" />
            <p>No client testimonials found. Click "Add Client Reference" to create one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Organization & Reference</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {t.image_url ? (
                          <img
                            src={t.image_url}
                            alt={t.customer_name}
                            className="w-10 h-10 rounded-full object-cover border border-amber-500/30 shrink-0"
                            onError={(e) => {
                              // If image fails to load, replace with avatar fallback
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                            {t.customer_name ? t.customer_name.charAt(0).toUpperCase() : 'C'}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white">{t.customer_name}</p>
                          <p className="text-[11px] text-slate-400">{t.company || 'Private Client'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-amber-400">{t.project_title || 'Commercial Project'}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{t.content}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.active
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {t.active ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(t)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                          title="Edit Review"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(t.id, t.customer_name)}
                          className="p-1.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-300 rounded-lg transition-colors"
                          title="Delete Review"
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
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingItem ? 'Edit Client Review' : 'Add Client Review'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update client details, corporate reference, and headshot image.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Basic Client Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    placeholder="e.g. Eng. Peter Kimani"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Director of Infrastructure, Horizon Holdings"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Project Reference
                  </label>
                  <input
                    type="text"
                    value={formData.project_title}
                    onChange={(e) => setFormData({ ...formData, project_title: e.target.value })}
                    placeholder="e.g. Upper Hill Horizon Commercial Tower"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Rating (1-5)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value={5}>5 Stars (Exceptional Delivery)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Satisfactory)</option>
                  </select>
                </div>
              </div>

              {/* TABBED IMAGE MANAGEMENT SECTION */}
              <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                    Client Portrait & Headshot Image
                  </label>
                  {formData.image_url && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image_url: '' })}
                      className="text-[11px] text-rose-400 hover:text-rose-300 hover:underline"
                    >
                      Clear Image
                    </button>
                  )}
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800 gap-2">
                  <button
                    type="button"
                    onClick={() => setImageTab('upload')}
                    className={`pb-2 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                      imageTab === 'upload'
                        ? 'border-amber-500 text-amber-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab('url')}
                    className={`pb-2 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                      imageTab === 'url'
                        ? 'border-amber-500 text-amber-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab('presets')}
                    className={`pb-2 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                      imageTab === 'presets'
                        ? 'border-amber-500 text-amber-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Preset Avatars
                  </button>
                </div>

                {/* Tab 1: Upload File */}
                {imageTab === 'upload' && (
                  <div className="space-y-3 pt-2">
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0]);
                          }
                        }}
                      />
                      {isUploading ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-2">
                          <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                          <p className="text-xs text-slate-300 font-semibold">Processing image upload...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">
                              Click to choose image or drag & drop here
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              PNG, JPG, WEBP up to 5MB (Headshots / Corporate logos)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 2: Direct Image URL */}
                {imageTab === 'url' && (
                  <div className="space-y-2 pt-2">
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/client-photo.jpg"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <p className="text-[11px] text-slate-500">
                      Paste a direct HTTPS URL to the client's photograph or corporate logo.
                    </p>
                  </div>
                )}

                {/* Tab 3: Presets */}
                {imageTab === 'presets' && (
                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] text-slate-400 mb-2">
                      Select from our diverse high-resolution executive client portrait presets:
                    </p>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                      {CLIENT_AVATAR_PRESETS.map((preset, idx) => {
                        const isSelected = formData.image_url === preset.url;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormData({ ...formData, image_url: preset.url })}
                            className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all group ${
                              isSelected
                                ? 'border-amber-500 ring-2 ring-amber-500/30 scale-105'
                                : 'border-slate-800 hover:border-slate-600 opacity-80 hover:opacity-100'
                            }`}
                            title={preset.label}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-full h-full object-cover"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-amber-400 bg-slate-950 rounded-full" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Active Image Preview Card */}
                {formData.image_url ? (
                  <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl mt-3">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/40 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {formData.customer_name || 'Client Avatar'}
                      </p>
                      <p className="text-[10px] text-emerald-400 font-medium truncate">
                        Image attached & ready to publish
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image_url: '' })}
                      className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-300 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-800/60 text-slate-400 text-xs">
                    <User className="w-4 h-4 text-slate-500" />
                    <span>No image attached. Default letter avatar ({formData.customer_name ? formData.customer_name.charAt(0).toUpperCase() : 'C'}) will be used.</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Testimonial Quote *
                </label>
                <textarea
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="ApexBuild executed our 28-storey commercial tower with surgical precision..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="approved-testimonial"
                    checked={formData.is_approved}
                    onChange={(e) => setFormData({ ...formData, is_approved: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-amber-500"
                  />
                  <label htmlFor="approved-testimonial" className="text-xs text-slate-300 font-semibold cursor-pointer">
                    Publish on Website
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all"
                  >
                    {editingItem ? 'Save Changes' : 'Create Review'}
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
