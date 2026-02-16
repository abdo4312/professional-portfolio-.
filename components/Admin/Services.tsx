import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { fetchServices, createService, updateService, deleteService, Service } from '../../services/api';
import { useLanguage } from '../../services/LanguageContext';
import { showSuccess, showError } from '../../services/toast';
import { Input, Textarea } from '../UI/FormFields';
import Button from '../UI/Button';
import { Plus, Trash2, Edit2, Save, X, Layers, Code, Layout, Smartphone, Database, Search, Zap, Palette, Globe } from 'lucide-react';
import { cn } from '../../services/utils';

const serviceSchema = z.object({
    title_en: z.string().min(1, 'Title (EN) is required'),
    title_ar: z.string().min(1, 'Title (AR) is required'),
    description_en: z.string().min(1, 'Description (EN) is required'),
    description_ar: z.string().min(1, 'Description (AR) is required'),
    icon: z.string().optional(),
    displayOrder: z.number().default(0),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const iconOptions = [
    { name: 'Code', icon: Code },
    { name: 'Layout', icon: Layout },
    { name: 'Smartphone', icon: Smartphone },
    { name: 'Database', icon: Database },
    { name: 'Layers', icon: Layers },
    { name: 'Search', icon: Search },
    { name: 'Zap', icon: Zap },
    { name: 'Palette', icon: Palette },
    { name: 'Globe', icon: Globe },
];

const Services: React.FC = () => {
    const { language } = useLanguage();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState('Code');

    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<ServiceFormValues>({
        resolver: zodResolver(z.object({
            ...serviceSchema.shape,
            displayOrder: z.number() // Overriding to fix the default() required type mismatch
        })),
        defaultValues: { displayOrder: 0 }
    });

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            setLoading(true);
            const data = await fetchServices();
            setServices(data);
        } catch (error) {
            console.error('Error loading services', error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values: ServiceFormValues) => {
        try {
            const payload = { ...values, icon: selectedIcon };
            if (editingId) {
                await updateService(editingId, payload);
                showSuccess(language === 'en' ? 'Service updated successfully' : 'تم تحديث الخدمة بنجاح');
            } else {
                await createService(payload);
                showSuccess(language === 'en' ? 'Service created successfully' : 'تم إنشاء الخدمة بنجاح');
            }
            resetForm();
            loadServices();
        } catch (error) {
            console.error('Error saving service', error);
            showError(language === 'en' ? 'Failed to save service' : 'فشل حفظ الخدمة');
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setIsAdding(false);
        reset();
        setSelectedIcon('Code');
    };

    const handleEdit = (service: Service) => {
        setEditingId(service.id);
        setIsAdding(false);
        reset(service);
        setSelectedIcon(service.icon || 'Code');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (confirm(language === 'en' ? 'Delete this service?' : 'حذف هذه الخدمة؟')) {
            try {
                await deleteService(id);
                loadServices();
                showSuccess(language === 'en' ? 'Service deleted successfully' : 'تم حذف الخدمة بنجاح');
            } catch (error) {
                console.error('Error deleting service', error);
                showError(language === 'en' ? 'Failed to delete service' : 'فشل حذف الخدمة');
            }
        }
    };

    const getIcon = (iconName: string) => {
        const found = iconOptions.find(opt => opt.name === iconName);
        return found ? found.icon : Code;
    };

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold mb-1">
                        {language === 'en' ? 'Services & Offerings' : 'الخدمات والعروض'}
                    </h2>
                    <p className="text-sm text-slate-500">
                        {language === 'en' ? 'Define the core services you provide to clients' : 'حدد الخدمات الأساسية التي تقدمها للعملاء'}
                    </p>
                </div>
                {!isAdding && !editingId && (
                    <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
                        <Plus size={18} />
                        {language === 'en' ? 'Add Service' : 'إضافة خدمة'}
                    </Button>
                )}
            </div>

            {(isAdding || editingId) && (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-blue-100 dark:border-blue-900/30 shadow-xl shadow-blue-500/5 mb-10 overflow-hidden animate-in slide-in-from-top-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Service Title (EN)" {...register('title_en')} error={errors.title_en?.message} />
                            <Input label="عنوان الخدمة (AR)" {...register('title_ar')} dir="rtl" error={errors.title_ar?.message} />
                            <Textarea label="Description (EN)" {...register('description_en')} rows={3} error={errors.description_en?.message} />
                            <Textarea label="الوصف (AR)" {...register('description_ar')} dir="rtl" rows={3} error={errors.description_ar?.message} />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {language === 'en' ? 'Select Icon' : 'اختر أيقونة'}
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {iconOptions.map((opt) => {
                                    const IconComp = opt.icon;
                                    return (
                                        <button
                                            key={opt.name}
                                            type="button"
                                            onClick={() => setSelectedIcon(opt.name)}
                                            className={cn(
                                                "w-12 h-12 flex items-center justify-center rounded-xl border-2 transition-all",
                                                selectedIcon === opt.name
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                                                    : "border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700"
                                            )}
                                        >
                                            <IconComp size={24} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-800">
                            <Input label="Order" type="number" {...register('displayOrder', { valueAsNumber: true })} className="w-32" />
                            <div className="flex gap-3">
                                <Button type="button" variant="secondary" onClick={resetForm}>{language === 'en' ? 'Cancel' : 'إلغاء'}</Button>
                                <Button type="submit" className="flex items-center gap-2">
                                    <Save size={18} />
                                    {language === 'en' ? 'Save Service' : 'حفظ الخدمة'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(3).fill(0).map((_, i) => <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-3xl" />)
                ) : services.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
                        {language === 'en' ? 'No services added yet.' : 'لم يتم إضافة أي خدمات بعد.'}
                    </div>
                ) : services.map((service) => {
                    const IconComp = getIcon(service.icon || 'Code');
                    return (
                        <div key={service.id} className="group bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                    <IconComp size={28} />
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(service)} className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(service.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                </div>
                            </div>
                            <h4 className="text-xl font-bold mb-3">
                                {language === 'en' ? service.title_en : service.title_ar}
                            </h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                                {language === 'en' ? service.description_en : service.description_ar}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Services;
