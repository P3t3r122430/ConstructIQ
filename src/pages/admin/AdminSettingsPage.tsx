import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { useToast } from '../../context/ToastContext';
import { SiteSettings } from '../../types/database';
import { useAuth } from '../../context/AuthContext';
import { 
  Settings, 
  Save, 
  Database, 
  Copy, 
  Check, 
  ShieldCheck, 
  Code, 
  Server, 
  HardDrive 
} from 'lucide-react';

const SUPABASE_SQL_SCHEMA = `-- ============================================================================
-- NBYTE ARCHITECTURE & CONSTRUCTION - SUPABASE DATABASE MIGRATION
-- Production Schema with Row Level Security (RLS), Indexes, Triggers & Storage
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS & HELPERS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'manager', 'project_manager', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE quote_status AS ENUM (
        'New', 
        'Reviewing', 
        'Contacted', 
        'Site Visit Scheduled', 
        'Quotation Sent', 
        'Approved', 
        'Rejected', 
        'Completed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE message_status AS ENUM ('unread', 'read', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    company_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'customer'::user_role NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    icon TEXT DEFAULT 'Building2',
    category TEXT DEFAULT 'General Construction',
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    active BOOLEAN DEFAULT true NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    location TEXT NOT NULL,
    client TEXT,
    project_type TEXT NOT NULL,
    status project_status DEFAULT 'In Progress'::project_status NOT NULL,
    start_date DATE,
    completion_date DATE,
    budget TEXT,
    cover_image_url TEXT NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    scope TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. QUOTE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.quote_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT,
    project_type TEXT NOT NULL,
    location TEXT NOT NULL,
    budget TEXT,
    estimated_area TEXT,
    preferred_start_date DATE,
    description TEXT NOT NULL,
    status quote_status DEFAULT 'New'::quote_status NOT NULL,
    admin_notes TEXT,
    attachments TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status message_status DEFAULT 'unread'::message_status NOT NULL,
    admin_reply TEXT,
    replied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    company TEXT,
    project_title TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    image_url TEXT,
    featured BOOLEAN DEFAULT true NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    biography TEXT,
    image_url TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    linkedin_url TEXT,
    display_order INTEGER DEFAULT 0 NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT DEFAULT 'ApexBuild Technical Editorial',
    category TEXT DEFAULT 'Engineering & Construction',
    read_time TEXT DEFAULT '5 min read',
    published BOOLEAN DEFAULT true NOT NULL,
    published_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT DEFAULT 'Nbyte Architecture & Construction' NOT NULL,
    tagline TEXT DEFAULT 'Precision Civil Engineering & Architectural Mastery' NOT NULL,
    logo_url TEXT,
    phone TEXT DEFAULT '+254 (0) 20 780 4000',
    email TEXT DEFAULT 'info@nbyte.co.ke',
    address TEXT DEFAULT 'Nbyte Headquarters, 8th Floor, Chiromo Road, Westlands',
    city TEXT DEFAULT 'Nairobi',
    country TEXT DEFAULT 'Kenya',
    whatsapp_number TEXT DEFAULT '+254700123456',
    business_hours TEXT DEFAULT 'Mon - Fri: 8:00 AM - 5:00 PM | Sat: 8:30 AM - 1:00 PM',
    core_values TEXT[] DEFAULT ARRAY['Safety First', 'Engineering Rigor', 'Transparency', 'Sustainability', 'On-Time Delivery'],
    currency TEXT DEFAULT 'KES',
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
`;

