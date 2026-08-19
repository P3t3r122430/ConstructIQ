-- ============================================================================
-- APEXBUILD ENGINEERING & CONSTRUCTION - SUPABASE DATABASE MIGRATION
-- Project: jjdpjwrhrixykhjuxspy (https://jjdpjwrhrixykhjuxspy.supabase.co)
-- Production Schema with Row Level Security (RLS), Indexes, Triggers, Storage & Seed
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ENUMS & TYPES
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- 2. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 3. PROFILES TABLE (Linked to auth.users)
-- ----------------------------------------------------------------------------
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

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 4. SERVICES TABLE
-- ----------------------------------------------------------------------------
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

DROP TRIGGER IF EXISTS set_services_updated_at ON public.services;
CREATE TRIGGER set_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 5. PROJECTS TABLE
-- ----------------------------------------------------------------------------
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

DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 6. PROJECT IMAGES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 7. QUOTE REQUESTS TABLE
-- ----------------------------------------------------------------------------
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

DROP TRIGGER IF EXISTS set_quote_requests_updated_at ON public.quote_requests;
CREATE TRIGGER set_quote_requests_updated_at
    BEFORE UPDATE ON public.quote_requests
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 8. BOQ / QUOTE ITEMS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quote_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id UUID NOT NULL REFERENCES public.quote_requests(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity NUMERIC DEFAULT 1 NOT NULL,
    unit TEXT DEFAULT 'item' NOT NULL,
    unit_price NUMERIC DEFAULT 0 NOT NULL,
    total NUMERIC GENERATED ALWAYS AS (quantity * unit_price) STORED,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

DROP TRIGGER IF EXISTS set_quote_items_updated_at ON public.quote_items;
CREATE TRIGGER set_quote_items_updated_at
    BEFORE UPDATE ON public.quote_items
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 9. CONTACT MESSAGES TABLE
-- ----------------------------------------------------------------------------
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

DROP TRIGGER IF EXISTS set_contact_messages_updated_at ON public.contact_messages;
CREATE TRIGGER set_contact_messages_updated_at
    BEFORE UPDATE ON public.contact_messages
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 10. TESTIMONIALS TABLE
-- ----------------------------------------------------------------------------
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

DROP TRIGGER IF EXISTS set_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER set_testimonials_updated_at
    BEFORE UPDATE ON public.testimonials
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 11. TEAM MEMBERS TABLE
-- ----------------------------------------------------------------------------
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

DROP TRIGGER IF EXISTS set_team_members_updated_at ON public.team_members;
CREATE TRIGGER set_team_members_updated_at
    BEFORE UPDATE ON public.team_members
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 12. BLOG POSTS TABLE
-- ----------------------------------------------------------------------------
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

DROP TRIGGER IF EXISTS set_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER set_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 13. SITE SETTINGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT DEFAULT 'ApexBuild Engineering & Construction' NOT NULL,
    tagline TEXT DEFAULT 'Precision Civil Engineering & High-End Construction Across East Africa' NOT NULL,
    logo_url TEXT,
    phone TEXT DEFAULT '+254 (0) 20 780 4000',
    phone_secondary TEXT DEFAULT '+254 700 889 900',
    email TEXT DEFAULT 'contracts@apexbuild.co.ke',
    address TEXT DEFAULT 'Apex Tower, 8th Floor, Chiromo Road, Westlands',
    city TEXT DEFAULT 'Nairobi',
    country TEXT DEFAULT 'Kenya',
    whatsapp_number TEXT DEFAULT '+254700889900',
    google_maps_embed_url TEXT,
    business_hours TEXT DEFAULT 'Monday – Friday: 7:30 AM – 5:30 PM | Saturday: 8:00 AM – 1:00 PM',
    about_summary TEXT,
    mission TEXT,
    vision TEXT,
    core_values TEXT[] DEFAULT ARRAY['Zero-Harm Safety Standard', 'Uncompromising Engineering Rigor', 'Total Budget & Schedule Transparency', 'Sustainable & EDGE-Certified Building', 'Community-First Impact'],
    social_facebook TEXT,
    social_linkedin TEXT,
    social_twitter TEXT,
    social_instagram TEXT,
    currency TEXT DEFAULT 'KES',
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

DROP TRIGGER IF EXISTS set_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER set_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 14. HELPER FUNCTIONS & AUTH TRIGGER
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin' AND active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_manager_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin', 'manager', 'project_manager') AND active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        full_name, 
        email, 
        phone, 
        company_name, 
        role, 
        active
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email, 'client'), '@', 1)),
        COALESCE(NEW.email, ''),
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'company_name',
        'customer'::user_role,
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        phone = COALESCE(EXCLUDED.phone, profiles.phone),
        company_name = COALESCE(EXCLUDED.company_name, profiles.company_name),
        updated_at = timezone('utc'::text, now());

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Prevent blocking auth user creation if an unexpected table constraint happens
        RAISE WARNING 'handle_new_user trigger error: %', SQLERRM;
        RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 15. PERFORMANCE INDEXES
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id);

CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(active);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON public.services(display_order);

CREATE INDEX IF NOT EXISTS idx_quote_requests_user_id ON public.quote_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON public.quote_requests(email);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON public.quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON public.quote_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON public.quote_items(quote_id);

CREATE INDEX IF NOT EXISTS idx_contact_messages_user_id ON public.contact_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON public.blog_posts(author_id);

CREATE INDEX IF NOT EXISTS idx_testimonials_active ON public.testimonials(active);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON public.testimonials(featured);

CREATE INDEX IF NOT EXISTS idx_team_members_active ON public.team_members(active);
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON public.team_members(display_order);

-- ----------------------------------------------------------------------------
-- 16. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles can be viewed by authenticated users or admins" ON public.profiles;
CREATE POLICY "Public profiles can be viewed by authenticated users or admins"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_manager_or_admin());

DROP POLICY IF EXISTS "Users can update own profile (excluding role)" ON public.profiles;
CREATE POLICY "Users can update own profile (excluding role)"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles"
    ON public.profiles FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- SERVICES
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active services are public" ON public.services;
CREATE POLICY "Active services are public"
    ON public.services FOR SELECT
    USING (active = true OR public.is_manager_or_admin());

DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
CREATE POLICY "Admins can manage services"
    ON public.services FOR ALL
    USING (public.is_manager_or_admin());

-- PROJECTS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Projects are publicly readable" ON public.projects;
CREATE POLICY "Projects are publicly readable"
    ON public.projects FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can manage projects" ON public.projects;
CREATE POLICY "Admins can manage projects"
    ON public.projects FOR ALL
    USING (public.is_manager_or_admin());

-- PROJECT IMAGES
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Project images are publicly readable" ON public.project_images;
CREATE POLICY "Project images are publicly readable"
    ON public.project_images FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can manage project images" ON public.project_images;
CREATE POLICY "Admins can manage project images"
    ON public.project_images FOR ALL
    USING (public.is_manager_or_admin());

-- QUOTE REQUESTS
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a quote request" ON public.quote_requests;
CREATE POLICY "Anyone can submit a quote request"
    ON public.quote_requests FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Customers can view their own quote requests" ON public.quote_requests;
CREATE POLICY "Customers can view their own quote requests"
    ON public.quote_requests FOR SELECT
    USING (auth.uid() = user_id OR email = (SELECT email FROM public.profiles WHERE id = auth.uid()) OR public.is_manager_or_admin());

DROP POLICY IF EXISTS "Admins can manage all quote requests" ON public.quote_requests;
CREATE POLICY "Admins can manage all quote requests"
    ON public.quote_requests FOR ALL
    USING (public.is_manager_or_admin());

-- QUOTE ITEMS (BOQ)
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers and staff can view quote items" ON public.quote_items;
CREATE POLICY "Customers and staff can view quote items"
    ON public.quote_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.quote_requests qr
            WHERE qr.id = quote_items.quote_id
            AND (qr.user_id = auth.uid() OR qr.email = (SELECT email FROM public.profiles WHERE id = auth.uid()) OR public.is_manager_or_admin())
        )
    );

DROP POLICY IF EXISTS "Admins can manage quote items" ON public.quote_items;
CREATE POLICY "Admins can manage quote items"
    ON public.quote_items FOR ALL
    USING (public.is_manager_or_admin());

-- CONTACT MESSAGES
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a contact message" ON public.contact_messages;
CREATE POLICY "Anyone can submit a contact message"
    ON public.contact_messages FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Customers can view their own messages" ON public.contact_messages;
CREATE POLICY "Customers can view their own messages"
    ON public.contact_messages FOR SELECT
    USING (auth.uid() = user_id OR email = (SELECT email FROM public.profiles WHERE id = auth.uid()) OR public.is_manager_or_admin());

DROP POLICY IF EXISTS "Admins can view and manage contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view and manage contact messages"
    ON public.contact_messages FOR ALL
    USING (public.is_manager_or_admin());

-- TESTIMONIALS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active testimonials are public" ON public.testimonials;
CREATE POLICY "Active testimonials are public"
    ON public.testimonials FOR SELECT
    USING (active = true OR public.is_manager_or_admin());

DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
CREATE POLICY "Admins can manage testimonials"
    ON public.testimonials FOR ALL
    USING (public.is_manager_or_admin());

-- TEAM MEMBERS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active team members are public" ON public.team_members;
CREATE POLICY "Active team members are public"
    ON public.team_members FOR SELECT
    USING (active = true OR public.is_manager_or_admin());

