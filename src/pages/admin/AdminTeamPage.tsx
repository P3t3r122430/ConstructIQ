import React, { useState, useEffect, useRef } from 'react';
import { dataService } from '../../services/dataService';
import { useToast } from '../../context/ToastContext';
import { TeamMember } from '../../types/database';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Upload, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Sparkles, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';

const TEAM_AVATAR_PRESETS = [
  { label: 'Lead Structural Engineer (Male)', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80' },
  { label: 'Chief Operations Officer (Female)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80' },
  { label: 'Head of Civil Infrastructure (Male)', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80' },
  { label: 'Senior Architect (Female)', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80' },
  { label: 'Quantity Surveyor (Male)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80' },
  { label: 'BIM Coordinator (Female)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80' },
  { label: 'Geotechnical Specialist (Male)', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80' },
  { label: 'Project Director (Male)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80' },
];

export const AdminTeamPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const { success, error } = useToast();

  const [imageTab, setImageTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: 'Engineering & Structural',
    bio: '',
    image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
    email: '',
    phone: '',
    linkedin_url: '',
    display_order: 1,
    is_active: true
  });

  const fetchTeam = async () => {
    setLoading(true);
    const list = await dataService.getTeamMembers(false);
    setTeam(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openCreateModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      department: 'Engineering & Structural',
      bio: '',
      image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
      email: '',
      phone: '',
      linkedin_url: '',
      display_order: team.length + 1,
      is_active: true
    });
    setImageTab('upload');
    setIsModalOpen(true);
  };

  const openEditModal = (m: TeamMember) => {
    setEditingMember(m);
    setFormData({
      name: m.name,
      role: m.position,
      department: 'Engineering',
      bio: m.biography || '',
      image_url: m.image_url,
      email: m.email || '',
      phone: m.phone || '',
      linkedin_url: m.linkedin_url || '',
      display_order: m.display_order,
      is_active: m.active
    });
    if (m.image_url && TEAM_AVATAR_PRESETS.some(p => p.url === m.image_url)) {
      setImageTab('presets');
    } else if (m.image_url) {
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
      const url = await dataService.uploadFile('team-portraits', file);
      setFormData(prev => ({ ...prev, image_url: url }));
      success('Image Uploaded', 'Team headshot image uploaded.');
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
    if (!formData.name || !formData.role) {
      error('Validation error', 'Please fill in name and role.');
      return;
    }

    try {
      const payload: Partial<TeamMember> = {
        name: formData.name,
        position: formData.role,
        biography: formData.bio || null,
        image_url: formData.image_url,
        email: formData.email || null,
        phone: formData.phone || null,
        linkedin_url: formData.linkedin_url || null,
        display_order: Number(formData.display_order),
        active: formData.is_active
      };

      if (editingMember) {
        await dataService.updateTeamMember(editingMember.id, payload);
        success('Team Member Updated', `${formData.name} updated.`);
      } else {
        await dataService.createTeamMember(payload);
        success('Team Member Added', `${formData.name} added to executive directory.`);
      }

      setIsModalOpen(false);
      fetchTeam();
    } catch (err: unknown) {
      error('Operation failed', err instanceof Error ? err.message : 'Error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete team profile for ${name}?`)) {
      try {
        await dataService.deleteTeamMember(id);
        success('Profile Deleted', `${name} removed from roster`);
        fetchTeam();
      } catch (err: unknown) {
        error('Delete failed', err instanceof Error ? err.message : 'Error');
      }
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-1">
            Personnel & Leadership
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Engineering & Executive Team
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage principal engineers, quantity surveyors, and project directors.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Team Member
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading roster...</div>
        ) : team.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-400">No team members found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">Engineer / Executive</th>
                  <th className="px-6 py-4">Role & Department</th>
                  <th className="px-6 py-4">Direct Contact</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {team.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.image_url}
                          alt={m.name}
                          className="w-10 h-10 rounded-full object-cover border border-amber-500/30 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div>
                          <p className="font-bold text-white">{m.name}</p>
                          <p className="text-[11px] text-amber-500 font-mono">{m.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-300">Structural & Civil Division</p>
                    </td>
                    <td className="px-6 py-4 space-y-0.5">
                      <p className="text-[11px] text-slate-300 font-mono">{m.email || '—'}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{m.phone || '—'}</p>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-400">
                      #{m.display_order}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          m.active
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {m.active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(m)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(m.id, m.name)}
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
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingMember ? 'Edit Team Member Profile' : 'Add Executive Engineer'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update credentials, designation, and public headshot.
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name & Title *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Eng. David Mwangi, PE"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Job Position / Designation *
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Principal Structural Engineer"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Direct Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="engineer@apexbuild.co.ke"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* IMAGE SELECTION TABS */}
              <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                    Portrait & Headshot Image
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
                    Preset Portraits
                  </button>
                </div>

                {/* Tab 1: Upload */}
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
                          <p className="text-xs text-slate-300 font-semibold">Uploading portrait...</p>
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
                              PNG, JPG, WEBP up to 5MB (Professional headshots)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 2: URL */}
                {imageTab === 'url' && (
                  <div className="space-y-2 pt-2">
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                )}

                {/* Tab 3: Presets */}
                {imageTab === 'presets' && (
                  <div className="space-y-2 pt-2">
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                      {TEAM_AVATAR_PRESETS.map((preset, idx) => {
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

                {/* Preview */}
                {formData.image_url && (
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
                        {formData.name || 'Headshot Selected'}
                      </p>
                      <p className="text-[10px] text-emerald-400 font-medium truncate">
                        Image ready for profile
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
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Professional Biography
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Over 18 years specializing in high-rise geotechnical solutions..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="team-active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-amber-500"
                  />
                  <label htmlFor="team-active" className="text-xs text-slate-300 font-semibold cursor-pointer">
                    Visible on Public About Page
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
                    Save Member
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
