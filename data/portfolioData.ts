import { Terminal, Layout, Database, Server, Smartphone, Globe, Cloud, Code } from 'lucide-react';

export const personalInfo = {
  name: "Abdelrhman Khaled",
  title: "Frontend Developer & UI/UX Enthusiast",
  tagline: "Abdelrhman Khaled is a Frontend Developer & UI/UX Enthusiast with a strong focus on creating clear, impactful, and purpose-driven visual designs.",
  email: "abdorhamnk134@gmail.com",
  socials: {
    linkedin: "https://linkedin.com/in/abdelrhman-khaled",
    github: "https://github.com/abdo4312",
    twitter: "https://twitter.com"
  }
};

export const skills = {
  design: [
    { name: "React", level: "Expert" },
    { name: "TypeScript", level: "Expert" },
    { name: "Tailwind CSS", level: "Expert" },
    { name: "Figma", level: "Advanced" }
  ],
  tools: [
    { name: "Supabase", level: "Advanced" },
    { name: "Radix UI", level: "Advanced" },
    { name: "Material-UI", level: "Advanced" },
    { name: "Electron", level: "Advanced" }
  ],
  other: []
};

export const experience = [
  {
    id: 1,
    role: "Frontend Developer",
    company: "Freelance",
    period: "2020 - Present",
    description: "Building responsive and performant web applications using modern React ecosystems.",
    technologies: ["React", "TypeScript", "Tailwind"]
  }
];

export const projects = [
  {
    id: 1,
    title: "Tafaneen Order Bloom",
    description: "An advanced e-commerce platform built for high-performance and scalability.",
    techStack: ["React", "TypeScript", "Tailwind", "Supabase", "Radix UI"],
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2089&auto=format&fit=crop",
    githubUrl: "https://github.com/abdo4312",
    liveUrl: "#"
  },
  {
    id: 2,
    title: "Maktaba Pro",
    description: "A comprehensive desktop library management system for professional book organization.",
    techStack: ["Electron", "React", "TypeScript", "SQLite"],
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2090&auto=format&fit=crop",
    githubUrl: "https://github.com/abdo4312",
    liveUrl: "#"
  },
  {
    id: 3,
    title: "Money Tracker",
    description: "A robust expense management application with detailed analytics and visualization.",
    techStack: ["React", "TypeScript", "Material-UI", "Recharts"],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2111&auto=format&fit=crop",
    githubUrl: "https://github.com/abdo4312",
    liveUrl: "#"
  },
  {
    id: 4,
    title: "E-Library",
    description: "An AI-powered digital library featuring smart search and content analysis.",
    techStack: ["React 19", "Supabase", "Google Gemini AI", "Capacitor"],
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2128&auto=format&fit=crop",
    githubUrl: "https://github.com/abdo4312",
    liveUrl: "#"
  }
];

export const services = [
  {
    id: 1,
    title: "Frontend Development",
    description: "Building fast, interactive, and responsive web applications using React and TypeScript.",
    icon: "code"
  },
  {
    id: 2,
    title: "UI/UX Design",
    description: "Creating intuitive user interfaces and seamless user experiences with a focus on usability.",
    icon: "layout"
  },
  {
    id: 3,
    title: "Cross-Platform Apps",
    description: "Developing desktop and mobile applications using Electron and Capacitor.",
    icon: "smartphone"
  },
  {
    id: 4,
    title: "AI Integration",
    description: "Enhancing applications with AI capabilities using Google Gemini and other LLMs.",
    icon: "terminal"
  }
];

export const education = [
  {
    id: 1,
    degree: "Bachelor's Degree",
    institution: "University",
    period: "2016 - 2020",
    description: "Specialized in Computer Science and Software Engineering."
  }
];

export const navLinks = [
  { name: 'About', href: '/#about' },
  { name: 'Services', href: '/#services' },
  { name: 'Skills', href: '/#skills' },
  { name: 'Experience', href: '/#experience' },
  { name: 'Projects', href: '/#projects' },
  { name: 'Contact', href: '/contact' },
];