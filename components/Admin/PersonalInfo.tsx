import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '../../services/LanguageContext';
import { fetchAbout, updateAbout } from '../../services/api';
import { showSuccess, showError } from '../../services/toast';
import { Input, Textarea } from '../UI/FormFields';
import Button from '../UI/Button';
import ImageUpload from '../UI/ImageUpload';
import { Save, Plus, Trash2, Globe, Phone, Mail, MapPin, Image as ImageIcon } from 'lucide-react';

const socialLinkSchema = z.object({
    platform: z.string().min(1, 'Platform is required'),
    url: z.string().url('Invalid URL').or(z.literal('')),
});

const personalInfoSchema = z.object({
    name_en: z.string().min(2, 'English name is required'),
    name_ar: z.string().min(2, 'Arabic name is required'),
    title_en: z.string().min(2, 'English title is required'),
    title_ar: z.string().min(2, 'Arabic title is required'),
    short_bio_en: z.string().min(10, 'Short English bio is required'),
    short_bio_ar: z.string().min(10, 'Short Arabic bio is required'),
    about_en: z.string().min(20, 'Long English bio is required'),
    about_ar: z.string().min(20, 'Long Arabic bio is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(5, 'Phone is required'),
    address_en: z.string().optional().or(z.literal('')),
    address_ar: z.string().optional().or(z.literal('')),
    freelance_status_en: z.string().optional().or(z.literal('')),
    freelance_status_ar: z.string().optional().or(z.literal('')),
    work_status_en: z.string().optional().or(z.literal('')),
    work_status_ar: z.string().optional().or(z.literal('')),
    imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    cvUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    social_links: z.array(socialLinkSchema).optional(),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

const PersonalInfo: React.FC = () => {
    const { language, isRTL } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<PersonalInfoFormValues>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            name_en: '',
            name_ar: '',
            title_en: '',
            title_ar: '',
            short_bio_en: '',
            short_bio_ar: '',
            about_en: '',
            about_ar: '',
            email: '',
            phone: '',
            address_en: '',
            address_ar: '',
            freelance_status_en: '',
            freelance_status_ar: '',
            work_status_en: '',
            work_status_ar: '',
            imageUrl: '',
            cvUrl: '',
            social_links: [
                { platform: 'LinkedIn', url: '' },
                { platform: 'GitHub', url: '' },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "social_links",
    });

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            try {
                const data = await fetchAbout();
                if (data && isMounted) {
                    let socialLinks: any[] = [];
                    if (typeof data.social_links === 'string') {
                        try {
                            socialLinks = JSON.parse(data.social_links);
                        } catch (e) {
                            // Silent failure for parsing
                        }
                    } else if (Array.isArray(data.social_links)) {
                        socialLinks = data.social_links;
                    }

                    const formValues: PersonalInfoFormValues = {
                        name_en: data.name_en || '',
                        name_ar: data.name_ar || '',
                        title_en: data.title_en || '',
                        title_ar: data.title_ar || '',
                        short_bio_en: data.short_bio_en || '',
                        short_bio_ar: data.short_bio_ar || '',
                        about_en: data.about_en || '',
                        about_ar: data.about_ar || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        address_en: data.address_en || '',
                        address_ar: data.address_ar || '',
                        freelance_status_en: data.freelance_status_en || '',
                        freelance_status_ar: data.freelance_status_ar || '',
                        work_status_en: data.work_status_en || '',
                        work_status_ar: data.work_status_ar || '',
                        imageUrl: data.imageUrl || '',
                        cvUrl: data.cvUrl || '',
                        social_links: Array.isArray(socialLinks) ? socialLinks : [],
                    };

                    reset(formValues);
                }
            } catch (error) {
                if (isMounted) {
                    showError(language === 'en' ? 'Failed to load data' : 'فشل تحميل البيانات');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        loadData();
        return () => {
            isMounted = false;
        };
    }, [reset, language]);

    const onSubmit = async (values: PersonalInfoFormValues) => {
        setSaving(true);
        try {
            const dataToSave = {
                ...values,
                social_links: JSON.stringify(values.social_links),
            };
            await updateAbout(dataToSave);
            showSuccess(language === 'en' ? 'Profile updated successfully!' : 'تم تحديث الملف الشخصي بنجاح!');
        } catch (error) {
            console.error('Failed to update profile', error);
            showError(language === 'en' ? 'Failed to update profile' : 'فشل تحديث الملف الشخصي');
        } finally {
            setSaving(false);
        }
    };

    const onError = (errors: any) => {
        showError(language === 'en' ? 'Please fix the errors in the form' : 'يرجى إصلاح الأخطاء في النموذج');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                    {language === 'en' ? 'Personal Information' : 'المعلومات الشخصية'}
                </h2>
                <Button
                    onClick={handleSubmit(onSubmit, onError)}
                    disabled={saving}
                    className="flex items-center gap-2"
                >
                    {saving ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                        <Save size={18} />
                    )}
                    {language === 'en' ? 'Save Changes' : 'حفظ التغييرات'}
                </Button>
            </div>

            <form className="space-y-8 pb-12">
                {/* Profile Image */}
                <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <ImageIcon size={20} className="text-purple-500" />
                        {language === 'en' ? 'Profile Image' : 'صورة الملف الشخصي'}
                    </h3>

                    <div className="max-w-xl">
                        <ImageUpload
                            label={language === 'en' ? 'Upload Image' : 'رفع صورة'}
                            value={watch('imageUrl') || ''}
                            onChange={(value) => setValue('imageUrl', value)}
                            error={errors.imageUrl?.message}
                        />
                    </div>
                </section>

                {/* Basic Information */}
                <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <Globe size={20} className="text-blue-500" />
                        {language === 'en' ? 'Basic Identity' : 'الهوية الأساسية'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label={language === 'en' ? 'Full Name (English)' : 'الاسم الكامل (إنجليزي)'}
                            {...register('name_en')}
                            error={errors.name_en?.message}
                            placeholder="John Doe"
                        />
                        <Input
                            label={language === 'en' ? 'Full Name (Arabic)' : 'الاسم الكامل (عربي)'}
                            {...register('name_ar')}
                            error={errors.name_ar?.message}
                            placeholder="جون دو"
                            dir="rtl"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label={language === 'en' ? 'Job Title (English)' : 'المسمى الوظيفي (إنجليزي)'}
                            {...register('title_en')}
                            error={errors.title_en?.message}
                            placeholder="Full Stack Developer"
                        />
                        <Input
                            label={language === 'en' ? 'Job Title (Arabic)' : 'المسمى الوظيفي (عربي)'}
                            {...register('title_ar')}
                            error={errors.title_ar?.message}
                            placeholder="مطور تطبيقات متكامل"
                            dir="rtl"
                        />
                    </div>
                </section>

                {/* Bio & About */}
                <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
                    <h3 className="text-lg font-semibold border-b border-slate-100 dark:border-slate-800 pb-3">
                        {language === 'en' ? 'Biography & About' : 'نبذة عني'}
                    </h3>

                    <div className="space-y-6">
                        <Textarea
                            label={language === 'en' ? 'Short Bio (English)' : 'نبذة قصيرة (إنجليزي)'}
                            {...register('short_bio_en')}
                            error={errors.short_bio_en?.message}
                            rows={2}
                        />
                        <Textarea
                            label={language === 'en' ? 'Short Bio (Arabic)' : 'نبذة قصيرة (عربي)'}
                            {...register('short_bio_ar')}
                            error={errors.short_bio_ar?.message}
                            rows={2}
                            dir="rtl"
                        />
                        <Textarea
                            label={language === 'en' ? 'Detailed About (English)' : 'وصف مفصل (إنجليزي)'}
                            {...register('about_en')}
                            error={errors.about_en?.message}
                            rows={5}
                        />
                        <Textarea
                            label={language === 'en' ? 'Detailed About (Arabic)' : 'وصف مفصل (عربي)'}
                            {...register('about_ar')}
                            error={errors.about_ar?.message}
                            rows={5}
                            dir="rtl"
                        />
                    </div>
                </section>

                {/* Contact Information */}
                <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <Phone size={20} className="text-emerald-500" />
                        {language === 'en' ? 'Contact Information' : 'معلومات الاتصال'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label={language === 'en' ? 'Primary Email' : 'البريد الإلكتروني الأساسي'}
                            {...register('email')}
                            error={errors.email?.message}
                            type="email"
                        />
                        <Input
                            label={language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                            {...register('phone')}
                            error={errors.phone?.message}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label={language === 'en' ? 'Address (English)' : 'العنوان (إنجليزي)'}
                            {...register('address_en')}
                            error={errors.address_en?.message}
                        />
                        <Input
                            label={language === 'en' ? 'Address (Arabic)' : 'العنوان (عربي)'}
                            {...register('address_ar')}
                            error={errors.address_ar?.message}
                            dir="rtl"
                        />
                    </div>
                </section>

                {/* Status Information */}
                <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <MapPin size={20} className="text-orange-500" />
                        {language === 'en' ? 'Work Status' : 'حالة العمل'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label={language === 'en' ? 'Work Type (English)' : 'نوع العمل (إنجليزي)'}
                            {...register('work_status_en')}
                            error={errors.work_status_en?.message}
                            placeholder="Remote / Hybrid"
                        />
                        <Input
                            label={language === 'en' ? 'Work Type (Arabic)' : 'نوع العمل (عربي)'}
                            {...register('work_status_ar')}
                            error={errors.work_status_ar?.message}
                            placeholder="عن بعد / هجين"
                            dir="rtl"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label={language === 'en' ? 'Freelance Status (English)' : 'حالة العمل الحر (إنجليزي)'}
                            {...register('freelance_status_en')}
                            error={errors.freelance_status_en?.message}
                            placeholder="Freelance Available"
                        />
                        <Input
                            label={language === 'en' ? 'Freelance Status (Arabic)' : 'حالة العمل الحر (عربي)'}
                            {...register('freelance_status_ar')}
                            error={errors.freelance_status_ar?.message}
                            placeholder="متاح للعمل الحر"
                            dir="rtl"
                        />
                    </div>
                </section>

                {/* Social Links */}
                <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                        <h3 className="text-lg font-semibold">
                            {language === 'en' ? 'Social Links' : 'روابط التواصل الاجتماعي'}
                        </h3>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => append({ platform: '', url: '' })}
                            className="flex items-center gap-1"
                        >
                            <Plus size={16} />
                            {language === 'en' ? 'Add Link' : 'إضافة رابط'}
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-4 items-end animate-in fade-in zoom-in-95">
                                <Input
                                    label={index === 0 ? (language === 'en' ? 'Platform' : 'المنصة') : undefined}
                                    {...register(`social_links.${index}.platform` as const)}
                                    placeholder="e.g. LinkedIn"
                                    className="flex-1"
                                />
                                <Input
                                    label={index === 0 ? (language === 'en' ? 'URL' : 'الرابط') : undefined}
                                    {...register(`social_links.${index}.url` as const)}
                                    placeholder="https://..."
                                    className="flex-[2]"
                                />
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="mb-2 p-2.5 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </form>
        </div>
    );
};

export default PersonalInfo;