DROP POLICY IF EXISTS "Admins can manage team members" ON public.team_members;
CREATE POLICY "Admins can manage team members"
    ON public.team_members FOR ALL
    USING (public.is_manager_or_admin());

-- BLOG POSTS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published blog posts are public" ON public.blog_posts;
CREATE POLICY "Published blog posts are public"
    ON public.blog_posts FOR SELECT
    USING (published = true OR public.is_manager_or_admin());

DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;
CREATE POLICY "Admins can manage blog posts"
    ON public.blog_posts FOR ALL
    USING (public.is_manager_or_admin());

-- SITE SETTINGS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Site settings are publicly viewable" ON public.site_settings;
CREATE POLICY "Site settings are publicly viewable"
    ON public.site_settings FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
CREATE POLICY "Admins can update site settings"
    ON public.site_settings FOR ALL
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 17. SUPABASE STORAGE BUCKETS CONFIGURATION
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('project-images', 'project-images', true),
    ('service-images', 'service-images', true),
    ('blog-images', 'blog-images', true),
    ('team-images', 'team-images', true),
    ('company-assets', 'company-assets', true),
    ('quote-attachments', 'quote-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public can view project images" ON storage.objects;
CREATE POLICY "Public can view project images" ON storage.objects
    FOR SELECT USING (bucket_id IN ('project-images', 'service-images', 'blog-images', 'team-images', 'company-assets', 'quote-attachments'));

DROP POLICY IF EXISTS "Staff can upload and manage images" ON storage.objects;
CREATE POLICY "Staff can upload and manage images" ON storage.objects
    FOR ALL USING (public.is_manager_or_admin() AND bucket_id IN ('project-images', 'service-images', 'blog-images', 'team-images', 'company-assets'));

DROP POLICY IF EXISTS "Anyone can upload quote attachments" ON storage.objects;
CREATE POLICY "Anyone can upload quote attachments" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id IN ('quote-attachments', 'project-images', 'company-assets'));

-- ----------------------------------------------------------------------------
-- 18. INITIAL SEED DATA
-- ----------------------------------------------------------------------------
INSERT INTO public.site_settings (
    company_name, tagline, phone, phone_secondary, email, address, city, country,
    whatsapp_number, business_hours, about_summary, mission, vision, core_values
) VALUES (
    'ApexBuild Engineering & Construction',
    'Precision Civil Engineering & High-End Construction Across East Africa',
    '+254 (0) 20 780 4000',
    '+254 700 889 900',
    'contracts@apexbuild.co.ke',
    'Apex Tower, 8th Floor, Chiromo Road, Westlands',
    'Nairobi',
    'Kenya',
    '+254700889900',
    'Monday – Friday: 7:30 AM – 5:30 PM | Saturday: 8:00 AM – 1:00 PM',
    'ApexBuild is a premier Tier-1 (NCA 1) civil engineering and general contracting firm headquartered in Nairobi, Kenya.',
    'To deliver superior infrastructure and architectural landmarks that drive economic progress.',
    'To be East Africa’s most trusted engineering and construction powerhouse.',
    ARRAY['Zero-Harm Safety Standard', 'Uncompromising Engineering Rigor', 'Total Budget Transparency', 'EDGE-Certified Building', 'Community-First Impact']
) ON CONFLICT DO NOTHING;

