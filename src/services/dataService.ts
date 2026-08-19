import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  Project, 
  Service, 
  Testimonial, 
  TeamMember, 
  BlogPost, 
  SiteSettings, 
  QuoteRequest, 
  ContactMessage, 
  Profile, 
  ProjectImage 
} from '../types/database';
import {
  INITIAL_PROJECTS,
  INITIAL_SERVICES,
  INITIAL_TESTIMONIALS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_BLOG_POSTS,
  INITIAL_SITE_SETTINGS,
  INITIAL_QUOTES,
  INITIAL_MESSAGES,
  INITIAL_PROFILES
} from '../data/initialData';

// Local storage keys for resilient persistence & offline/preview mode
const STORAGE_KEYS = {
  PROJECTS: 'apexbuild_projects',
  SERVICES: 'apexbuild_services',
  TESTIMONIALS: 'apexbuild_testimonials',
  TEAM: 'apexbuild_team',
  BLOG: 'apexbuild_blog',
  SETTINGS: 'apexbuild_settings',
  QUOTES: 'apexbuild_quotes',
  MESSAGES: 'apexbuild_messages',
  PROFILES: 'apexbuild_profiles',
};

// Helpers for local storage
function getLocalItem<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(item);
  } catch {
    return defaultVal;
  }
}

function setLocalItem<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

