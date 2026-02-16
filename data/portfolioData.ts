import { Terminal, Layout, Database, Server, Smartphone, Globe, Cloud, Code } from 'lucide-react';

export const personalInfo = {
  name: "Abdelrhman Khaled",
  title: "Senior Full Stack Engineer",
  tagline: "Building scalable, user-centric digital solutions for enterprise clients.",
  email: "contact@abdelrhmankhaled.com",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com"
  }
};

export const skills = {
  frontend: [
    { name: "React / Next.js", level: "Expert" },
    { name: "TypeScript", level: "Expert" },
    { name: "Tailwind CSS", level: "Advanced" },
    { name: "Framer Motion", level: "Advanced" }
  ],
  backend: [
    { name: "Node.js", level: "Advanced" },
    { name: "PostgreSQL", level: "Advanced" },
    { name: "GraphQL", level: "Intermediate" },
    { name: "Python", level: "Intermediate" }
  ],
  tools: [
    { name: "Docker", level: "Advanced" },
    { name: "AWS", level: "Intermediate" },
    { name: "CI/CD", level: "Advanced" },
    { name: "Figma", level: "Intermediate" }
  ]
};

export const experience = [
  {
    id: 1,
    role: "Senior Software Engineer",
    company: "TechFlow Solutions",
    period: "2021 - Present",
    description: "Leading the frontend architecture for a high-traffic SaaS platform. Improved load times by 40% and mentored junior developers.",
    technologies: ["React", "TypeScript", "Node.js", "AWS"]
  },
  {
    id: 2,
    role: "Full Stack Developer",
    company: "Innovate Corp",
    period: "2018 - 2021",
    description: "Developed and maintained multiple client-facing applications. Collaborated with design teams to implement pixel-perfect UIs.",
    technologies: ["Vue.js", "Django", "PostgreSQL", "Redis"]
  },
  {
    id: 3,
    role: "Junior Web Developer",
    company: "Creative Digital",
    period: "2016 - 2018",
    description: "Assisted in building responsive websites for various clients. Gained strong foundation in semantic HTML, CSS, and JavaScript.",
    technologies: ["HTML5", "Sass", "JavaScript", "jQuery"]
  }
];

export const projects = [
  {
    id: 1,
    title: "E-Commerce Dashboard",
    description: "A comprehensive analytics dashboard for e-commerce store owners to track real-time sales, inventory, and customer insights.",
    techStack: ["React", "D3.js", "Firebase", "Tailwind"],
    image: "https://picsum.photos/600/400?random=1",
    githubUrl: "#",
    liveUrl: "#"
  },
  {
    id: 2,
    title: "Task Management API",
    description: "A robust RESTful API for project management tools, featuring secure authentication, real-time updates via WebSockets, and file handling.",
    techStack: ["Node.js", "Express", "MongoDB", "Docker"],
    image: "https://picsum.photos/600/400?random=2",
    githubUrl: "#",
    liveUrl: "#"
  },
  {
    id: 3,
    title: "Finance Tracker App",
    description: "Mobile-first web application for personal finance tracking, featuring budget planning and expense categorization with intuitive charts.",
    techStack: ["Next.js", "Chart.js", "Prisma", "PostgreSQL"],
    image: "https://picsum.photos/600/400?random=3",
    githubUrl: "#",
    liveUrl: "#"
  }
];

export const services = [
  {
    id: 1,
    title: "Web Development",
    description: "Building responsive, high-performance websites and web applications using modern technologies like React, Next.js, and Node.js.",
    icon: "code"
  },
  {
    id: 2,
    title: "Mobile App Development",
    description: "Creating cross-platform mobile applications for iOS and Android using React Native and Flutter.",
    icon: "smartphone"
  },
  {
    id: 3,
    title: "UI/UX Design",
    description: "Designing intuitive and visually appealing user interfaces with a focus on user experience and accessibility.",
    icon: "palette"
  },
  {
    id: 4,
    title: "Cloud Solutions",
    description: "Deploying and managing scalable cloud infrastructure using AWS, Google Cloud, and Docker.",
    icon: "cloud"
  }
];

export const education = [
  {
    id: 1,
    degree: "Bachelor of Science in Computer Science",
    institution: "Cairo University",
    period: "2012 - 2016",
    description: "Focus on Software Engineering, Algorithms, and Data Structures. Graduated with Honors."
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