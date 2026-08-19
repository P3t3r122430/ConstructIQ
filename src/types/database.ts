export type UserRole = 'customer' | 'manager' | 'project_manager' | 'admin';

export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';

export type QuoteStatus = 
  | 'New' 
  | 'Reviewing' 
  | 'Contacted' 
  | 'Site Visit Scheduled' 
  | 'Quotation Sent' 
  | 'Approved' 
  | 'Rejected' 
  | 'Completed';

export type MessageStatus = 'unread' | 'read' | 'archived';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  company_name?: string | null;
  avatar_url?: string | null;
  role: UserRole;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  image_url: string;
  icon: string;
  category: string;
  features: string[];
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  location: string;
  client?: string | null;
  project_type: string;
  status: ProjectStatus;
  start_date?: string | null;
  completion_date?: string | null;
  budget?: string | null;
  cover_image_url: string;
  featured: boolean;
  scope?: string[];
  created_at: string;
  updated_at: string;
  images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  caption?: string | null;
  display_order: number;
  created_at: string;
}

export interface QuoteRequest {
  id: string;
  user_id?: string | null;
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  project_type: string;
  location: string;
  budget?: string | null;
  estimated_area?: string | null;
  preferred_start_date?: string | null;
  description: string;
  status: QuoteStatus;
  admin_notes?: string | null;
  attachments?: string[];
  items?: QuoteItem[];
  created_at: string;
  updated_at: string;
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  user_id?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: MessageStatus;
  admin_reply?: string | null;
  replied_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  company?: string | null;
  project_title?: string | null;
  content: string;
  rating: number;
  image_url?: string | null;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  biography?: string | null;
  image_url: string;
  email?: string | null;
  phone?: string | null;
  linkedin_url?: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  author_id?: string | null;
  author_name: string;
  category: string;
  read_time: string;
  published: boolean;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  company_name: string;
  tagline: string;
  logo_url?: string | null;
  phone: string;
  phone_secondary?: string | null;
  email: string;
  address: string;
  city: string;
  country: string;
  whatsapp_number?: string | null;
  google_maps_embed_url?: string | null;
  business_hours: string;
  about_summary?: string | null;
  mission?: string | null;
  vision?: string | null;
  core_values: string[];
  social_facebook?: string | null;
  social_linkedin?: string | null;
  social_twitter?: string | null;
  social_instagram?: string | null;
  currency: string;
  updated_at: string;
}
