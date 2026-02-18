import React from 'react';
import { Project } from '../../services/api';
import { useLanguage } from '../../services/LanguageContext';
import OptimizedImage from './OptimizedImage';
import { Github, ExternalLink, ArrowUpRight, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const { language } = useLanguage();

  // Tech stack parsing
  const techStack = Array.isArray(project.techStack) 
    ? project.techStack 
    : (typeof project.techStack === 'string' ? (project.techStack as string).split(',') : []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
      className="group relative h-[400px] w-full rounded-[2rem] overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-primary-500/20 ring-1 ring-slate-200 dark:ring-slate-800 bg-slate-900"
      onClick={() => onClick(project)}
    >
      {/* Full Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <OptimizedImage
          src={project.image || '/placeholder-project.png'}
          alt={project.title}
          className="w-full h-full"
          imageClassName="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
          width={800}
          height={600}
        />
        {/* Gradient Overlay - Always visible but stronger at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />
        
        {/* Hover Highlight Overlay */}
        <div className="absolute inset-0 bg-primary-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
      </div>

      {/* Floating Category Badge */}
      <div className="absolute top-4 left-4 z-20">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-lg">
          <Layers size={12} className="text-primary-400" />
          {project.category}
        </span>
      </div>

      {/* Action Button */}
      <div className="absolute top-4 right-4 z-20 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
        <div className="p-3 rounded-full bg-white text-slate-900 shadow-lg hover:bg-primary-500 hover:text-white transition-colors">
          <ArrowUpRight size={20} />
        </div>
      </div>

      {/* Content Container */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
        <h3 className="text-2xl font-bold text-white mb-2 line-clamp-1 group-hover:text-primary-300 transition-colors">
          {project.title}
        </h3>
        
        <p className="text-slate-300 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 h-0 group-hover:h-auto overflow-hidden">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-3">
          {techStack.slice(0, 3).map((tech, index) => (
            <span 
              key={index} 
              className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md bg-white/10 text-white/90 border border-white/10 backdrop-blur-sm"
            >
              {tech}
            </span>
          ))}
          {techStack.length > 3 && (
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-white/10 text-white/90 border border-white/10 backdrop-blur-sm">
              +{techStack.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
