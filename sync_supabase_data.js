import { createClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://bhccyhgcbjbkbgmwtrde.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoY2N5aGdjYmpia2JnbXd0cmRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MTY2NDUsImV4cCI6MjA4NjI5MjY0NX0.wS-JAayOie4W2rvJb_sXV1zDkQ6HcQqYks2w4O9K1vE';

const supabase = createClient(FALLBACK_URL, FALLBACK_KEY);

const newProjects = [
  {
    id: 1,
    title: "Tafaneen Order Bloom",
    description: "An advanced e-commerce platform built for high-performance and scalability.",
    tech_stack: JSON.stringify(["React", "TypeScript", "Tailwind", "Supabase", "Radix UI"]),
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2089&auto=format&fit=crop",
    github_url: "https://github.com/abdo4312",
    live_url: "#",
    category: "Web Development",
    is_featured: true,
    display_order: 1
  },
  {
    id: 2,
    title: "Maktaba Pro",
    description: "A comprehensive desktop library management system for professional book organization.",
    tech_stack: JSON.stringify(["Electron", "React", "TypeScript", "SQLite"]),
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2090&auto=format&fit=crop",
    github_url: "https://github.com/abdo4312",
    live_url: "#",
    category: "Desktop Apps",
    is_featured: true,
    display_order: 2
  },
  {
    id: 3,
    title: "Money Tracker",
    description: "A robust expense management application with detailed analytics and visualization.",
    tech_stack: JSON.stringify(["React", "TypeScript", "Material-UI", "Recharts"]),
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2111&auto=format&fit=crop",
    github_url: "https://github.com/abdo4312",
    live_url: "#",
    category: "Web Development",
    is_featured: true,
    display_order: 3
  },
  {
    id: 4,
    title: "E-Library",
    description: "An AI-powered digital library featuring smart search and content analysis.",
    tech_stack: JSON.stringify(["React 19", "Supabase", "Google Gemini AI", "Capacitor"]),
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2128&auto=format&fit=crop",
    github_url: "https://github.com/abdo4312",
    live_url: "#",
    category: "Mobile & AI",
    is_featured: true,
    display_order: 4
  }
];

const newAbout = {
  id: 1,
  name_en: "Abdelrhman Khaled",
  name_ar: "عبدالرحمن خالد",
  title_en: "Frontend Developer & UI/UX Enthusiast",
  title_ar: "مطور واجهات أمامية وشغوف بتصميم واجهة المستخدم",
  short_bio_en: "Abdelrhman Khaled is a Frontend Developer & UI/UX Enthusiast with a strong focus on creating clear, impactful, and purpose-driven visual designs.",
  short_bio_ar: "عبدالرحمن خالد هو مطور واجهات أمامية ومصمم واجهة مستخدم يركز بشدة على إنشاء تصميمات مرئية واضحة ومؤثرة وهادفة.",
  email: "abdorhamnk134@gmail.com",
  social_links: JSON.stringify({
    linkedin: "https://linkedin.com/in/abdelrhman-khaled",
    github: "https://github.com/abdo4312",
    twitter: "https://twitter.com"
  }),
  is_available: true
};

async function syncData() {
  console.log("Syncing projects...");
  for (const project of newProjects) {
    const { error } = await supabase.from('projects').upsert(project);
    if (error) console.error(`Error upserting project ${project.title}:`, error);
    else console.log(`Upserted project: ${project.title}`);
  }

  console.log("Syncing about data...");
  const { error: aboutError } = await supabase.from('about').upsert(newAbout);
  if (aboutError) console.error("Error upserting about data:", aboutError);
  else console.log("Upserted about data successfully.");

  // Delete old projects (ids not in newProjects)
  const newIds = newProjects.map(p => p.id);
  const { error: deleteError } = await supabase.from('projects').delete().not('id', 'in', `(${newIds.join(',')})`);
  if (deleteError) console.error("Error deleting old projects:", deleteError);
  else console.log("Cleaned up old projects.");
}

syncData();