export const dataService = {
  // --------------------------------------------------------------------------
  // SITE SETTINGS
  // --------------------------------------------------------------------------
  async getSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .limit(1)
          .single();
        if (!error && data) {
          setLocalItem(STORAGE_KEYS.SETTINGS, data);
          return data as SiteSettings;
        }
      } catch (err) {
        console.warn('Supabase getSettings fallback to local cache:', err);
      }
    }
    return getLocalItem<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...settings, updated_at: new Date().toISOString() };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert(updated)
        .select()
        .single();
      if (error) {
        console.error('Supabase updateSettings error:', error);
        throw new Error(`Failed to update site settings: ${error.message}`);
      }
      if (data) {
        setLocalItem(STORAGE_KEYS.SETTINGS, data);
        return data as SiteSettings;
      }
    }

    setLocalItem(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // --------------------------------------------------------------------------
  // SERVICES
  // --------------------------------------------------------------------------
  async getServices(activeOnly: boolean = false): Promise<Service[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('services').select('*').order('display_order', { ascending: true });
        if (activeOnly) {
          query = query.eq('active', true);
        }
        const { data, error } = await query;
        if (!error && data) {
          if (data.length > 0) {
            setLocalItem(STORAGE_KEYS.SERVICES, data);
            return data as Service[];
          }
        }
      } catch (err) {
        console.warn('Supabase getServices fallback to local cache:', err);
      }
    }

    const local = getLocalItem<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    const sorted = [...local].sort((a, b) => a.display_order - b.display_order);
    return activeOnly ? sorted.filter(s => s.active) : sorted;
  },

  async getServiceBySlug(slug: string): Promise<Service | null> {
    const services = await this.getServices();
    return services.find(s => s.slug === slug) || null;
  },

  async saveService(service: Partial<Service>): Promise<Service> {
    const id = service.id || `srv-${Date.now()}`;
    const slug = service.slug || (service.title ? service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `service-${Date.now()}`);
    const newService: Service = {
      id,
      title: service.title || 'Untitled Service',
      slug,
      description: service.description || '',
      short_description: service.short_description || '',
      image_url: service.image_url || 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f7?w=1200&auto=format&fit=crop&q=80',
      icon: service.icon || 'Building2',
      category: service.category || 'Construction',
      features: service.features || [],
      active: service.active ?? true,
      display_order: service.display_order ?? 0,
      created_at: service.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('services')
        .upsert(newService)
        .select()
        .single();
      if (error) {
        console.error('Supabase saveService error:', error);
        throw new Error(`Failed to save service: ${error.message}`);
      }
      if (data) {
        const list = getLocalItem<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
        const updatedList = list.some(s => s.id === data.id)
          ? list.map(s => s.id === data.id ? data : s)
          : [...list, data];
        setLocalItem(STORAGE_KEYS.SERVICES, updatedList);
        return data as Service;
      }
    }

    const list = getLocalItem<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    const updatedList = list.some(s => s.id === id)
      ? list.map(s => s.id === id ? newService : s)
      : [...list, newService];
    setLocalItem(STORAGE_KEYS.SERVICES, updatedList);
    return newService;
  },

  async deleteService(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteService error:', error);
        throw new Error(`Failed to delete service: ${error.message}`);
      }
    }
    const list = getLocalItem<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    setLocalItem(STORAGE_KEYS.SERVICES, list.filter(s => s.id !== id));
    return true;
  },

  // --------------------------------------------------------------------------
  // PROJECTS & IMAGES
  // --------------------------------------------------------------------------
  async getProjects(featuredOnly: boolean = false): Promise<Project[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('projects').select('*, images:project_images(*)').order('created_at', { ascending: false });
        if (featuredOnly) {
          query = query.eq('featured', true);
        }
        const { data, error } = await query;
        if (!error && data) {
          if (data.length > 0) {
            setLocalItem(STORAGE_KEYS.PROJECTS, data);
            return data as Project[];
          }
        }
      } catch (err) {
        console.warn('Supabase getProjects fallback to local cache:', err);
      }
    }

    const list = getLocalItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    return featuredOnly ? list.filter(p => p.featured) : list;
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const list = await this.getProjects();
    return list.find(p => p.slug === slug) || null;
  },

  async saveProject(project: Partial<Project>, galleryImages?: ProjectImage[]): Promise<Project> {
    const id = project.id || `prj-${Date.now()}`;
    const slug = project.slug || (project.title ? project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `project-${Date.now()}`);
    
    const formatted: Project = {
      id,
      title: project.title || 'Untitled Project',
      slug,
      description: project.description || '',
      short_description: project.short_description || '',
      location: project.location || 'Nairobi, Kenya',
      client: project.client || null,
      project_type: project.project_type || 'Commercial',
      status: project.status || 'In Progress',
      start_date: project.start_date || null,
      completion_date: project.completion_date || null,
      budget: project.budget || null,
      cover_image_url: project.cover_image_url || 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f7?w=1200&auto=format&fit=crop&q=80',
      featured: project.featured ?? false,
      scope: project.scope || [],
      images: galleryImages || project.images || [],
      created_at: project.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('projects')
        .upsert({
          id: formatted.id,
          title: formatted.title,
          slug: formatted.slug,
          description: formatted.description,
          short_description: formatted.short_description,
          location: formatted.location,
          client: formatted.client,
          project_type: formatted.project_type,
          status: formatted.status,
          start_date: formatted.start_date,
          completion_date: formatted.completion_date,
          budget: formatted.budget,
          cover_image_url: formatted.cover_image_url,
          featured: formatted.featured,
          scope: formatted.scope,
          updated_at: formatted.updated_at
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase saveProject error:', error);
        throw new Error(`Failed to save project: ${error.message}`);
      }

      if (data) {
        // Sync gallery images if provided
        if (galleryImages && galleryImages.length > 0) {
          const { error: delErr } = await supabase.from('project_images').delete().eq('project_id', id);
          if (delErr) {
            console.warn('Supabase project_images delete warning:', delErr);
          }
          const { error: insErr } = await supabase.from('project_images').insert(
            galleryImages.map((img, index) => ({
              id: img.id || `img-${Date.now()}-${index}`,
              project_id: id,
              image_url: img.image_url,
              caption: img.caption || null,
              display_order: index + 1
            }))
          );
          if (insErr) {
            console.warn('Supabase project_images insert warning:', insErr);
          }
        }
      }
    }

    const list = getLocalItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const updatedList = list.some(p => p.id === id)
      ? list.map(p => p.id === id ? formatted : p)
      : [formatted, ...list];
    setLocalItem(STORAGE_KEYS.PROJECTS, updatedList);
    return formatted;
  },

  async deleteProject(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteProject error:', error);
        throw new Error(`Failed to delete project: ${error.message}`);
      }
    }
    const list = getLocalItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    setLocalItem(STORAGE_KEYS.PROJECTS, list.filter(p => p.id !== id));
    return true;
  },

  // --------------------------------------------------------------------------
  // QUOTE REQUESTS
  // --------------------------------------------------------------------------
  async getQuotes(userId?: string | null, email?: string | null): Promise<QuoteRequest[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('quote_requests').select('*').order('created_at', { ascending: false });
        if (userId) {
          query = query.eq('user_id', userId);
        } else if (email) {
          query = query.eq('email', email);
        }
        const { data, error } = await query;
        if (!error && data) {
          return data as QuoteRequest[];
        }
      } catch (err) {
        console.warn('Supabase getQuotes fallback to local cache:', err);
      }
    }

    const list = getLocalItem<QuoteRequest[]>(STORAGE_KEYS.QUOTES, INITIAL_QUOTES);
    if (userId) return list.filter(q => q.user_id === userId);
    if (email) return list.filter(q => q.email?.toLowerCase() === email.toLowerCase());
    return list;
  },

  async createQuote(quote: Omit<QuoteRequest, 'id' | 'created_at' | 'updated_at'>): Promise<QuoteRequest> {
    const id = `qte-${Date.now()}`;
    const newQuote: QuoteRequest = {
      ...quote,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('quote_requests')
        .insert(newQuote)
        .select()
        .single();
      if (error) {
        console.error('Supabase createQuote error:', error);
        throw new Error(`Failed to submit quote request: ${error.message}`);
      }
      if (data) {
        const list = getLocalItem<QuoteRequest[]>(STORAGE_KEYS.QUOTES, INITIAL_QUOTES);
        setLocalItem(STORAGE_KEYS.QUOTES, [data, ...list]);
        return data as QuoteRequest;
      }
    }

    const list = getLocalItem<QuoteRequest[]>(STORAGE_KEYS.QUOTES, INITIAL_QUOTES);
    setLocalItem(STORAGE_KEYS.QUOTES, [newQuote, ...list]);
    return newQuote;
  },

  async updateQuoteStatus(id: string, status: QuoteRequest['status'], adminNotes?: string): Promise<QuoteRequest | null> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured()) {
      try {
        const updatePayload: Record<string, unknown> = { status, updated_at: now };
        if (adminNotes !== undefined) updatePayload.admin_notes = adminNotes;
        const { data, error } = await supabase
          .from('quote_requests')
          .update(updatePayload)
          .eq('id', id)
          .select()
          .maybeSingle();

        if (error) {
          console.warn('Supabase updateQuoteStatus warning:', error.message);
        } else if (data) {
          const list = getLocalItem<QuoteRequest[]>(STORAGE_KEYS.QUOTES, INITIAL_QUOTES);
          setLocalItem(STORAGE_KEYS.QUOTES, list.map(q => q.id === id ? data : q));
          return data as QuoteRequest;
        }
      } catch (err) {
        console.warn('Supabase updateQuoteStatus exception:', err);
      }
    }

    const list = getLocalItem<QuoteRequest[]>(STORAGE_KEYS.QUOTES, INITIAL_QUOTES);
    const updated = list.map(q => {
      if (q.id === id) {
        return {
          ...q,
          status,
          admin_notes: adminNotes !== undefined ? adminNotes : q.admin_notes,
          updated_at: now
        };
      }
      return q;
    });
    setLocalItem(STORAGE_KEYS.QUOTES, updated);
    return updated.find(q => q.id === id) || null;
  },

  async deleteQuote(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('quote_requests').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteQuote error:', error);
        throw new Error(`Failed to delete quote: ${error.message}`);
      }
    }
    const list = getLocalItem<QuoteRequest[]>(STORAGE_KEYS.QUOTES, INITIAL_QUOTES);
    setLocalItem(STORAGE_KEYS.QUOTES, list.filter(q => q.id !== id));
    return true;
  },

  // --------------------------------------------------------------------------
  // CONTACT MESSAGES
  // --------------------------------------------------------------------------
  async getMessages(userId?: string | null, email?: string | null): Promise<ContactMessage[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });
        if (userId) {
          query = query.eq('user_id', userId);
        } else if (email) {
          query = query.eq('email', email);
        }
        const { data, error } = await query;
        if (!error && data) {
          return data as ContactMessage[];
        }
      } catch (err) {
        console.warn('Supabase getMessages fallback to local cache:', err);
      }
    }
    const list = getLocalItem<ContactMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    if (userId) return list.filter(m => m.user_id === userId);
    if (email) return list.filter(m => m.email?.toLowerCase() === email.toLowerCase());
    return list;
  },

  async createMessage(msg: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at'>): Promise<ContactMessage> {
    const id = `msg-${Date.now()}`;
    const newMsg: ContactMessage = {
      ...msg,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert(newMsg)
        .select()
        .single();
      if (error) {
        console.error('Supabase createMessage error:', error);
        throw new Error(`Failed to send message: ${error.message}`);
      }
      if (data) {
        const list = getLocalItem<ContactMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
        setLocalItem(STORAGE_KEYS.MESSAGES, [data, ...list]);
        return data as ContactMessage;
      }
    }

    const list = getLocalItem<ContactMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    setLocalItem(STORAGE_KEYS.MESSAGES, [newMsg, ...list]);
    return newMsg;
  },

  async updateMessageStatus(id: string, status: ContactMessage['status']): Promise<ContactMessage | null> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .update({ status, updated_at: now })
          .eq('id', id)
          .select()
          .maybeSingle();

        if (error) {
          console.warn('Supabase updateMessageStatus warning:', error.message);
        } else if (data) {
          const list = getLocalItem<ContactMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
          setLocalItem(STORAGE_KEYS.MESSAGES, list.map(m => m.id === id ? data : m));
          return data as ContactMessage;
        }
      } catch (err) {
        console.warn('Supabase updateMessageStatus exception:', err);
      }
    }

    const list = getLocalItem<ContactMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    const updated = list.map(m => m.id === id ? { ...m, status, updated_at: now } : m);
    setLocalItem(STORAGE_KEYS.MESSAGES, updated);
    return updated.find(m => m.id === id) || null;
  },

  async replyToMessage(id: string, reply: string): Promise<ContactMessage | null> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .update({ admin_reply: reply, replied_at: now, status: 'read', updated_at: now })
          .eq('id', id)
          .select()
          .maybeSingle();

        if (error) {
          console.warn('Supabase replyToMessage warning:', error.message);
        } else if (data) {
          const list = getLocalItem<ContactMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
          setLocalItem(STORAGE_KEYS.MESSAGES, list.map(m => m.id === id ? data : m));
          return data as ContactMessage;
        }
      } catch (err) {
        console.warn('Supabase replyToMessage exception:', err);
      }
    }

    const list = getLocalItem<ContactMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    const updated = list.map(m => m.id === id ? { ...m, admin_reply: reply, replied_at: now, status: 'read' as const, updated_at: now } : m);
    setLocalItem(STORAGE_KEYS.MESSAGES, updated);
    return updated.find(m => m.id === id) || null;
  },

  async deleteMessage(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteMessage error:', error);
        throw new Error(`Failed to delete message: ${error.message}`);
      }
    }
    const list = getLocalItem<ContactMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    setLocalItem(STORAGE_KEYS.MESSAGES, list.filter(m => m.id !== id));
    return true;
  },

  // --------------------------------------------------------------------------
  // TESTIMONIALS
  // --------------------------------------------------------------------------
  async getTestimonials(activeOnly: boolean = false): Promise<Testimonial[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('testimonials').select('*').order('created_at', { ascending: false });
        if (activeOnly) query = query.eq('active', true);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          setLocalItem(STORAGE_KEYS.TESTIMONIALS, data);
          return data as Testimonial[];
        }
      } catch (err) {
        console.warn('Supabase getTestimonials fallback to local cache:', err);
      }
    }
    const list = getLocalItem<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
    return activeOnly ? list.filter(t => t.active) : list;
  },

  async saveTestimonial(t: Partial<Testimonial>): Promise<Testimonial> {
    const id = t.id || `tst-${Date.now()}`;
    const newT: Testimonial = {
      id,
      customer_name: t.customer_name || 'Client',
      company: t.company || null,
      project_title: t.project_title || null,
      content: t.content || '',
      rating: t.rating ?? 5,
      image_url: t.image_url || null,
      featured: t.featured ?? true,
      active: t.active ?? true,
      created_at: t.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('testimonials')
        .upsert(newT)
        .select()
        .single();
      if (error) {
        console.error('Supabase saveTestimonial error:', error);
        throw new Error(`Failed to save testimonial: ${error.message}`);
      }
      if (data) {
        const list = getLocalItem<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
        const updated = list.some(item => item.id === id) ? list.map(item => item.id === id ? data : item) : [data, ...list];
        setLocalItem(STORAGE_KEYS.TESTIMONIALS, updated);
        return data as Testimonial;
      }
    }

    const list = getLocalItem<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
    const updated = list.some(item => item.id === id) ? list.map(item => item.id === id ? newT : item) : [newT, ...list];
    setLocalItem(STORAGE_KEYS.TESTIMONIALS, updated);
    return newT;
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteTestimonial error:', error);
        throw new Error(`Failed to delete testimonial: ${error.message}`);
      }
    }
    const list = getLocalItem<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
    setLocalItem(STORAGE_KEYS.TESTIMONIALS, list.filter(t => t.id !== id));
    return true;
  },

  // --------------------------------------------------------------------------
  // TEAM MEMBERS
  // --------------------------------------------------------------------------
  async getTeamMembers(activeOnly: boolean = false): Promise<TeamMember[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('team_members').select('*').order('display_order', { ascending: true });
        if (activeOnly) query = query.eq('active', true);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          setLocalItem(STORAGE_KEYS.TEAM, data);
          return data as TeamMember[];
        }
      } catch (err) {
        console.warn('Supabase getTeamMembers fallback to local cache:', err);
      }
    }
    const list = getLocalItem<TeamMember[]>(STORAGE_KEYS.TEAM, INITIAL_TEAM_MEMBERS);
    const sorted = [...list].sort((a, b) => a.display_order - b.display_order);
    return activeOnly ? sorted.filter(m => m.active) : sorted;
  },

  async saveTeamMember(member: Partial<TeamMember>): Promise<TeamMember> {
    const id = member.id || `team-${Date.now()}`;
    const newMember: TeamMember = {
      id,
      name: member.name || 'Team Member',
      position: member.position || 'Engineer',
      biography: member.biography || '',
      image_url: member.image_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
      email: member.email || null,
      phone: member.phone || null,
      linkedin_url: member.linkedin_url || null,
      display_order: member.display_order ?? 0,
      active: member.active ?? true,
      created_at: member.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('team_members')
        .upsert(newMember)
        .select()
        .single();
      if (error) {
        console.error('Supabase saveTeamMember error:', error);
        throw new Error(`Failed to save team member: ${error.message}`);
      }
      if (data) {
        const list = getLocalItem<TeamMember[]>(STORAGE_KEYS.TEAM, INITIAL_TEAM_MEMBERS);
        const updated = list.some(item => item.id === id) ? list.map(item => item.id === id ? data : item) : [...list, data];
        setLocalItem(STORAGE_KEYS.TEAM, updated);
        return data as TeamMember;
      }
    }

    const list = getLocalItem<TeamMember[]>(STORAGE_KEYS.TEAM, INITIAL_TEAM_MEMBERS);
    const updated = list.some(item => item.id === id) ? list.map(item => item.id === id ? newMember : item) : [...list, newMember];
    setLocalItem(STORAGE_KEYS.TEAM, updated);
    return newMember;
  },

  async deleteTeamMember(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteTeamMember error:', error);
        throw new Error(`Failed to delete team member: ${error.message}`);
      }
    }
    const list = getLocalItem<TeamMember[]>(STORAGE_KEYS.TEAM, INITIAL_TEAM_MEMBERS);
    setLocalItem(STORAGE_KEYS.TEAM, list.filter(m => m.id !== id));
    return true;
  },

  // --------------------------------------------------------------------------
  // BLOG POSTS
  // --------------------------------------------------------------------------
  async getBlogPosts(publishedOnly: boolean = false): Promise<BlogPost[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
        if (publishedOnly) query = query.eq('published', true);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          setLocalItem(STORAGE_KEYS.BLOG, data);
          return data as BlogPost[];
        }
      } catch (err) {
        console.warn('Supabase getBlogPosts fallback to local cache:', err);
      }
    }
    const list = getLocalItem<BlogPost[]>(STORAGE_KEYS.BLOG, INITIAL_BLOG_POSTS);
    return publishedOnly ? list.filter(p => p.published) : list;
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const list = await this.getBlogPosts();
    return list.find(p => p.slug === slug) || null;
  },

  async saveBlogPost(post: Partial<BlogPost>): Promise<BlogPost> {
    const id = post.id || `post-${Date.now()}`;
    const slug = post.slug || (post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `post-${Date.now()}`);
    const newPost: BlogPost = {
      id,
      title: post.title || 'Untitled Article',
      slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      cover_image_url: post.cover_image_url || 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f7?w=1200&auto=format&fit=crop&q=80',
      author_name: post.author_name || 'ApexBuild Technical Editorial',
      author_id: post.author_id || null,
      category: post.category || 'Engineering',
      read_time: post.read_time || '5 min read',
      published: post.published ?? true,
      published_at: post.published ? (post.published_at || new Date().toISOString()) : null,
      created_at: post.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('blog_posts')
        .upsert(newPost)
        .select()
        .single();
      if (error) {
        console.error('Supabase saveBlogPost error:', error);
        throw new Error(`Failed to save blog article: ${error.message}`);
      }
      if (data) {
        const list = getLocalItem<BlogPost[]>(STORAGE_KEYS.BLOG, INITIAL_BLOG_POSTS);
        const updated = list.some(item => item.id === id) ? list.map(item => item.id === id ? data : item) : [data, ...list];
        setLocalItem(STORAGE_KEYS.BLOG, updated);
        return data as BlogPost;
      }
    }

    const list = getLocalItem<BlogPost[]>(STORAGE_KEYS.BLOG, INITIAL_BLOG_POSTS);
    const updated = list.some(item => item.id === id) ? list.map(item => item.id === id ? newPost : item) : [newPost, ...list];
    setLocalItem(STORAGE_KEYS.BLOG, updated);
    return newPost;
  },

  async deleteBlogPost(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteBlogPost error:', error);
        throw new Error(`Failed to delete blog article: ${error.message}`);
      }
    }
    const list = getLocalItem<BlogPost[]>(STORAGE_KEYS.BLOG, INITIAL_BLOG_POSTS);
    setLocalItem(STORAGE_KEYS.BLOG, list.filter(p => p.id !== id));
    return true;
  },

  // --------------------------------------------------------------------------
  // PROFILES & USER MANAGEMENT (RBAC)
  // --------------------------------------------------------------------------
  async getProfileById(id: string): Promise<Profile | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (!error && data) return data as Profile;
      } catch (err) {
        console.warn('Supabase getProfileById error:', err);
      }
    }
    const list = getLocalItem<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    return list.find(p => p.id === id) || null;
  },

  async getProfiles(): Promise<Profile[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data as Profile[];
      } catch (err) {
        console.warn('Supabase getProfiles fallback to local cache:', err);
      }
    }
    return getLocalItem<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  },

  async updateProfileRole(id: string, role: Profile['role']): Promise<Profile | null> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({ role, updated_at: now })
          .eq('id', id)
          .select()
          .maybeSingle();

        if (error) {
          console.warn('Supabase updateProfileRole warning:', error.message);
        } else if (data) {
          const list = getLocalItem<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
          setLocalItem(STORAGE_KEYS.PROFILES, list.map(p => p.id === id ? data : p));
          return data as Profile;
        }
      } catch (err) {
        console.warn('Supabase updateProfileRole exception:', err);
      }
    }

    const list = getLocalItem<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    const updated = list.map(p => p.id === id ? { ...p, role, updated_at: now } : p);
    setLocalItem(STORAGE_KEYS.PROFILES, updated);
    return updated.find(p => p.id === id) || null;
  },

  async updateProfile(profile: Partial<Profile> & { id: string }): Promise<Profile> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({ ...profile, updated_at: now })
          .eq('id', profile.id)
          .select()
          .maybeSingle();

        if (error) {
          console.warn('Supabase updateProfile warning:', error.message);
        } else if (data) {
          const list = getLocalItem<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
          setLocalItem(STORAGE_KEYS.PROFILES, list.map(p => p.id === profile.id ? data : p));
          return data as Profile;
        }
      } catch (err) {
        console.warn('Supabase updateProfile exception:', err);
      }
    }

    const list = getLocalItem<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    const existing = list.find(p => p.id === profile.id);
    const updatedProfile: Profile = {
      ...(existing || {
        id: profile.id,
        email: profile.email || 'user@apexbuild.co.ke',
        full_name: profile.full_name || 'Customer User',
        role: 'customer',
        active: true,
        created_at: now
      }),
      ...profile,
      updated_at: now
    };
    const updated = list.some(p => p.id === profile.id) ? list.map(p => p.id === profile.id ? updatedProfile : p) : [...list, updatedProfile];
    setLocalItem(STORAGE_KEYS.PROFILES, updated);
    return updatedProfile;
  },

  // --------------------------------------------------------------------------
  // STORAGE & ASSET UPLOADS
  // --------------------------------------------------------------------------
  async uploadFile(bucket: string, file: File): Promise<string> {
    if (isSupabaseConfigured()) {
      const ext = file.name.split('.').pop();
      const filePath = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);
      if (uploadError) {
        console.error('Supabase storage upload error:', uploadError);
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return data.publicUrl;
    }

    // Local fallback using FileReader Data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file locally'));
        }
      };
      reader.onerror = () => reject(new Error('FileReader error'));
      reader.readAsDataURL(file);
    });
  },

  // --------------------------------------------------------------------------
  // ALIASES & COMPATIBILITY HELPERS
  // --------------------------------------------------------------------------
  async createProject(project: Partial<Project>): Promise<Project> {
    return this.saveProject(project);
  },
  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    return this.saveProject({ ...project, id });
  },
  async createService(service: Partial<Service>): Promise<Service> {
    return this.saveService(service);
  },
  async updateService(id: string, service: Partial<Service>): Promise<Service> {
    return this.saveService({ ...service, id });
  },
  async createTeamMember(member: Partial<TeamMember>): Promise<TeamMember> {
    return this.saveTeamMember(member);
  },
  async updateTeamMember(id: string, member: Partial<TeamMember>): Promise<TeamMember> {
    return this.saveTeamMember({ ...member, id });
  },
  async createTestimonial(testimonial: Partial<Testimonial>): Promise<Testimonial> {
    return this.saveTestimonial(testimonial);
  },
  async updateTestimonial(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> {
    return this.saveTestimonial({ ...testimonial, id });
  },
  async createBlogPost(post: Partial<BlogPost>): Promise<BlogPost> {
    return this.saveBlogPost(post);
  },
  async updateBlogPost(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
    return this.saveBlogPost({ ...post, id });
  },
  async getContactMessages(userId?: string | null, email?: string | null): Promise<ContactMessage[]> {
    return this.getMessages(userId, email);
  },
  async createContactMessage(msg: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at'>): Promise<ContactMessage> {
    return this.createMessage(msg);
  },
  async updateContactMessage(id: string, status: ContactMessage['status']): Promise<ContactMessage | null> {
    return this.updateMessageStatus(id, status);
  },
  async deleteContactMessage(id: string): Promise<boolean> {
    return this.deleteMessage(id);
  },
  async updateQuote(id: string, updates: Partial<QuoteRequest>): Promise<QuoteRequest | null> {
    if (updates.status) {
      return this.updateQuoteStatus(id, updates.status, updates.admin_notes || undefined);
    }
    const list = await this.getQuotes();
    const existing = list.find(q => q.id === id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
    setLocalItem(STORAGE_KEYS.QUOTES, list.map(q => q.id === id ? updated : q));
    return updated;
  },
  async updateSetting(key: string, value: string): Promise<SiteSettings> {
    const patch: Record<string, string> = {};
    patch[key] = value;
    return this.updateSettings(patch as unknown as Partial<SiteSettings>);
  }
};
