import { 
  projects as staticProjects, 
  skills as staticSkills, 
  experience as staticExperience, 
  education as staticEducation, 
  services as staticServices, 
  personalInfo as staticAbout 
} from '../data/portfolioData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --- Types ---
export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  image?: string;
  gallery?: string[];
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
  const formData = new FormData();
  formData.append('images', file);

  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: { ...getAuthHeader() },
    body: formData
  });

  if (!res.ok) throw new Error('Failed to upload image');
  const result = await res.json();
  return result.data[0];
};



// --- Auth API ---
export const login = async (username, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
};

export const changePassword = async (newPassword: string) => {
  const res = await fetch(`${API_URL}/auth/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ newPassword })
  });
  if (!res.ok) throw new Error('Failed to update password');
  return res.json();
};

export const logout = async () => {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error('Logout failed');
  // Clear token from localStorage
  localStorage.removeItem('token');
  return res.json();
};

// --- Projects API ---
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch(`${API_URL}/projects`);
    if (!response.ok) throw new Error(response.statusText);
    const result = await response.json();
    return result.data.map((p: any) => ({
      ...p,
      techStack: typeof p.techStack === 'string' ? JSON.parse(p.techStack) : (p.techStack || []),
      gallery: typeof p.gallery === 'string' ? JSON.parse(p.gallery) : (p.gallery || [])
    }));
  } catch (error) {
    console.warn('Backend unavailable, using static data.');
    return staticProjects.map(p => ({
      ...p,
      category: 'Web Development',
      isFeatured: false,
      displayOrder: 0,
      techStack: p.techStack || []
    })) as Project[];
  }
};

export const createProject = async (data: Omit<Project, 'id' | 'createdAt'>) => {
  const res = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const deleteProject = async (id: number) => {
  await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() }
  });
};

export const updateProject = async (id: number, data: Partial<Project>) => {
  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update project');
  return res.json();
};

// --- Contact API ---
export const sendContactMessage = async (data: ContactForm) => {
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return { success: true, message: result.message };
  } catch (error) {
    return { success: true, message: 'Message sent! (Demo Mode)' };
  }
};

export const fetchContacts = async (): Promise<ContactMessage[]> => {
  const res = await fetch(`${API_URL}/contact`, {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) return [];
  const result = await res.json();
  return result.data;
};

export const updateContactStatus = async (id: number, isRead: boolean) => {
  const res = await fetch(`${API_URL}/contact/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ isRead })
  });
  if (!res.ok) throw new Error('Failed to update message status');
  return res.json();
};

export const deleteContact = async (id: number) => {
  const res = await fetch(`${API_URL}/contact/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error('Failed to delete message');
  return res.json();
};

// --- Skills ---
export const fetchSkills = async (): Promise<Skill[]> => {
  try {
    const res = await fetch(`${API_URL}/skills`);
    if (!res.ok) throw new Error('Failed to fetch skills');
    const result = await res.json();
    return result.data;
  } catch (error) {
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
  }
};

export const createSkill = async (data: any) => {
  const res = await fetch(`${API_URL}/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create skill');
  return res.json();
};

export const updateSkill = async (id: number, data: any) => {
  const res = await fetch(`${API_URL}/skills/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update skill');
  return res.json();
};

export const deleteSkill = async (id: number) => {
  const res = await fetch(`${API_URL}/skills/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error('Failed to delete skill');
  return res.json();
};

// --- Experience ---
export const fetchExperience = async (): Promise<Experience[]> => {
  try {
    const res = await fetch(`${API_URL}/experience`);
    if (!res.ok) throw new Error('Failed to fetch experience');
    const result = await res.json();
    return result.data;
  } catch (error) {
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
  }
};

export const createExperience = async (data: any) => {
  const res = await fetch(`${API_URL}/experience`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const updateExperience = async (id: number, data: any) => {
  const res = await fetch(`${API_URL}/experience/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const deleteExperience = async (id: number) => {
  await fetch(`${API_URL}/experience/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() }
  });
};

// --- Education ---
export const fetchEducation = async (): Promise<Education[]> => {
  try {
    const res = await fetch(`${API_URL}/education`);
    if (!res.ok) throw new Error('Failed to fetch education');
    const result = await res.json();
    return result.data;
  } catch (error) {
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
  }
};

export const createEducation = async (data: any) => {
  const res = await fetch(`${API_URL}/education`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const updateEducation = async (id: number, data: any) => {
  const res = await fetch(`${API_URL}/education/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const deleteEducation = async (id: number) => {
  await fetch(`${API_URL}/education/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() }
  });
};

// --- Services ---
export const fetchServices = async (): Promise<Service[]> => {
  try {
    const res = await fetch(`${API_URL}/services`);
    if (!res.ok) throw new Error('Failed to fetch services');
    const result = await res.json();
    return result.data;
  } catch (error) {
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
  }
};

export const createService = async (data: any) => {
  const res = await fetch(`${API_URL}/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const updateService = async (id: number, data: any) => {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const deleteService = async (id: number) => {
  await fetch(`${API_URL}/services/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() }
  });
};

// --- About ---
export const fetchAbout = async (): Promise<AboutData> => {
  try {
    const res = await fetch(`${API_URL}/about`);
    if (!res.ok) throw new Error('Failed to fetch about data');
    const result = await res.json();
    return result.data;
  } catch (error) {
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
  }
};

export const updateAbout = async (data: Partial<AboutData>) => {
  const res = await fetch(`${API_URL}/about`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update personal info');
  return res.json();
};

// --- Stats ---
export const fetchStats = async (): Promise<Stats> => {
  const res = await fetch(`${API_URL}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  const result = await res.json();
  return result.data;
};

export const incrementHit = async () => {
  await fetch(`${API_URL}/stats/increment`, { method: 'POST' });
};

// --- Settings ---
export const fetchSettings = async (): Promise<Settings> => {
  const res = await fetch(`${API_URL}/settings`);
  if (!res.ok) throw new Error('Failed to fetch settings');
  const result = await res.json();
  return result.data;
};

export const updateSettings = async (data: Partial<Settings>) => {
  const res = await fetch(`${API_URL}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
};

export const exportAllData = async () => {
  const res = await fetch(`${API_URL}/settings/export`, {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error('Failed to export data');
  const result = await res.json();
  return result.data;
};

// --- Upload API ---
export const uploadImages = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });

  // Note: Do not set Content-Type header when sending FormData
  // The browser will automatically set it with the boundary
  const token = localStorage.getItem('token');
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: headers,
    body: formData
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(errorData.message || 'Upload failed');
  }

  const result = await res.json();
  return result.data;
};