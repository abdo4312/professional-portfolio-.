import { useQuery } from '@tanstack/react-query';
import { 
  fetchAbout, 
  fetchProjects, 
  fetchServices, 
  fetchSkills, 
  fetchExperience, 
  fetchEducation, 
  fetchSettings, 
  fetchStats,
  AboutData,
  Project,
  Service,
  Skill,
  Experience,
  Education,
  Settings,
  Stats
} from '../services/api';

// Keys for React Query
export const QUERY_KEYS = {
  about: ['about'],
  projects: ['projects'],
  services: ['services'],
  skills: ['skills'],
  experience: ['experience'],
  education: ['education'],
  settings: ['settings'],
  stats: ['stats'],
};

// Hooks
export const useAbout = () => {
  return useQuery<AboutData | null>({
    queryKey: QUERY_KEYS.about,
    queryFn: fetchAbout,
    staleTime: 0, // Always fetch fresh data to ensure updates are reflected immediately
  });
};

export const useProjects = () => {
  return useQuery<Project[]>({
    queryKey: QUERY_KEYS.projects,
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useServices = () => {
  return useQuery<Service[]>({
    queryKey: QUERY_KEYS.services,
    queryFn: fetchServices,
    staleTime: 1000 * 60 * 60,
  });
};

export const useSkills = () => {
  return useQuery<Skill[]>({
    queryKey: QUERY_KEYS.skills,
    queryFn: fetchSkills,
    staleTime: 1000 * 60 * 60,
  });
};

export const useExperience = () => {
  return useQuery<Experience[]>({
    queryKey: QUERY_KEYS.experience,
    queryFn: fetchExperience,
    staleTime: 1000 * 60 * 60,
  });
};

export const useEducation = () => {
  return useQuery<Education[]>({
    queryKey: QUERY_KEYS.education,
    queryFn: fetchEducation,
    staleTime: 1000 * 60 * 60,
  });
};

export const useSettings = () => {
  return useQuery<Settings | null>({
    queryKey: QUERY_KEYS.settings,
    queryFn: fetchSettings,
    staleTime: 1000 * 60 * 60,
  });
};

export const useStats = () => {
  return useQuery<Stats | null>({
    queryKey: QUERY_KEYS.stats,
    queryFn: fetchStats,
    // Do not cache stats too long as they change frequently
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
