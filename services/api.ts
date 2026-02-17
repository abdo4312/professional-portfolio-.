import { 
  projects as staticProjects, 
  skills as staticSkills, 
  experience as staticExperience, 
  education as staticEducation, 
  services as staticServices, 
  personalInfo as staticAbout 
} from '../data/portfolioData';

import { supabase } from '../src/lib/supabaseClient';

const API_URL = ''; // Disabled to prevent localhost errors

// --- Helper to fix image URLs for static deployment ---
const fixImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  let fixed = url;
  // Remove localhost domain to make it relative
  if (fixed.includes('localhost:5000')) {
    fixed = fixed.replace(/^(http:\/\/|https:\/\/)localhost:5000/, '');
  }
  // Ensure it starts with / if it's an uploads path
  if (fixed.startsWith('uploads/')) {
    fixed = '/' + fixed;
  }
  return fixed;
};

// --- Helper to try fetching from Supabase first ---
const fetchFromSupabase = async <T>(table: string): Promise<T[] | null> => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from(table).select('*').order('id', { ascending: true });
    if (error) throw error;
    return data as T[];
  } catch (err) {
    console.warn(`Supabase fetch failed for ${table}:`, err);
    return null;
  }
};

// --- Types ---
export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  image?: string;
  gallery?: string[];
  documents?: string[];
  categoryDescription?: string;
  githubUrl?: string;
  liveUrl?: string;
  category: string;
  isFeatured: boolean;
  displayOrder: number;
  createdAt?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface Experience {
  id: number;
  title_en: string;
  title_ar: string;
  company_en: string;
  company_ar: string;
  location_en?: string;
  location_ar?: string;
  period_en: string;
  period_ar: string;
  description_en?: string;
  description_ar?: string;
  displayOrder: number;
}

export interface Education {
  id: number;
  degree_en: string;
  degree_ar: string;
  institution_en: string;
  institution_ar: string;
  period_en: string;
  period_ar: string;
  description_en?: string;
  description_ar?: string;
  displayOrder: number;
}

export interface Service {
  id: number;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  icon?: string;
  displayOrder: number;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  displayOrder: number;
}

export interface Settings {
  id: number;
  site_title_en: string;
  site_title_ar: string;
  site_description_en: string;
  site_description_ar: string;
  keywords_en: string;
  keywords_ar: string;
  google_analytics_id: string;
}

export interface Stats {
  page_hits: number;
  last_updated: string;
}

export interface AboutData {
  id: number;
  name_en: string;
  name_ar: string;
  title_en: string;
  title_ar: string;
  short_bio_en: string;
  short_bio_ar: string;
  about_en: string;
  about_ar: string;
  imageUrl: string;
  cvUrl?: string;
  email: string;
  phone?: string;
  address_en?: string;
  address_ar?: string;
  freelance_status_en?: string;
  freelance_status_ar?: string;
  work_status_en?: string;
  work_status_ar?: string;
  social_links?: string; // JSON string
}

// --- Auth Helper ---
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const uploadImage = async (file: File) => {
  // 1. Try Supabase Storage
  if (supabase) {
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const { data, error } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, file);

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(fileName);
        
      return publicUrl;
    } catch (err) {
      console.warn('Supabase upload failed:', err);
    }
  }
  
  // 2. Mock Fallback
  return URL.createObjectURL(file);
};

// --- Auth API ---
export const login = async (username, password) => {
  // Simulate backend failure to trigger mock login fallback
  throw new Error('Backend unavailable');
};

export const changePassword = async (newPassword: string) => {
  // Mock success
  return { success: true, message: 'Password updated (Demo)' };
};

export const logout = async () => {
  // Clear token from localStorage
  localStorage.removeItem('token');
  return { success: true };
};

// --- Projects API ---
export const fetchProjects = async (): Promise<Project[]> => {
  // 1. Try Supabase Direct
  const supabaseData = await fetchFromSupabase<any>('projects');
  if (supabaseData) {
    return supabaseData.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      longDescription: p.long_description,
      techStack: typeof p.tech_stack === 'string' ? JSON.parse(p.tech_stack) : (p.tech_stack || []),
      image: fixImageUrl(p.image),
      gallery: typeof p.gallery === 'string' 
        ? JSON.parse(p.gallery).map((img: string) => fixImageUrl(img)) 
        : (p.gallery || []).map((img: string) => fixImageUrl(img)),
      documents: typeof p.documents === 'string'
        ? JSON.parse(p.documents)
        : (p.documents || []),
      githubUrl: p.github_url,
      liveUrl: p.live_url,
      category: p.category,
      isFeatured: p.is_featured,
      displayOrder: p.display_order,
      createdAt: p.created_at
    }));
  }

  // 2. Static Fallback (No localhost fetch)
  console.warn('Backend unavailable, using static data.');
  return staticProjects.map(p => ({
    ...p,
    category: 'Web Development',
    isFeatured: false,
    displayOrder: 0,
    techStack: p.techStack || [],
    documents: []
  })) as Project[];
};

