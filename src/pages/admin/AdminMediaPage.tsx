import React, { useState } from 'react';
import { dataService } from '../../services/dataService';
import { useToast } from '../../context/ToastContext';
import { ImageIcon, Upload, Copy, Check, ExternalLink, HardDrive, FileText, Trash2 } from 'lucide-react';

export const AdminMediaPage: React.FC = () => {
  const [selectedBucket, setSelectedBucket] = useState<'project-images' | 'quote-attachments' | 'company-assets'>('project-images');
  const [uploading, setUploading] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const { success, error } = useToast();

  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; url: string; size: string; type: string }>>([
    {
      name: 'horizon-tower-facade-highres.jpg',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
      size: '2.4 MB',
      type: 'image/jpeg'
    },
    {
      name: 'geotechnical-foundation-piling.jpg',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f7?w=1200&auto=format&fit=crop&q=80',
      size: '3.1 MB',
      type: 'image/jpeg'
    },
    {
      name: 'structural-steel-superstructure.jpg',
      url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&auto=format&fit=crop&q=80',
      size: '1.8 MB',
      type: 'image/jpeg'
    },
    {
      name: 'corporate-headquarters-aerial.jpg',
      url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1200&auto=format&fit=crop&q=80',
      size: '4.2 MB',
      type: 'image/jpeg'
    }
  ]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setUploading(true);
    try {
      const publicUrl = await dataService.uploadFile(selectedBucket, file);
      setUploadedFiles(prev => [
        {
          name: file.name,
          url: publicUrl,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: file.type
        },
        ...prev
      ]);
      success('File Uploaded', `${file.name} uploaded to ${selectedBucket}.`);
    } catch (err: unknown) {
      error('Upload Failed', err instanceof Error ? err.message : 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    success('URL Copied', 'Asset public link copied to clipboard.');
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl w-full mx-auto">
      <div>
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-1">
          Supabase Storage & Media Buckets
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Digital Asset Management
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload and organize site photography, blueprints, tender PDFs, and marketing assets.
        </p>
      </div>

      {/* Bucket Selector & Uploader */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-amber-400" />
            Storage Buckets
          </h3>
          <div className="space-y-2">
            {[
              { id: 'project-images', name: 'project-images', desc: 'Public site photography & case studies' },
              { id: 'quote-attachments', name: 'quote-attachments', desc: 'Secure client drawings & BOQs' },
              { id: 'company-assets', name: 'company-assets', desc: 'Logos, whitepapers & brand media' }
            ].map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBucket(b.id as any)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  selectedBucket === b.id
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <p className="text-xs font-bold font-mono text-white">{b.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{b.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Zone (Col 2-3) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
          <label className="w-full border-2 border-dashed border-slate-800 hover:border-amber-500 rounded-2xl p-8 cursor-pointer transition-colors flex flex-col items-center justify-center gap-3 bg-slate-950/60">
            <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                {uploading ? 'Uploading to Supabase Storage...' : `Upload new asset to '${selectedBucket}'`}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Drag and drop or browse files (PNG, JPG, PDF, DWG up to 25MB)
              </p>
            </div>
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <h3 className="text-sm font-bold text-white">Active Media Assets ({uploadedFiles.length})</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {uploadedFiles.map((file, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden group hover:border-slate-700 transition-colors"
            >
              <div className="h-40 overflow-hidden bg-slate-900 relative">
                {file.type.startsWith('image/') || file.name.endsWith('.jpg') ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-12 h-12 text-slate-600" />
                  </div>
                )}
              </div>

              <div className="p-3 space-y-2">
                <p className="text-xs font-bold text-white truncate" title={file.name}>
                  {file.name}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{file.size}</span>
                  <span className="font-mono text-amber-500/80">{selectedBucket}</span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(file.url)}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                  >
                    {copiedUrl === file.url ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                    title="Open Full Resolution"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
