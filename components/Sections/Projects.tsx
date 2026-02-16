import React, { useEffect, useState } from 'react';
import SectionWrapper from '../UI/SectionWrapper';
import { fetchProjects, fetchAbout, Project, AboutData } from '../../services/api';
import { useLanguage } from '../../services/LanguageContext';
import { Github, ExternalLink, Loader2, Eye } from 'lucide-react';
import ProjectModal from '../UI/ProjectModal';

const Projects: React.FC = () => {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    Promise.all([fetchProjects(), fetchAbout()])
      .then(([projData, about]) => {
        setProjects(projData);
        setAboutData(about);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const socialLinks = aboutData?.social_links ? JSON.parse(aboutData.social_links) : {};

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  // Filter projects
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <SectionWrapper id="projects" background="gray">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-primary-600 uppercase mb-3">
            {language === 'en' ? 'Portfolio' : 'معرض الأعمال'}
          </h2>
          <h3 className="text-3xl font-bold text-slate-900">
            {language === 'en' ? 'Featured Projects' : 'مشاريع مختارة'}
          </h3>
        </div>
        {socialLinks.github && (
          <a href={socialLinks.github} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-primary-600 font-medium flex items-center gap-2 transition-colors">
            {language === 'en' ? 'View GitHub Profile' : 'مشاهدة الملف على GitHub'} <ExternalLink size={16} />
          </a>
        )}
      </div>

      {/* Category Filter */}
      {!loading && categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {category === 'All' ? (language === 'en' ? 'All Projects' : 'كل المشاريع') : category}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-primary-600 w-8 h-8" />
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                onClick={() => setSelectedProject(project)}
                className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer"
              >
                <div className="relative overflow-hidden aspect-video bg-slate-200">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium flex items-center gap-2">
                      <Eye size={20} />
                      {language === 'en' ? 'View Details' : 'عرض التفاصيل'}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h4>
                  <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-grow">{project.description}</p>

                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map(tech => (
                        <span key={tech} className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-slate-100 mt-auto">
                    {project.liveUrl && project.liveUrl !== '#' && (
                      <a
                        href={project.liveUrl}
                        target="_blank" rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-primary-600 transition-colors"
                      >
                        <ExternalLink size={16} /> {language === 'en' ? 'Live Demo' : 'عرض مباشر'}
                      </a>
                    )}
                    {project.githubUrl && project.githubUrl !== '#' && (
                      <a
                        href={project.githubUrl}
                        target="_blank" rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-primary-600 transition-colors"
                      >
                        <Github size={16} /> {language === 'en' ? 'Source Code' : 'الكود المصدري'}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

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