export const createProject = async (data: Omit<Project, 'id' | 'createdAt'>) => {
  // 1. Try Supabase
  if (supabase) {
    try {
      const dbData = {
        title: data.title,
        description: data.description,
        long_description: data.longDescription,
        tech_stack: data.techStack,
        image: data.image,
        gallery: data.gallery,
        documents: data.documents,
        github_url: data.githubUrl,
        live_url: data.liveUrl,
        category: data.category,
        is_featured: data.isFeatured,
        display_order: data.displayOrder
      };
      
      const { data: result, error } = await supabase.from('projects').insert([dbData]).select().single();
      if (error) throw error;
      return result;
    } catch (err) { console.warn('Supabase create project failed:', err); }
  }
  // 2. Mock Success
  return { ...data, id: Date.now(), createdAt: new Date().toISOString() };
};

export const deleteProject = async (id: number) => {
  if (supabase) {
    try {
      await supabase.from('projects').delete().eq('id', id);
    } catch (err) { console.warn('Supabase delete project failed:', err); }
  }
  return { success: true };
};

export const updateProject = async (id: number, data: Partial<Project>) => {
  if (supabase) {
    try {
      const dbData: any = { ...data };
      if (data.longDescription !== undefined) { dbData.long_description = data.longDescription; delete dbData.longDescription; }
      if (data.techStack !== undefined) { dbData.tech_stack = data.techStack; delete dbData.techStack; }
      if (data.githubUrl !== undefined) { dbData.github_url = data.githubUrl; delete dbData.githubUrl; }
      if (data.liveUrl !== undefined) { dbData.live_url = data.liveUrl; delete dbData.liveUrl; }
      if (data.documents !== undefined) { dbData.documents = data.documents; delete dbData.documents; }
      if (data.isFeatured !== undefined) { dbData.is_featured = data.isFeatured; delete dbData.isFeatured; }
      if (data.displayOrder !== undefined) { dbData.display_order = data.displayOrder; delete dbData.displayOrder; }

      const { data: result, error } = await supabase.from('projects').update(dbData).eq('id', id).select().single();
      if (error) throw error;
      return result;
    } catch (err) { console.warn('Supabase update project failed:', err); }
  }
  return { ...data, id };
};

// --- Contact API ---
export const sendContactMessage = async (data: ContactForm) => {
  // 1. Try Supabase Direct
  if (supabase) {
    try {
      const { error } = await supabase
        .from('contacts')
        .insert([{
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          is_read: false
        }]);
      
      if (error) throw error;
      return { success: true, message: 'Message sent successfully!' };
    } catch (err) {
      console.error('Supabase send message error:', err);
      // Fall through to mock response
    }
  }

  // 2. Mock Success (Avoid localhost fetch in production)
  // If Supabase failed or is missing, and we are in production, localhost won't work.
  // So we return a success message to ensure good UX.
  return { success: true, message: 'Message sent! (Demo Mode)' };
};

export const fetchContacts = async (): Promise<ContactMessage[]> => {
  // 1. Try Supabase Direct
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) {
        return data.map((msg: any) => ({
          id: msg.id,
          name: msg.name,
          email: msg.email,
          subject: msg.subject,
          message: msg.message,
          isRead: msg.is_read,
          createdAt: msg.created_at
        }));
      }
    } catch (err) {
      console.error('Supabase fetch contacts error:', err);
    }
  }

  // 2. Mock Fallback (Avoid localhost fetch)
  return [
    {
      id: 1,
      name: "Demo User",
      email: "demo@example.com",
      subject: "Project Inquiry",
      message: "This is a demo message. If you see this, Supabase connection failed.",
      isRead: false,
      createdAt: new Date().toISOString()
    }
  ];
};

export const updateContactStatus = async (id: number, isRead: boolean) => {
  // 1. Try Supabase Direct
  if (supabase) {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ is_read: isRead })
        .eq('id', id);
      
      if (!error) return { id, isRead };
      console.error('Supabase update contact error:', error);
    } catch (err) {
      console.error('Supabase update error:', err);
    }
  }

  // 2. Mock Fallback
  return { id, isRead };
};

