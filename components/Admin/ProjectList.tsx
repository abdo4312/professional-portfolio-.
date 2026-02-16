import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProjects, deleteProject, Project } from '../../services/api';
import { useLanguage } from '../../services/LanguageContext';
import { showSuccess, showError } from '../../services/toast';
import Button from '../UI/Button';
import { Plus, Search, Edit2, Trash2, ExternalLink, Star } from 'lucide-react';
import { cn } from '../../services/utils';

const ProjectList: React.FC = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const data = await fetchProjects();
            setProjects(data);
        } catch (error) {
            console.error('Error loading projects', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm(language === 'en' ? 'Are you sure you want to delete this project?' : 'هل أنت متأكد من حذف هذا المشروع؟')) {
            try {
                await deleteProject(id);
                setProjects(projects.filter(p => p.id !== id));
                showSuccess(language === 'en' ? 'Project deleted successfully' : 'تم حذف المشروع بنجاح');
            } catch (error) {
                console.error('Error deleting project', error);
                showError(language === 'en' ? 'Failed to delete project' : 'فشل حذف المشروع');
            }
        }
    };

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">
                    {language === 'en' ? 'Projects Management' : 'إدارة المشاريع'}
                </h2>
                <Button
                    onClick={() => navigate('/admin/projects/new')}
                    className="flex items-center gap-2"
                >
                    <Plus size={18} />
                    {language === 'en' ? 'Add Project' : 'إضافة مشروع'}
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder={language === 'en' ? 'Search projects...' : 'بحث في المشاريع...'}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
                    ))
                ) : filteredProjects.map((project) => (
                    <div
                        key={project.id}
                        className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all"
                    >
                        {/* Project Image Preview */}
                        <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                            {project.image ? (
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400">
                                    No Image
                                </div>
                            )}
                            {project.isFeatured && (
                                <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 p-1.5 rounded-full shadow-lg">
                                    <Star size={16} fill="currentColor" />
                                </div>
                            )}
                        </div>

                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
                                    {project.category || 'Uncategorized'}
                                </span>
                                <span className="text-xs text-slate-400">#{project.displayOrder}</span>
                            </div>
                            <h3 className="text-lg font-bold mb-4 line-clamp-1">{project.title}</h3>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/admin/projects/edit/${project.id}`)}
                                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {(project.liveUrl || project.githubUrl) && (
                                    <div className="flex gap-2">
                                        {project.liveUrl && (
                                            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && filteredProjects.length === 0 && (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-500">
                    {language === 'en' ? 'No projects found.' : 'لم يتم العثور على مشاريع.'}
                </div>
            )}
        </div>
    );
};

export default ProjectList;
