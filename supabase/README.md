# ApexBuild Engineering & Construction - Supabase Setup Guide

## 1. Quick Database Setup

To provision the full PostgreSQL database schema, tables, triggers, and Row Level Security:

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project and navigate to the **SQL Editor**
3. Create a new query and paste the contents of `supabase/migrations/20260818_init_schema.sql`
4. Click **Run**
5. Optionally paste `supabase/migrations/20260818_seed_data.sql` to populate high-fidelity starter projects, services, blog posts, and site settings.

---

## 2. Initial Administrator Setup (Zero In-Code Secrets)

To assign the `admin` role to your first user safely:

### Step 1: Register your Admin User
1. Go to your application's registration page (`/register`) or register in Supabase Auth directly.
2. Sign up with your administrator email (e.g. `admin@apexbuild.co.ke` or your personal email).
3. Confirm the email in Supabase Auth if email confirmations are enabled.

### Step 2: Elevate to Admin Role via SQL
Run this single command in the **Supabase SQL Editor**:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'YOUR_ADMIN_EMAIL_HERE';
```

### Step 3: Verify Elevation
```sql
SELECT id, full_name, email, role, active 
FROM public.profiles 
WHERE email = 'YOUR_ADMIN_EMAIL_HERE';
```

### Step 4: Login to Dashboard
Log in via `/login` and click **Admin Portal** or go to `/admin`. You will now have complete access to manage projects, services, quotes, contact messages, blog articles, team members, media assets, and site settings.

---

## 3. Storage Buckets Configured
- `project-images`: Public bucket for construction site covers & galleries.
- `service-images`: Public bucket for service hero graphics.
- `blog-images`: Public bucket for industry article headers.
- `team-images`: Public bucket for staff portraits.
- `company-assets`: Public bucket for logos, certificates, brochures.
- `quote-attachments`: Secured private bucket for client drawings & BOQs.