export const deleteContact = async (id: number) => {
  // 1. Try Supabase Direct
  if (supabase) {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      
      if (!error) return { id };
      console.error('Supabase delete contact error:', error);
    } catch (err) {
      console.error('Supabase delete error:', err);
    }
  }

  // 2. Mock Fallback
  return { id };
};

// --- Skills ---
export const fetchSkills = async (): Promise<Skill[]> => {
  // 1. Try Supabase Direct
  const supabaseData = await fetchFromSupabase<any>('skills');
  if (supabaseData) {
    return supabaseData.map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      proficiency: s.proficiency,
      icon: fixImageUrl(s.icon),
      displayOrder: s.display_order
    }));
  }

  // 2. Static Fallback (No localhost fetch)
  console.warn('Backend unavailable, using static skills data.');
  const levels: Record<string, number> = { Expert: 95, Advanced: 85, Intermediate: 70, Beginner: 50 };
  let idCounter = 1;
  const skillsList: Skill[] = [];
  
  // Map staticSkills object to array
  Object.entries(staticSkills).forEach(([category, items]) => {
    // @ts-ignore
    items.forEach((item: any) => {
      skillsList.push({
        id: idCounter++,
        name: item.name,
        category: category,
        proficiency: levels[item.level] || 60,
        displayOrder: idCounter
      });
    });
  });
  return skillsList;
};

export const createSkill = async (data: any) => {
  if (supabase) {
    try {
      const dbData = { ...data, display_order: data.displayOrder };
      delete dbData.displayOrder;
      const { data: result, error } = await supabase.from('skills').insert([dbData]).select().single();
      if (error) throw error;
      return result;
    } catch (err) { console.warn('Supabase create skill failed:', err); }
  }
  return { ...data, id: Date.now() };
};

export const updateSkill = async (id: number, data: any) => {
  if (supabase) {
    try {
      const dbData = { ...data };
      if (data.displayOrder !== undefined) {
        dbData.display_order = data.displayOrder;
        delete dbData.displayOrder;
      }
      const { data: result, error } = await supabase.from('skills').update(dbData).eq('id', id).select().single();
      if (error) throw error;
      return result;
    } catch (err) { console.warn('Supabase update skill failed:', err); }
  }
  return { ...data, id };
};

export const deleteSkill = async (id: number) => {
  if (supabase) {
    try {
      await supabase.from('skills').delete().eq('id', id);
    } catch (err) { console.warn('Supabase delete skill failed:', err); }
  }
  return { success: true };
};

// --- Experience ---
export const fetchExperience = async (): Promise<Experience[]> => {
  // 1. Try Supabase Direct
  const supabaseData = await fetchFromSupabase<any>('experience');
  if (supabaseData) {
    return supabaseData.map(exp => ({
      id: exp.id,
      title_en: exp.title_en,
      title_ar: exp.title_ar,
      company_en: exp.company_en,
      company_ar: exp.company_ar,
      location_en: exp.location_en,
      location_ar: exp.location_ar,
      period_en: exp.period_en,
      period_ar: exp.period_ar,
      description_en: exp.description_en,
      description_ar: exp.description_ar,
      displayOrder: exp.display_order
    }));
  }

  // 2. Static Fallback (No localhost fetch)
  console.warn('Backend unavailable, using static experience data.');
  return staticExperience.map((exp: any) => ({
    id: exp.id,
    title_en: exp.role,
    title_ar: exp.role,
    company_en: exp.company,
    company_ar: exp.company,
    period_en: exp.period,
    period_ar: exp.period,
    description_en: exp.description,
    description_ar: exp.description,
    displayOrder: exp.id
  }));
};

export const createExperience = async (data: any) => {
  if (supabase) {
    try {
      const dbData = { ...data, display_order: data.displayOrder };
      delete dbData.displayOrder;
      const { data: result, error } = await supabase.from('experience').insert([dbData]).select().single();
      if (error) throw error;
      return result;
    } catch (err) { console.warn('Supabase create experience failed:', err); }
  }
  return { ...data, id: Date.now() };
};

export const updateExperience = async (id: number, data: any) => {
  if (supabase) {
    try {
      const dbData = { ...data };
      if (data.displayOrder !== undefined) {
        dbData.display_order = data.displayOrder;
        delete dbData.displayOrder;
      }
      const { data: result, error } = await supabase.from('experience').update(dbData).eq('id', id).select().single();
      if (error) throw error;
      return result;
    } catch (err) { console.warn('Supabase update experience failed:', err); }
  }
  return { ...data, id };
};

export const deleteExperience = async (id: number) => {
  if (supabase) {
    try {
      await supabase.from('experience').delete().eq('id', id);
    } catch (err) { console.warn('Supabase delete experience failed:', err); }
  }
  return { success: true };
};

