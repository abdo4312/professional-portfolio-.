import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    fetchExperience, createExperience, updateExperience, deleteExperience,
    fetchEducation, createEducation, updateEducation, deleteEducation,
    Experience, Education
} from '../../services/api';
import { useLanguage } from '../../services/LanguageContext';
import { showSuccess, showError } from '../../services/toast';
import { Input, Textarea } from '../UI/FormFields';
import Button from '../UI/Button';
import { Plus, Trash2, Edit2, Briefcase, GraduationCap, Calendar, MapPin, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../services/utils';

const experienceSchema = z.object({
    title_en: z.string().min(1, 'Title (EN) is required'),
    title_ar: z.string().min(1, 'Title (AR) is required'),
    company_en: z.string().min(1, 'Company (EN) is required'),
    company_ar: z.string().min(1, 'Company (AR) is required'),
    location_en: z.string().optional(),
    location_ar: z.string().optional(),
    period_en: z.string().min(1, 'Period (EN) is required'),
    period_ar: z.string().min(1, 'Period (AR) is required'),
    description_en: z.string().optional(),
    description_ar: z.string().optional(),
    displayOrder: z.number(),
});

const educationSchema = z.object({
    degree_en: z.string().min(1, 'Degree (EN) is required'),
    degree_ar: z.string().min(1, 'Degree (AR) is required'),
    institution_en: z.string().min(1, 'Institution (EN) is required'),
    institution_ar: z.string().min(1, 'Institution (AR) is required'),
    period_en: z.string().min(1, 'Period (EN) is required'),
    period_ar: z.string().min(1, 'Period (AR) is required'),
    description_en: z.string().optional(),
    description_ar: z.string().optional(),
    displayOrder: z.number(),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;
type EducationFormValues = z.infer<typeof educationSchema>;

const CareerHistory: React.FC = () => {
    const { language } = useLanguage();
    const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [educations, setEducations] = useState<Education[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const expForm = useForm<ExperienceFormValues>({
        resolver: zodResolver(experienceSchema),
        defaultValues: { displayOrder: 0 }
    });

    const eduForm = useForm<EducationFormValues>({
        resolver: zodResolver(educationSchema),
        defaultValues: { displayOrder: 0 }
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [expData, eduData] = await Promise.all([fetchExperience(), fetchEducation()]);
            setExperiences(expData);
            setEducations(eduData);
        } catch (error) {
            console.error('Error loading history', error);
        } finally {
            setLoading(false);
        }
    };

    const onExpSubmit = async (values: ExperienceFormValues) => {
        try {
            if (editingId) {
                await updateExperience(editingId, values);
                showSuccess(language === 'en' ? 'Experience updated successfully' : 'تم تحديث الخبرة بنجاح');
            } else {
                await createExperience(values);
                showSuccess(language === 'en' ? 'Experience created successfully' : 'تم إنشاء الخبرة بنجاح');
            }
            resetForm();
            loadData();
        } catch (error) {
            console.error('Error saving experience', error);
            showError(language === 'en' ? 'Failed to save experience' : 'فشل حفظ الخبرة');
        }
    };

    const onEduSubmit = async (values: EducationFormValues) => {
        try {
            if (editingId) {
                await updateEducation(editingId, values);
                showSuccess(language === 'en' ? 'Education updated successfully' : 'تم تحديث التعليم بنجاح');
            } else {
                await createEducation(values);
                showSuccess(language === 'en' ? 'Education created successfully' : 'تم إنشاء التعليم بنجاح');
            }
            resetForm();
            loadData();
        } catch (error) {
            console.error('Error saving education', error);
            showError(language === 'en' ? 'Failed to save education' : 'فشل حفظ التعليم');
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setIsAdding(false);
        expForm.reset();
        eduForm.reset();
    };

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setIsAdding(false);
        if (activeTab === 'experience') expForm.reset(item);
        else eduForm.reset(item);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (confirm(language === 'en' ? 'Delete this entry?' : 'حذف هذا القيد؟')) {
            try {
                if (activeTab === 'experience') await deleteExperience(id);
                else await deleteEducation(id);
                loadData();
                showSuccess(language === 'en' ? 'Deleted successfully' : 'تم الحذف بنجاح');
            } catch (error) {
                console.error('Error deleting entry', error);
                showError(language === 'en' ? 'Failed to delete' : 'فشل الحذف');
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold mb-1">
                        {language === 'en' ? 'Career & Education' : 'السيرة المهنية والتعليمية'}
                    </h2>
                    <p className="text-sm text-slate-500">
                        {language === 'en' ? 'Manage your professional timeline and academic background' : 'إدارة الجدول الزمني المهني والخلفية الأكاديمية'}
                    </p>
                </div>
                {!isAdding && !editingId && (
                    <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
                        <Plus size={18} />
                        {language === 'en' ? `Add ${activeTab === 'experience' ? 'Experience' : 'Education'}` : `إضافة ${activeTab === 'experience' ? 'خبرة' : 'تعليم'}`}
                    </Button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-8 w-fit">
                <button
                    onClick={() => { setActiveTab('experience'); resetForm(); }}
                    className={cn(
                        "px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                        activeTab === 'experience' ? "bg-white dark:bg-slate-900 shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <Briefcase size={16} />
                    {language === 'en' ? 'Experience' : 'الخبرة'}
                </button>
                <button
                    onClick={() => { setActiveTab('education'); resetForm(); }}
                    className={cn(
                        "px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                        activeTab === 'education' ? "bg-white dark:bg-slate-900 shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <GraduationCap size={16} />
                    {language === 'en' ? 'Education' : 'التعليم'}
                </button>
            </div>

            {/* Form Section */}
            {(isAdding || editingId) && (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-blue-100 dark:border-blue-900/30 shadow-xl shadow-blue-500/5 mb-10 overflow-hidden relative animate-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            {activeTab === 'experience' ? <Briefcase className="text-blue-500" /> : <GraduationCap className="text-blue-500" />}
                            {editingId ? (language === 'en' ? 'Edit Entry' : 'تعديل القيد') : (language === 'en' ? 'New Entry' : 'قيد جديد')}
                        </h3>
                        <button onClick={resetForm} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={20} /></button>
                    </div>

                    {activeTab === 'experience' ? (
                        <form onSubmit={expForm.handleSubmit(onExpSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="Job Title (EN)" {...expForm.register('title_en')} error={expForm.formState.errors.title_en?.message} />
                                <Input label="المسمى الوظيفي (AR)" {...expForm.register('title_ar')} dir="rtl" error={expForm.formState.errors.title_ar?.message} />
                                <Input label="Company (EN)" {...expForm.register('company_en')} error={expForm.formState.errors.company_en?.message} />
                                <Input label="الشركة (AR)" {...expForm.register('company_ar')} dir="rtl" error={expForm.formState.errors.company_ar?.message} />
                                <Input label="Period (e.g. 2020 - Present)" {...expForm.register('period_en')} />
                                <Input label="الفترة (مثال 2020 - الآن)" {...expForm.register('period_ar')} dir="rtl" />
                                <Input label="Location (EN)" {...expForm.register('location_en')} />
                                <Input label="الموقع (AR)" {...expForm.register('location_ar')} dir="rtl" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Textarea label="Description (EN)" {...expForm.register('description_en')} rows={3} />
                                <Textarea label="الوصف (AR)" {...expForm.register('description_ar')} dir="rtl" rows={3} />
                            </div>
                            <div className="flex justify-between items-center">
                                <Input label="Order" type="number" {...expForm.register('displayOrder', { valueAsNumber: true })} className="w-32" />
                                <div className="flex gap-3">
                                    <Button type="button" variant="secondary" onClick={resetForm}>{language === 'en' ? 'Cancel' : 'إلغاء'}</Button>
                                    <Button type="submit" className="flex items-center gap-2"><Save size={18} /> {language === 'en' ? 'Save Changes' : 'حفظ التغييرات'}</Button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={eduForm.handleSubmit(onEduSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="Degree (EN)" {...eduForm.register('degree_en')} error={eduForm.formState.errors.degree_en?.message} />
                                <Input label="الدرجة العلمية (AR)" {...eduForm.register('degree_ar')} dir="rtl" error={eduForm.formState.errors.degree_ar?.message} />
                                <Input label="Institution (EN)" {...eduForm.register('institution_en')} error={eduForm.formState.errors.institution_en?.message} />
                                <Input label="المؤسسة (AR)" {...eduForm.register('institution_ar')} dir="rtl" error={eduForm.formState.errors.institution_ar?.message} />
                                <Input label="Period (EN)" {...eduForm.register('period_en')} />
                                <Input label="الفترة (AR)" {...eduForm.register('period_ar')} dir="rtl" />
                                <Input label="Order" type="number" {...eduForm.register('displayOrder', { valueAsNumber: true })} className="w-32" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Textarea label="Description (EN)" {...eduForm.register('description_en')} rows={3} />
                                <Textarea label="الوصف (AR)" {...eduForm.register('description_ar')} dir="rtl" rows={3} />
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button type="button" variant="secondary" onClick={resetForm}>{language === 'en' ? 'Cancel' : 'إلغاء'}</Button>
                                <Button type="submit" className="flex items-center gap-2"><Save size={18} /> {language === 'en' ? 'Save Changes' : 'حفظ التغييرات'}</Button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* List Display */}
            <div className="space-y-6">
                {loading ? (
                    Array(3).fill(0).map((_, i) => <div key={i} className="h-40 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-3xl" />)
                ) : (
                    (activeTab === 'experience' ? experiences : educations).length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-500">
                            {language === 'en' ? 'No entries found.' : 'لم يتم العثور على أي قيود.'}
                        </div>
                    ) : (activeTab === 'experience' ? experiences : educations).map((item: any) => (
                        <div key={item.id} className="group bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div className="flex gap-5">
                                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                                        {activeTab === 'experience' ? <Briefcase size={28} /> : <GraduationCap size={28} />}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">
                                            {language === 'en' ? (activeTab === 'experience' ? item.title_en : item.degree_en) : (activeTab === 'experience' ? item.title_ar : item.degree_ar)}
                                        </h4>
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 mb-4">
                                            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                                                <MapPin size={16} className="text-slate-400" />
                                                {language === 'en' ? (activeTab === 'experience' ? item.company_en : item.institution_en) : (activeTab === 'experience' ? item.company_ar : item.institution_ar)}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={16} className="text-slate-400" />
                                                {language === 'en' ? item.period_en : item.period_ar}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm whitespace-pre-wrap max-w-3xl">
                                            {language === 'en' ? item.description_en : item.description_ar}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity self-end md:self-start">
                                    <button onClick={() => handleEdit(item)} className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-400 hover:text-blue-600 rounded-xl transition-all">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-600 rounded-xl transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CareerHistory;
