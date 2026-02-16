import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '../../services/LanguageContext';
import { fetchSkills, createSkill, updateSkill, deleteSkill, Skill } from '../../services/api';
import { showSuccess, showError } from '../../services/toast';
import { Input } from '../UI/FormFields';
import Button from '../UI/Button';
import { Plus, Trash2, Edit2, Hexagon, Code, Server, Wrench, Layout, Save, X } from 'lucide-react';
import { cn } from '../../services/utils';

const skillSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    category: z.string().min(1, 'Category is required'),
    proficiency: z.number().min(0).max(100),
    icon: z.string().optional(),
    displayOrder: z.number(),
});

type SkillFormValues = z.infer<typeof skillSchema>;

const Skills: React.FC = () => {
    const { language } = useLanguage();
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<SkillFormValues>({
        resolver: zodResolver(skillSchema),
        defaultValues: {
            proficiency: 80,
            displayOrder: 0,
            category: 'Frontend',
        },
    });

    const proficiency = watch('proficiency');

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            setLoading(true);
            const data = await fetchSkills();
            setSkills(data);
        } catch (error) {
            console.error('Error loading skills', error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values: SkillFormValues) => {
        try {
            if (editingId) {
                await updateSkill(editingId, values);
                showSuccess(language === 'en' ? 'Skill updated successfully' : 'تم تحديث المهارة بنجاح');
            } else {
                await createSkill(values);
                showSuccess(language === 'en' ? 'Skill created successfully' : 'تم إنشاء المهارة بنجاح');
            }
            reset();
            setEditingId(null);
            setIsAdding(false);
            loadSkills();
        } catch (error) {
            console.error('Error saving skill', error);
            showError(language === 'en' ? 'Failed to save skill' : 'فشل حفظ المهارة');
        }
    };

    const handleEdit = (skill: Skill) => {
        setEditingId(skill.id);
        setIsAdding(false);
        reset(skill);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (confirm(language === 'en' ? 'Delete this skill?' : 'حذف هذه المهارة؟')) {
            try {
                await deleteSkill(id);
                loadSkills();
                showSuccess(language === 'en' ? 'Skill deleted successfully' : 'تم حذف المهارة بنجاح');
            } catch (error) {
                console.error('Error deleting skill', error);
                showError(language === 'en' ? 'Failed to delete skill' : 'فشل حذف المهارة');
            }
        }
    };

    const categories = ['Frontend', 'Backend', 'Tools', 'Mobile', 'Design', 'Other'];

    const getCategoryIcon = (cat: string) => {
        switch (cat.toLowerCase()) {
            case 'frontend': return <Layout size={18} className="text-blue-500" />;
            case 'backend': return <Server size={18} className="text-emerald-500" />;
            case 'tools': return <Wrench size={18} className="text-orange-500" />;
            default: return <Code size={18} className="text-purple-500" />;
        }
    };

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">
                    {language === 'en' ? 'Skills & Proficiency' : 'المهارات والخبرات'}
                </h2>
                {!isAdding && !editingId && (
                    <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
                        <Plus size={18} />
                        {language === 'en' ? 'Add Skill' : 'إضافة مهارة'}
                    </Button>
                )}
            </div>

            {/* Form Section */}
            {(isAdding || editingId) && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30 shadow-xl shadow-blue-500/5 mb-10 animate-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Hexagon size={20} className="text-blue-600" />
                            {editingId
                                ? (language === 'en' ? 'Edit Skill' : 'تعديل المهارة')
                                : (language === 'en' ? 'New Skill' : 'مهارة جديدة')}
                        </h3>
                        <button
                            onClick={() => { setEditingId(null); setIsAdding(false); reset(); }}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label={language === 'en' ? 'Skill Name' : 'اسم المهارة'}
                                {...register('name')}
                                error={errors.name?.message}
                                placeholder="e.g. React.js"
                            />

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">{language === 'en' ? 'Category' : 'الفئة'}</label>
                                <select
                                    {...register('category')}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                >
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium">{language === 'en' ? 'Proficiency Level' : 'مستوى الإتقان'}</label>
                                <span className="text-sm font-bold text-blue-600">{proficiency}%</span>
                            </div>
                            <input
                                type="range"
                                {...register('proficiency', { valueAsNumber: true })}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label={language === 'en' ? 'Icon Class/Name' : 'أيقونة'}
                                {...register('icon')}
                                placeholder="e.g. SimpleIcons:React"
                            />
                            <Input
                                label={language === 'en' ? 'Display Order' : 'ترتيب العرض'}
                                type="number"
                                {...register('displayOrder', { valueAsNumber: true })}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setIsAdding(false); reset(); }}>
                                {language === 'en' ? 'Cancel' : 'إلغاء'}
                            </Button>
                            <Button type="submit" className="flex items-center gap-2">
                                <Save size={18} />
                                {editingId ? (language === 'en' ? 'Update Skill' : 'تحديث المهارة') : (language === 'en' ? 'Save Skill' : 'حفظ المهارة')}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Grid Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
                    ))
                ) : (
                    skills.map((skill) => (
                        <div
                            key={skill.id}
                            className="group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600">
                                        {getCategoryIcon(skill.category)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{skill.name}</h4>
                                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{skill.category}</span>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(skill)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(skill.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500">Proficiency</span>
                                    <span className="font-bold">{skill.proficiency}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${skill.proficiency}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {!loading && skills.length === 0 && !isAdding && (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-500">
                    {language === 'en' ? 'No skills added yet.' : 'لم يتم إضافة مهارات بعد.'}
                </div>
            )}
        </div>
    );
};

export default Skills;
