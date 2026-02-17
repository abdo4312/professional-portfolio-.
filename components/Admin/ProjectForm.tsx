import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../../services/LanguageContext';
import { createProject, updateProject, fetchProjects, Project } from '../../services/api';
import { showSuccess, showError } from '../../services/toast';
import { Input, Textarea } from '../UI/FormFields';
import Button from '../UI/Button';
import ImageUpload from '../UI/ImageUpload';
import MultiImageUpload from '../UI/MultiImageUpload';
import DocumentUpload from '../UI/DocumentUpload';
import { Save, X, Plus, Trash2, Layout, Image as ImageIcon, Link as LinkIcon, Tags, Star, FileText } from 'lucide-react';

const projectSchema = z.object({
    title: z.string().min(2, 'Title is required'),
    description: z.string().min(10, 'Description is required'),
    longDescription: z.string().optional(),
    techStack: z.array(z.string()).min(1, 'At least one technology is required'),
    image: z.string().url('Invalid image URL').optional().or(z.literal('')),
    githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    liveUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    category: z.string().min(1, 'Category is required'),
    categoryDescription: z.string().optional(),
    isFeatured: z.boolean(),
    displayOrder: z.number(),
    gallery: z.array(z.string()).optional(),
    documents: z.array(z.string()).optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const ProjectForm: React.FC = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [newTag, setNewTag] = useState('');

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            techStack: [],
            gallery: [],
            documents: [],
            isFeatured: false,
            displayOrder: 0,
        },
    });

    const techStack = watch('techStack');
    const gallery = watch('gallery') || [];

    useEffect(() => {
        if (isEdit) {
            const loadProject = async () => {
                try {
                    const projects = await fetchProjects();
                    const p = projects.find(proj => proj.id === parseInt(id));
                    if (p) {
                        reset({
                            ...p,
                            isFeatured: !!p.isFeatured,
                            gallery: p.gallery || [],
                            documents: p.documents || [],
                        });
                    }
                } catch (error) {
                    console.error('Error loading project', error);
                } finally {
                    setLoading(false);
                }
            };
            loadProject();
        }
    }, [id, isEdit, reset]);

    const onSubmit = async (values: ProjectFormValues) => {
        setSaving(true);
        try {
            // Transform empty strings to undefined to match API types
            const cleanValues = {
                ...values,
                image: values.image === '' ? undefined : values.image,
                githubUrl: values.githubUrl === '' ? undefined : values.githubUrl,
                liveUrl: values.liveUrl === '' ? undefined : values.liveUrl,
                categoryDescription: values.categoryDescription || undefined,
                longDescription: values.longDescription || undefined,
                gallery: values.gallery || [],
                documents: values.documents || []
            };

            if (isEdit) {
                await updateProject(parseInt(id), cleanValues as Partial<Project>);
                showSuccess(language === 'en' ? 'Project updated successfully' : 'تم تحديث المشروع بنجاح');
            } else {
                await createProject(cleanValues as Omit<Project, 'id' | 'createdAt'>);
                showSuccess(language === 'en' ? 'Project created successfully' : 'تم إنشاء المشروع بنجاح');
            }
            navigate('/admin/projects');
        } catch (error) {
            console.error('Error saving project', error);
            showError(language === 'en' ? 'Failed to save project' : 'فشل حفظ المشروع');
        } finally {
            setSaving(false);
        }
    };

    const addTag = () => {
        if (newTag.trim() && !techStack.includes(newTag.trim())) {
            setValue('techStack', [...techStack, newTag.trim()]);
            setNewTag('');
        }
    };

    const removeTag = (tag: string) => {
        setValue('techStack', techStack.filter(t => t !== tag));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/projects')}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <h2 className="text-2xl font-bold">
                        {isEdit
                            ? (language === 'en' ? 'Edit Project' : 'تعديل مشروع')
                            : (language === 'en' ? 'Add New Project' : 'إضافة مشروع جديد')}
                    </h2>
                </div>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={saving}
                    className="flex items-center gap-2"
                >
                    {saving ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                        <Save size={18} />
                    )}
                    {language === 'en' ? 'Save Project' : 'حفظ المشروع'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <Layout size={20} className="text-blue-500" />
                            {language === 'en' ? 'Project Details' : 'تفاصيل المشروع'}
                        </h3>

                        <Input
                            label={language === 'en' ? 'Project Title' : 'عنوان المشروع'}
                            {...register('title')}
                            error={errors.title?.message}
                        />

                        <Textarea
                            label={language === 'en' ? 'Short Description' : 'وصف قصير'}
                            {...register('description')}
                            error={errors.description?.message}
                            rows={3}
                        />

                        <Textarea
                            label={language === 'en' ? 'Detailed Description' : 'وصف مفصل'}
                            {...register('longDescription')}
                            error={errors.longDescription?.message}
                            rows={6}
                        />
                    </section>

                    {/* Media */}
                    <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <ImageIcon size={20} className="text-emerald-500" />
                            {language === 'en' ? 'Media & Gallery' : 'الوسائط والمعرض'}
                        </h3>

                        <ImageUpload
                            label={language === 'en' ? 'Main Thumbnail' : 'الصورة الرئيسية'}
                            value={watch('image') || ''}
                            onChange={(value) => setValue('image', value)}
                            error={errors.image?.message}
                        />

                        <MultiImageUpload
                            label={language === 'en' ? 'Gallery Images' : 'معرض الصور'}
                            value={gallery}
                            onChange={(val) => setValue('gallery', val)}
                        />

                        <div className="border-t border-slate-100 dark:border-slate-800 my-4 pt-4">
                            <h4 className="text-md font-medium mb-3 flex items-center gap-2">
                                <FileText size={18} className="text-blue-500" />
                                {language === 'en' ? 'Project Documents' : 'ملفات المشروع'}
                            </h4>
                            <DocumentUpload
                                label={language === 'en' ? 'Upload PDF, Word, Excel' : 'رفع ملفات PDF, Word, Excel'}
                                value={watch('documents') || []}
                                onChange={(val) => setValue('documents', val)}
                            />
                        </div>
                    </section>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-8">
                    <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <Tags size={20} className="text-purple-500" />
                            {language === 'en' ? 'Organization' : 'التنظيم'}
                        </h3>

                        <Input
                            label={language === 'en' ? 'Category' : 'الفئة'}
                            {...register('category')}
                            error={errors.category?.message}
                            placeholder="e.g. Web Development"
                        />

                        <Textarea
                            label={language === 'en' ? 'Category Description' : 'وصف الفئة'}
                            {...register('categoryDescription')}
                            error={errors.categoryDescription?.message}
                            rows={3}
                            placeholder={language === 'en' ? 'Explain what this category means...' : 'اشرح ماذا تعني هذه الفئة...'}
                        />

                        <div className="space-y-3">
                            <label className="text-sm font-medium">{language === 'en' ? 'Technologies' : 'التقنيات'}</label>
                            <div className="flex gap-2">
                                <Input
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    placeholder="React, Node..."
                                />
                                <Button type="button" size="sm" onClick={addTag}>
                                    <Plus size={18} />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {techStack.map(tag => (
                                    <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-700">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="text-slate-400 hover:text-red-500">
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                                {techStack.length === 0 && <p className="text-xs text-slate-400">No tags added.</p>}
                            </div>
                            {errors.techStack && <p className="text-xs text-red-500">{errors.techStack.message}</p>}
                        </div>

                        <Input
                            type="number"
                            label={language === 'en' ? 'Display Order' : 'ترتيب العرض'}
                            {...register('displayOrder', { valueAsNumber: true })}
                        />

                        <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 transition-colors">
                            <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 text-blue-600 rounded" />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold flex items-center gap-1.5">
                                    <Star size={14} className="text-yellow-500" />
                                    {language === 'en' ? 'Featured Project' : 'مشروع مميز'}
                                </span>
                                <span className="text-xs text-slate-500">Show at the top of homepage</span>
                            </div>
                        </label>
                    </section>

                    <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <LinkIcon size={20} className="text-orange-500" />
                            {language === 'en' ? 'External Links' : 'روابط خارجية'}
                        </h3>

                        <Input
                            label="GitHub URL"
                            {...register('githubUrl')}
                            error={errors.githubUrl?.message}
                            placeholder="https://github.com/..."
                        />

                        <Input
                            label="Live Preview URL"
                            {...register('liveUrl')}
                            error={errors.liveUrl?.message}
                            placeholder="https://..."
                        />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProjectForm;