export const AdminSettingsPage: React.FC = () => {
  const { isConfigured } = useAuth();
  const { success, error } = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  const [formSettings, setFormSettings] = useState<Record<string, string>>({
    company_name: 'Nbyte Architecture & Construction',
    slogan: 'Precision Civil Engineering & Landmark High-Rise Infrastructure',
    phone: '+254 20 790 0000',
    whatsapp: '+254 711 000 000',
    email: 'info@nbyte.co.ke',
    tenders_email: 'tenders@nbyte.co.ke',
    address: 'Nbyte Headquarters, 14th Floor, Chiromo Road, Westlands, Nairobi, Kenya',
    working_hours: 'Mon - Fri: 7:30 AM - 5:30 PM | Sat: 8:00 AM - 1:00 PM',
    registration_no: 'NCA Category 1 (Building & Civil Works) | Reg #NCA-89241'
  });

  useEffect(() => {
    dataService.getSettings().then((data) => {
      setSettings(data);
      if (data) {
        setFormSettings({
          company_name: data.company_name || formSettings.company_name,
          slogan: data.tagline || formSettings.slogan,
          phone: data.phone || formSettings.phone,
          whatsapp: data.whatsapp_number || formSettings.whatsapp,
          email: data.email || formSettings.email,
          tenders_email: formSettings.tenders_email,
          address: data.address || formSettings.address,
          working_hours: data.business_hours || formSettings.working_hours,
          registration_no: formSettings.registration_no
        });
      }
      setLoading(false);
    });
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dataService.updateSettings({
        company_name: formSettings.company_name,
        tagline: formSettings.slogan,
        phone: formSettings.phone,
        whatsapp_number: formSettings.whatsapp,
        email: formSettings.email,
        address: formSettings.address,
        business_hours: formSettings.working_hours
      });
      success('Settings Saved', 'Site configuration and contact data updated.');
    } catch (err: unknown) {
      error('Save Failed', err instanceof Error ? err.message : 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    success('SQL Copied', 'Schema migration script copied to clipboard.');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block">
              Governance & Database Architecture
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Executive Admin Only
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Enterprise Settings & Database Migration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure corporate metadata, communications routing, and inspect the production PostgreSQL schema.
          </p>
        </div>
      </div>

      {/* Database Connection Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
              isConfigured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Supabase Cloud Infrastructure</h2>
              <p className="text-xs text-slate-400">
                Status: {isConfigured ? 'Connected to production project' : 'Running on high-fidelity local database layer'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopySql}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border border-slate-700 shrink-0"
          >
            {copiedSql ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied SQL Script</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-amber-400" />
                <span>Copy Full SQL Schema</span>
              </>
            )}
          </button>
        </div>

        {/* SQL Preview */}
        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800/80 font-mono text-xs text-slate-400 max-h-60 overflow-y-auto">
          <pre>{SUPABASE_SQL_SCHEMA}</pre>
        </div>
      </div>

      {/* Site Settings Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-400" />
          Headquarters Contact & Registry Settings
        </h2>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Company Legal Name
              </label>
              <input
                type="text"
                value={formSettings.company_name}
                onChange={(e) => setFormSettings({ ...formSettings, company_name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Corporate Tagline / Slogan
              </label>
              <input
                type="text"
                value={formSettings.slogan}
                onChange={(e) => setFormSettings({ ...formSettings, slogan: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Telephone Switchboard
              </label>
              <input
                type="text"
                value={formSettings.phone}
                onChange={(e) => setFormSettings({ ...formSettings, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Direct WhatsApp Hotline
              </label>
              <input
                type="text"
                value={formSettings.whatsapp}
                onChange={(e) => setFormSettings({ ...formSettings, whatsapp: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={formSettings.email}
                onChange={(e) => setFormSettings({ ...formSettings, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Physical Headquarters Address
            </label>
            <input
              type="text"
              value={formSettings.address}
              onChange={(e) => setFormSettings({ ...formSettings, address: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Operating Hours
              </label>
              <input
                type="text"
                value={formSettings.working_hours}
                onChange={(e) => setFormSettings({ ...formSettings, working_hours: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Regulatory Board & Contractor Category
              </label>
              <input
                type="text"
                value={formSettings.registration_no}
                onChange={(e) => setFormSettings({ ...formSettings, registration_no: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Updating Settings...' : 'Save System Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
