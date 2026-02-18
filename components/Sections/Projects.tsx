import React, { useState } from 'react';
import SectionWrapper from '../UI/SectionWrapper';
import { Project } from '../../services/api';
import { useProjects, useAbout } from '../../hooks/usePortfolio';
import { useLanguage } from '../../services/LanguageContext';
import { Github, ExternalLink, Loader2, Eye, LayoutGrid } from 'lucide-react';
import ProjectModal from '../UI/ProjectModal';
import ProjectCard from '../UI/ProjectCard';
import { motion, AnimatePresence } from 'framer-motion';

const Projects: React.FC = () => {
  const { language } = useLanguage();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: aboutData, isLoading: aboutLoading } = useAbout();
  const loading = projectsLoading || aboutLoading;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const socialLinks = aboutData?.social_links ? JSON.parse(aboutData.social_links) : {};

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  // Filter projects
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <SectionWrapper id="projects" background="gray">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
              <LayoutGrid size={24} />
            </div>
            <h2 className="text-sm font-bold tracking-widest text-primary-600 uppercase">
              {language === 'en' ? 'Portfolio' : 'معرض الأعمال'}
            </h2>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900">
            {language === 'en' ? 'Featured Projects' : 'مشاريع مختارة'}
          </h3>
        </div>
        
        {socialLinks.github && (
          <a 
            href={socialLinks.github} 
            target="_blank" 
            rel="noreferrer" 
            className="group px-5 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold hover:border-primary-600 hover:text-primary-600 transition-all shadow-sm hover:shadow-md flex items-center gap-3"
          >
            <Github size={20} className="group-hover:scale-110 transition-transform" />
            <span>{language === 'en' ? 'View GitHub Profile' : 'تصفح حساب GitHub'}</span>
            <ExternalLink size={16} className="opacity-50 group-hover:opacity-100 transition-opacity" />
          </a>
        )}
      </div>

      {/* Category Filter */}
      {!loading && categories.length > 1 && (
        <div className="flex flex-wrap gap-3 mb-12 justify-center md:justify-start">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-primary-600 border border-slate-200 hover:border-primary-200'
              }`}
            >
              {category === 'All' ? (language === 'en' ? 'All Projects' : 'كل المشاريع') : category}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="animate-spin text-primary-600 w-10 h-10" />
        </div>
      ) : (
        <>
          <motion.div 
            layout
            className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="break-inside-avoid"
                >
                  <ProjectCard 
                    project={project} 
                    onClick={setSelectedProject} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">
                {language === 'en' ? 'No projects found in this category.' : 'لا توجد مشاريع في هذا القسم.'}
              </p>
            </div>
          )}

          {selectedProject && (
            <ProjectModal
              project={selectedProject}
              isOpen={!!selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </>
      )}
    </SectionWrapper>
  );
};

export default Projects;