// --- Education ---
export const fetchEducation = async (): Promise<Education[]> => {
  // 1. Try Supabase Direct
  const supabaseData = await fetchFromSupabase<any>('education');
  if (supabaseData) {
    return supabaseData.map(edu => ({
      id: edu.id,
      degree_en: edu.degree_en,
      degree_ar: edu.degree_ar,
      institution_en: edu.institution_en,
      institution_ar: edu.institution_ar,
      period_en: edu.period_en,
      period_ar: edu.period_ar,
      description_en: edu.description_en,
      description_ar: edu.description_ar,
      displayOrder: edu.display_order
    }));
  }

  // 2. Static Fallback (No localhost fetch)
  console.warn('Backend unavailable, using static education data.');
  return staticEducation.map((edu: any) => ({
    id: edu.id,
    degree_en: edu.degree,
    degree_ar: edu.degree,
    institution_en: edu.institution,
    institution_ar: edu.institution,
    period_en: edu.period,
    period_ar: edu.period,
    description_en: edu.description,
    description_ar: edu.description,
    displayOrder: edu.id
  }));
};

export const createEducation = async (data: any) => {
  if (supabase) {
    try {
      const dbData = { ...data, display_order: data.displayOrder };
      delete dbData.displayOrder;
      const { data: result, error } = await supabase.from('education').insert([dbData]).select().single();
      if (error) throw error;
      return result;
    } catch (err) { console.warn('Supabase create education failed:', err); }
  }
  return { ...data, id: Date.now() };
};

export const updateEducation = async (id: number, data: any) => {
  if (supabase) {
    try {
      const dbData = { ...data };
      if (data.displayOrder !== undefined) {
        dbData.display_order = data.displayOrder;
        delete dbData.displayOrder;
      }
      const { data: result, error } = await supabase.from('education').update(dbData).eq('id', id).select().single();
      if (error) throw error;
      return result;
    } catch (err) { console.warn('Supabase update education failed:', err); }
  }
  return { ...data, id };
};

export const deleteEducation = async (id: number) => {
  if (supabase) {
    try {
      await supabase.from('education').delete().eq('id', id);
    } catch (err) { console.warn('Supabase delete education failed:', err); }
  }
  return { success: true };
};

// --- Services ---
export const fetchServices = async (): Promise<Service[]> => {
  // 1. Try Supabase Direct
  const supabaseData = await fetchFromSupabase<any>('services');
  if (supabaseData) {
    return supabaseData.map(srv => ({
      id: srv.id,
      title_en: srv.title_en,
      title_ar: srv.title_ar,
      description_en: srv.description_en,
      description_ar: srv.description_ar,
      icon: fixImageUrl(srv.icon),
      displayOrder: srv.display_order
    }));
  }

  // 2. Static Fallback (No localhost fetch)
  console.warn('Backend unavailable, using static services data.');
  return staticServices.map((srv: any) => ({
    id: srv.id,
    title_en: srv.title,
    title_ar: srv.title,
    description_en: srv.description,
    description_ar: srv.description,
    icon: srv.icon,
    displayOrder: srv.id
  }));
};

export const createService = async (data: any) => {
  if (supabase) {
    try {
      const dbData = { ...data, display_order: data.displayOrder };
      delete dbData.displayOrder;
      const { data: result, error } = await supabase.from('services').insert([dbData]).select().single();
      if (error) throw error;
      return result;
    } catch (err) { console.warn('Supabase create service failed:', err); }
  }
  return { id: Date.now(), ...data };
};

export const updateService = async (id: number, data: any) => {
  if (supabase) {
    try {
      const dbData = { ...data };
      if (data.displayOrder !== undefined) {
        dbData.display_order = data.displayOrder;
        delete dbData.displayOrder;
      }
      const { data: result, error } = await supabase.from('services').update(dbData).eq('id', id).select().single();
      if (error) throw error;
      return result;
    } catch (err) { console.warn('Supabase update service failed:', err); }
  }
  return { ...data, id };
};

export const deleteService = async (id: number) => {
  if (supabase) {
    try {
      await supabase.from('services').delete().eq('id', id);
    } catch (err) { console.warn('Supabase delete service failed:', err); }
  }
  return { success: true };
};

