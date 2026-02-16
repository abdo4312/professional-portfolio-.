import { Terminal, Layout, Database, Server, Smartphone, Globe, Cloud, Code } from 'lucide-react';

export const personalInfo = {
  name: "Abdelrhman Khaled",
  title: "Graphic Design",
  tagline: "Abdelrhman Khaled is a Graphic Designer with a strong focus on creating clear, impactful, and purpose-driven visual designs.",
  email: "abdorhamnk134@gmail.com",
  socials: {
    linkedin: "https://www.linkedin.com/in/abdelrhman-khaled-67027b1b5/",
    github: "https://github.com",
    twitter: "https://twitter.com"
  }
};

export const skills = {
  design: [
    { name: "Adobe Photoshop", level: "Expert" },
    { name: "Adobe Illustrator", level: "Expert" },
    { name: "Adobe InDesign", level: "Advanced" },
    { name: "Figma", level: "Advanced" }
  ],
  tools: [
    { name: "Visual Concepts", level: "Advanced" },
    { name: "Typography", level: "Advanced" },
    { name: "Layout & Composition", level: "Advanced" },
    { name: "Brand Identity", level: "Expert" }
  ],
  other: []
};

export const experience = [
  {
    id: 1,
    role: "Graphic Designer",
    company: "Freelance",
    period: "2020 - Present",
    description: "Delivering high-quality graphic design solutions for various clients, including logo design, branding, and marketing materials.",
    technologies: ["Photoshop", "Illustrator", "InDesign"]
  }
];

export const projects = [
  {
    id: 1,
    title: "Brand Identity Project",
    description: "Complete brand identity design including logo, business cards, and social media assets.",
    techStack: ["Illustrator", "Photoshop"],
    image: "https://images.unsplash.com/photo-1626785774573-4b799314346d?q=80&w=2070&auto=format&fit=crop",
    githubUrl: "#",
    liveUrl: "#"
  },
  {
    id: 2,
    title: "Marketing Campaign Visuals",
    description: "Designed a series of social media graphics and banners for a digital marketing campaign.",
    techStack: ["Photoshop", "Figma"],
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
    githubUrl: "#",
    liveUrl: "#"
  },
  {
    id: 3,
    title: "Corporate Brochure Design",
    description: "Designed a professional corporate brochure for a leading real estate firm.",
    techStack: ["InDesign", "Illustrator"],
    image: "https://images.unsplash.com/photo-1586717791821-3f44a5638d0f?q=80&w=1974&auto=format&fit=crop",
    githubUrl: "#",
    liveUrl: "#"
  }
];

export const services = [
  {
    id: 1,
    title: "Branding & Identity",
    description: "Logo Design, Brand Identity Systems, Brand Guidelines. Creating strong, consistent, and visually impactful brand identities.",
    icon: "palette"
  },
  {
    id: 2,
    title: "Print Design",
    description: "Business Cards, Flyers & Brochures, Posters, Packaging Design. High-quality, print-ready files tailored to your needs.",
    icon: "layout"
  },
  {
    id: 3,
    title: "Digital Design",
    description: "Social Media Graphics, Web & UI Visuals, Marketing Banners & Ads. Scalable and adaptable designs for digital use.",
    icon: "monitor"
  },
  {
    id: 4,
    title: "Creative Design",
    description: "Visual Concepts, Typography Design, Layout & Composition. Blending creativity with strategic thinking.",
    icon: "pen-tool"
  }
];

export const education = [
  {
    id: 1,
    degree: "Bachelor's Degree",
    institution: "University",
    period: "2016 - 2020",
    description: "Studied Graphic Design and Visual Communication."
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