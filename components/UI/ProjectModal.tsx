import React, { useState } from 'react';
import { X, Github, ExternalLink, ChevronLeft, ChevronRight, Info, Layers, Wrench, Globe } from 'lucide-react';
import { Project } from '../../services/api';
import { useLanguage } from '../../services/LanguageContext';

interface ProjectModalProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
    const { language } = useLanguage();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!isOpen) return null;

    // Combine main image and gallery
    const galleryImages = Array.isArray(project.gallery) ? project.gallery : [];
    const allImages = [project.image, ...galleryImages].filter(Boolean);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    const isRTL = language === 'ar';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
            <div 
                className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-slate-200 dark:border-slate-800"
                onClick={(e) => e.stopPropagation()}
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                <button 
                    onClick={onClose}
                    className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-30 p-2.5 
                        bg-white/80 hover:bg-white text-slate-700 
                        dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-200 
                        backdrop-blur-md rounded-full transition-all border 
                        border-slate-200/50 dark:border-slate-700/50 shadow-sm`}
                >
                    <X size={20} />
                </button>

                {/* Left Column: Media Gallery */}
                <div className="w-full lg:w-[60%] bg-slate-100 dark:bg-black/50 relative flex flex-col h-[40vh] lg:h-full group">
                    <div className="flex-1 relative flex items-center justify-center bg-dots-pattern overflow-hidden">
                        {allImages.length > 0 ? (
                            <>
                                <img 
                                    src={allImages[currentImageIndex]} 
                                    alt={project.title} 
                                    className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-[1.02]"
                                />
                                
                                {allImages.length > 1 && (
                                    <>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); isRTL ? nextImage() : prevImage(); }}
                                            className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100 transform hover:scale-110`}
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); isRTL ? prevImage() : nextImage(); }}
                                            className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100 transform hover:scale-110`}
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center text-slate-400 gap-2">
                                <Layers size={48} className="opacity-50" />
                                <span>No images available</span>
                            </div>
                        )}
                    </div>

                    {/* Thumbnails Strip */}
                    {allImages.length > 1 && (
                        <div className="h-20 bg-white/5 dark:bg-black/40 backdrop-blur-sm border-t border-white/10 flex items-center gap-2 px-4 overflow-x-auto scrollbar-hide">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`relative flex-shrink-0 h-14 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                                        idx === currentImageIndex 
                                            ? 'border-blue-500 ring-2 ring-blue-500/20' 
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Content Details */}
                <div className="w-full lg:w-[40%] flex flex-col h-[60vh] lg:h-full bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800">
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
                        
                        {/* Header */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 flex items-center gap-1.5">
                                    <Layers size={12} />
                                    {project.category}
                                </span>
                                {project.isFeatured && (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                                        {language === 'en' ? 'Featured' : 'مميز'}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                                {project.title}
                            </h2>
                        </div>

                        {/* Project Description */}
                        <div className="space-y-3">
                            <h3 className="text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold flex items-center gap-2">
                                <Info size={16} />
                                {language === 'en' ? 'About Project' : 'عن المشروع'}
                            </h3>
                            <div className="prose dark:prose-invert prose-sm max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
                                <p>{project.description}</p>
                                {project.longDescription && (
                                    <p className="mt-4">{project.longDescription}</p>
                                )}
                            </div>
                        </div>

                        {/* Category Context (New Section) */}
                        {project.categoryDescription && (
                            <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <h3 className="text-sm uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2">
                                    <Globe size={16} />
                                    {language === 'en' ? 'Category Context' : 'سياق الفئة'}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {project.categoryDescription}
                                </p>
                            </div>
                        )}

                        {/* Tech Stack */}
                        <div className="space-y-4">
                            <h3 className="text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold flex items-center gap-2">
                                <Wrench size={16} />
                                {language === 'en' ? 'Tools & Technologies' : 'الأدوات والتقنيات'}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack.map((tech) => (
                                    <div 
                                        key={tech}
                                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 flex items-center gap-2 hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        {tech}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex flex-col sm:flex-row gap-3">
                            {project.liveUrl && (
                                <a 
                                    href={project.liveUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 font-semibold"
                                >
                                    <ExternalLink size={18} />
                                    {language === 'en' ? 'View Live Demo' : 'عرض مباشر'}
                                </a>
                            )}
                            {project.githubUrl && (
                                <a 
                                    href={project.githubUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all font-semibold"
                                >
                                    <Github size={18} />
                                    {language === 'en' ? 'Source Code' : 'الكود المصدري'}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