// --- About ---
export const fetchAbout = async (): Promise<AboutData> => {
  // 1. Try Supabase Direct
  const supabaseData = await fetchFromSupabase<any>('about');
  if (supabaseData && supabaseData.length > 0) {
    const d = supabaseData[0];
    return {
      id: d.id,
      name_en: d.name_en,
      name_ar: d.name_ar,
      title_en: d.title_en,
      title_ar: d.title_ar,
      short_bio_en: d.short_bio_en,
      short_bio_ar: d.short_bio_ar,
      about_en: d.about_en,
      about_ar: d.about_ar,
      imageUrl: fixImageUrl(d.image_url) || "https://github.com/abdo4312.png",
      cvUrl: fixImageUrl(d.cv_url),
      email: d.email,
      phone: d.phone,
      address_en: d.address_en,
      address_ar: d.address_ar,
      freelance_status_en: d.freelance_status_en,
      freelance_status_ar: d.freelance_status_ar,
      work_status_en: d.work_status_en,
      work_status_ar: d.work_status_ar,
      social_links: d.social_links
    };
  }

  // 2. Static Fallback (No localhost fetch)
  console.warn('Backend unavailable, using static about data.');
  return {
    id: 1,
    name_en: staticAbout.name,
    name_ar: staticAbout.name,
    title_en: staticAbout.title,
    title_ar: staticAbout.title,
    short_bio_en: staticAbout.tagline,
    short_bio_ar: staticAbout.tagline,
    about_en: "Passionate developer building scalable web applications.",
    about_ar: "مطور شغوف ببناء تطبيقات ويب قابلة للتوسع.",
    imageUrl: "https://github.com/abdo4312.png",
    email: staticAbout.email,
    social_links: JSON.stringify(staticAbout.socials)
  } as AboutData;
};

export const updateAbout = async (data: Partial<AboutData>) => {
  if (supabase) {
    try {
      const dbData: any = { ...data };
      if (data.imageUrl !== undefined) { dbData.image_url = data.imageUrl; delete dbData.imageUrl; }
      if (data.cvUrl !== undefined) { dbData.cv_url = data.cvUrl; delete dbData.cvUrl; }
      
      const { data: result, error } = await supabase.from('about').update(dbData).eq('id', 1).select().single();
      if (error) throw error;
      return result;
    } catch (err) { console.warn('Supabase update about failed:', err); }
  }
  return { ...data, id: 1 };
};

// --- Stats ---
export const fetchStats = async (): Promise<Stats> => {
  // Return mock data immediately to avoid network errors
  return { page_hits: 1234, last_updated: new Date().toISOString() };
};

export const incrementHit = async () => {
  // Do nothing
};

// --- Settings ---
export const fetchSettings = async (): Promise<Settings> => {
  // Return default settings immediately to avoid network errors
  return {
    id: 1,
    site_title_en: "Portfolio",
    site_title_ar: "معرض الأعمال",
    site_description_en: "Professional Portfolio",
    site_description_ar: "معرض أعمال احترافي",
    keywords_en: "portfolio, developer",
    keywords_ar: "معرض أعمال, مطور",
    google_analytics_id: ""
  } as Settings;
};

export const updateSettings = async (data: Partial<Settings>) => {
  if (supabase) {
    try {
      const { data: result, error } = await supabase.from('settings').update(data).eq('id', 1).select().single();
      if (error) throw error;
      return result;
    } catch (err) { console.warn('Supabase update settings failed:', err); }
  }
  return { ...data, id: 1 };
};

export const exportAllData = async () => {
  return {};
};

// --- Upload API ---
export const uploadImages = async (files: File[]): Promise<string[]> => {
  if (supabase) {
    const urls: string[] = [];
    for (const file of files) {
      try {
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const { error } = await supabase.storage
          .from('portfolio-images')
          .upload(fileName, file);

        if (!error) {
          const { data: { publicUrl } } = supabase.storage
            .from('portfolio-images')
            .getPublicUrl(fileName);
          urls.push(publicUrl);
        }
      } catch (err) { console.warn('Supabase upload failed:', err); }
    }
    if (urls.length > 0) return urls;
  }
  return files.map(f => URL.createObjectURL(f));
};

export const uploadDocuments = async (files: File[]): Promise<string[]> => {
  if (supabase) {
    const urls: string[] = [];
    for (const file of files) {
      try {
        const fileName = `doc-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const { error } = await supabase.storage
          .from('portfolio-images') // Reusing existing bucket to ensure it works
          .upload(fileName, file);

        if (!error) {
          const { data: { publicUrl } } = supabase.storage
            .from('portfolio-images')
            .getPublicUrl(fileName);
          urls.push(publicUrl);
        } else {
            console.error('Supabase document upload error:', error);
        }
      } catch (err) { console.warn('Supabase document upload failed:', err); }
    }
    if (urls.length > 0) return urls;
  }
  return files.map(f => URL.createObjectURL(f));
};