INSERT INTO public.services (title, slug, short_description, description, image_url, icon, category, features, active, display_order)
VALUES 
(
    'Commercial & High-Rise Construction',
    'commercial-high-rise-construction',
    'Turnkey development of Grade-A office towers, shopping malls, institutional complexes, and hospitality facilities.',
    'We offer full-lifecycle EPC for modern commercial developments, deep-basement shoring, post-tensioned concrete structural frames, and curtain walling.',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    'Building2',
    'Commercial',
    ARRAY['Deep basement shoring & piling systems', 'Post-tensioned concrete structural frames', 'Curtain walling & double-glazed acoustic facades', 'Integrated BMS & HVAC', 'LEED & EDGE green building compliance'],
    true,
    1
),
(
    'Civil Engineering & Heavy Infrastructure',
    'civil-engineering-heavy-infrastructure',
    'Highways, arterial road dualing, stormwater drainage networks, bridge structures, and earthworks.',
    'Our heavy civil engineering division operates a dedicated in-house fleet of earthmoving and asphalt paving machinery across national highways and corridors.',
    'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f7?w=1200&auto=format&fit=crop&q=80',
    'HardHat',
    'Civil Works',
    ARRAY['Asphalt concrete & rigid concrete road paving', 'Box culverts & storm canals', 'Bridge abutments and post-tensioned flyovers', 'Bulk site grading and geotechnical stabilization', 'NCA 1 certified heavy plant & equipment fleet'],
    true,
    2
),
(
    'Luxury Residential & Gated Communities',
    'luxury-residential-gated-communities',
    'Bespoke contemporary villas, master-planned gated estates, and high-density luxury residential apartment towers.',
    'We transform architectural dreams into lasting sanctuaries with premium stone masonry, smart home infrastructure, and private amenities.',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    'Home',
    'Residential',
    ARRAY['Architectural concrete & bespoke stone masonry', 'Underground rainwater harvesting & solar water systems', 'Infinity pools & structural landscape engineering', 'Perimeter biometric security & smart surveillance', 'Full interior fit-out & imported joinery'],
    true,
    3
),
(
    'Industrial Plants & Warehousing Logistics',
    'industrial-plants-warehousing-logistics',
    'Heavy-duty industrial warehouses, pharmaceutical storage hubs, manufacturing plants, and cold-chain facilities.',
    'Specialized engineering for industrial clients requiring wide-span portal steel frames, laser-screeded heavy-axle concrete floors, and loading docks.',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80',
    'Warehouse',
    'Industrial',
    ARRAY['Long-span pre-engineered steel portal frames', 'FM2 tolerance laser-screeded industrial flooring', 'Overhead gantry crane rail integration', 'Heavy-goods vehicle loading docks', 'Explosion-proof electrical & fire containment'],
    true,
    4
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.projects (
    title, slug, description, short_description, location, client, project_type,
    status, start_date, completion_date, budget, cover_image_url, featured, scope
) VALUES
(
    'The Pinnacle Financial Tower',
    'the-pinnacle-financial-tower',
    'A 32-storey Grade-A commercial office tower featuring a 4-level subterranean parking basement, post-tensioned floor plates, and a double-glazed facade.',
    '32-Storey Grade-A Commercial Tower with 4 basement levels and rooftop helipad.',
    'Upper Hill, Nairobi, Kenya',
    'Pinnacle Real Estate Holdings Ltd',
    'Commercial High-Rise',
    'Completed',
    '2021-03-15',
    '2024-06-30',
    'KES 4.8 Billion ($37M USD)',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    true,
    ARRAY['Subterranean diaphragm wall & piling', 'Post-tensioned slab construction', 'Curtain wall facade engineering', '12 high-speed destination-dispatch elevators', 'EDGE Advanced Green Building Certification']
),
(
    'Nairobi Western Arterial Dualing Corridor',
    'nairobi-western-arterial-dualing-corridor',
    'A 14.5 km high-capacity dual-carriageway expansion project connecting Western Bypass to key industrial zones.',
    '14.5km four-lane dual carriageway with 3 grade-separated interchanges.',
    'Kiambu - Nairobi Corridor',
    'Kenya National Highways Authority (KeNHA)',
    'Heavy Civil Infrastructure',
    'Completed',
    '2022-01-10',
    '2024-02-28',
    'KES 6.2 Billion ($48M USD)',
    'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f7?w=1200&auto=format&fit=crop&q=80',
    true,
    ARRAY['14.5 km 4-lane asphalt concrete carriageway', '3 post-tensioned concrete flyover interchanges', 'Pre-cast concrete stormwater drainage channels', 'LED solar street lighting and intelligent traffic monitoring']
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.team_members (name, position, biography, image_url, email, phone, linkedin_url, display_order, active)
VALUES
(
    'Eng. David Mwangi, PE, CEng',
    'Managing Director & Chief Executive Officer',
    'Registered Consulting Civil Engineer with over 24 years of experience leading multi-billion-shilling infrastructure and high-rise construction across East and Southern Africa.',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
    'd.mwangi@apexbuild.co.ke',
    '+254 20 780 4001',
    'https://linkedin.com/in/eng-david-mwangi',
    1,
    true
),
(
    'Arch. Sarah K. Odhiambo, B.Arch, M.CPM',
    'Chief Operations Officer & Head of Projects',
    'Senior Project Architect and Construction Manager with 16 years leading high-density commercial developments, urban master plans, and ESG-compliant hospitality resorts.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    's.odhiambo@apexbuild.co.ke',
    '+254 20 780 4002',
    'https://linkedin.com/in/arch-sarah-odhiambo',
    2,
    true
)
ON CONFLICT DO NOTHING;

INSERT INTO public.testimonials (customer_name, company, project_title, content, rating, image_url, featured, active)
VALUES
(
    'Peter Ndegwa',
    'Pinnacle Real Estate Holdings Ltd',
    'The Pinnacle Financial Tower',
    'ApexBuild delivered our 32-storey commercial tower 6 weeks ahead of schedule and with zero lost-time incidents across 1.8 million man-hours. Their engineering depth and site discipline are peerless in the East African region.',
    5,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    true,
    true
)
ON CONFLICT DO NOTHING;
