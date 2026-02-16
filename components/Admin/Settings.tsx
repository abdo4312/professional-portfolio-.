import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { changePassword, fetchSettings, updateSettings, exportAllData } from '../../services/api';
import { useLanguage } from '../../services/LanguageContext';
import { showSuccess, showError, showInfo } from '../../services/toast';
import { Input, Textarea } from '../UI/FormFields';
import Button from '../UI/Button';
import { Lock, Shield, Database, Download, RefreshCw, CheckCircle2, AlertCircle, Globe, Search } from 'lucide-react';
import { cn } from '../../services/utils';

const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const settingsSchema = z.object({
    site_title_en: z.string().min(1, 'English title is required'),
    site_title_ar: z.string().min(1, 'Arabic title is required'),
    site_description_en: z.string().min(10, 'English description is required'),
    site_description_ar: z.string().min(10, 'Arabic description is required'),
    keywords_en: z.string().optional(),
    keywords_ar: z.string().optional(),
    google_analytics_id: z.string().optional(),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;
type SettingsFormValues = z.infer<typeof settingsSchema>;

const Settings: React.FC = () => {
    const { language } = useLanguage();
    const [activeTab, setActiveTab] = useState<'security' | 'site' | 'data'>('security');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [settingsLoading, setSettingsLoading] = useState(true);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
    });

    const { register: registerSettings, handleSubmit: handleSettingsSubmit, reset: resetSettings, formState: { errors: settingsErrors }, setValue } = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setSettingsLoading(true);
            const data = await fetchSettings();
            if (data) {
                resetSettings({
                    site_title_en: data.site_title_en || '',
                    site_title_ar: data.site_title_ar || '',
                    site_description_en: data.site_description_en || '',
                    site_description_ar: data.site_description_ar || '',
                    keywords_en: data.keywords_en || '',
                    keywords_ar: data.keywords_ar || '',
                    google_analytics_id: data.google_analytics_id || '',
                });
            }
        } catch (error) {
            console.error('Error loading settings', error);
        } finally {
            setSettingsLoading(false);
        }
    };

    const onSettingsSubmit = async (values: SettingsFormValues) => {
        try {
            setLoading(true);
            await updateSettings(values);
            showSuccess(language === 'en' ? 'Site settings updated successfully' : 'تم تحديث إعدادات الموقع بنجاح');
        } catch (error) {
            showError(language === 'en' ? 'Failed to update settings' : 'فشل تحديث الإعدادات');
        } finally {
            setLoading(false);
        }
    };

    const onPasswordSubmit = async (values: PasswordFormValues) => {
        try {
            setLoading(true);
            setMessage(null);
            await changePassword(values.newPassword);
            setMessage({
                type: 'success',
                text: language === 'en' ? 'Password updated successfully' : 'تم تحديث كلمة المرور بنجاح'
            });
            showSuccess(language === 'en' ? 'Password updated successfully' : 'تم تحديث كلمة المرور بنجاح');
            reset();
        } catch (error) {
            setMessage({
                type: 'error',
                text: language === 'en' ? 'Failed to update password' : 'فشل تحديث كلمة المرور'
            });
            showError(language === 'en' ? 'Failed to update password' : 'فشل تحديث كلمة المرور');
        } finally {
            setLoading(false);
        }
    };

    const handleExportData = async () => {
        try {
            setLoading(true);
            const data = await exportAllData();

            // Create and download JSON file
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            showSuccess(language === 'en' ? 'Data exported successfully!' : 'تم تصدير البيانات بنجاح!');
        } catch (error) {
            console.error('Error exporting data:', error);
            showError(language === 'en' ? 'Failed to export data' : 'فشل تصدير البيانات');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-1">
                    {language === 'en' ? 'Settings & Security' : 'الإعدادات والأمان'}
                </h2>
                <p className="text-sm text-slate-500">
                    {language === 'en' ? 'Manage your account security and site preferences' : 'إدارة أمان حسابك وتفضيلات الموقع'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <button
                            onClick={() => setActiveTab('security')}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                activeTab === 'security'
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                        >
                            <Shield size={18} />
                            {language === 'en' ? 'Security' : 'الأمان'}
                        </button>
                        <button
                            onClick={() => setActiveTab('site')}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                activeTab === 'site'
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                        >
                            <Globe size={18} />
                            {language === 'en' ? 'Site Settings' : 'إعدادات الموقع'}
                        </button>
                        <button
                            onClick={() => setActiveTab('data')}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                activeTab === 'data'
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                        >
                            <Database size={18} />
                            {language === 'en' ? 'Data Management' : 'إدارة البيانات'}
                        </button>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-8">
                    {activeTab === 'security' && (
                        <>
                            {/* Change Password */}
                            <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <Lock size={20} className="text-blue-500" />
                                    {language === 'en' ? 'Change Password' : 'تغيير كلمة المرور'}
                                </h3>

                                {message && (
                                    <div className={cn(
                                        "p-4 rounded-xl mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2",
                                        message.type === 'success' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-red-50 dark:bg-red-900/20 text-red-600"
                                    )}>
                                        {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                        <span className="text-sm font-medium">{message.text}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-6">
                                    <Input
                                        label={language === 'en' ? 'Current Password' : 'كلمة المرور الحالية'}
                                        type="password"
                                        {...register('currentPassword')}
                                        error={errors.currentPassword?.message}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            label={language === 'en' ? 'New Password' : 'كلمة المرور الجديدة'}
                                            type="password"
                                            {...register('newPassword')}
                                            error={errors.newPassword?.message}
                                        />
                                        <Input
                                            label={language === 'en' ? 'Confirm New Password' : 'تأكيد كلمة المرور الجديدة'}
                                            type="password"
                                            {...register('confirmPassword')}
                                            error={errors.confirmPassword?.message}
                                        />
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <Button type="submit" className="px-8">
                                            {language === 'en' ? 'Update Password' : 'تحديث كلمة المرور'}
                                        </Button>
                                    </div>
                                </form>
                            </section>
                        </>
                    )}

                    {activeTab === 'site' && (
                        <>
                            {/* Site Settings */}
                            <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <Globe size={20} className="text-blue-500" />
                                    {language === 'en' ? 'Site Settings' : 'إعدادات الموقع'}
                                </h3>

                                <form onSubmit={handleSettingsSubmit(onSettingsSubmit)} className="space-y-6">
                                    {/* Site Title */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            label={language === 'en' ? 'Site Title (English)' : 'عنوان الموقع (إنجليزي)'}
                                            {...registerSettings('site_title_en')}
                                            error={settingsErrors.site_title_en?.message}
                                            placeholder="My Portfolio"
                                        />
                                        <Input
                                            label={language === 'en' ? 'Site Title (Arabic)' : 'عنوان الموقع (عربي)'}
                                            {...registerSettings('site_title_ar')}
                                            error={settingsErrors.site_title_ar?.message}
                                            placeholder="معرض أعمالي"
                                            dir="rtl"
                                        />
                                    </div>

                                    {/* Site Description */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Textarea
                                            label={language === 'en' ? 'Site Description (English)' : 'وصف الموقع (إنجليزي)'}
                                            {...registerSettings('site_description_en')}
                                            error={settingsErrors.site_description_en?.message}
                                            rows={3}
                                            placeholder="A brief description of your portfolio..."
                                        />
                                        <Textarea
                                            label={language === 'en' ? 'Site Description (Arabic)' : 'وصف الموقع (عربي)'}
                                            {...registerSettings('site_description_ar')}
                                            error={settingsErrors.site_description_ar?.message}
                                            rows={3}
                                            dir="rtl"
                                            placeholder="وصف مختصر لمعرض أعمالك..."
                                        />
                                    </div>

                                    {/* Keywords */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            label={language === 'en' ? 'Keywords (English)' : 'الكلمات المفتاحية (إنجليزي)'}
                                            {...registerSettings('keywords_en')}
                                            placeholder="portfolio, developer, web design"
                                        />
                                        <Input
                                            label={language === 'en' ? 'Keywords (Arabic)' : 'الكلمات المفتاحية (عربي)'}
                                            {...registerSettings('keywords_ar')}
                                            placeholder="معرض، مطور، تصميم مواقع"
                                            dir="rtl"
                                        />
                                    </div>

                                    {/* Google Analytics */}
                                    <Input
                                        label={language === 'en' ? 'Google Analytics ID' : 'معرف Google Analytics'}
                                        {...registerSettings('google_analytics_id')}
                                        placeholder="G-XXXXXXXXXX"
                                    />

                                    <div className="flex justify-end pt-2">
                                        <Button type="submit" disabled={loading} className="px-8">
                                            {loading ? (language === 'en' ? 'Saving...' : 'جاري الحفظ...') : (language === 'en' ? 'Save Settings' : 'حفظ الإعدادات')}
                                        </Button>
                                    </div>
                                </form>
                            </section>
                        </>
                    )}

                    {activeTab === 'data' && (
                        <>
                            {/* System Maintenance */}
                            <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm opacity-60">
                                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                    <RefreshCw size={20} className="text-orange-500" />
                                    {language === 'en' ? 'System Maintenance' : 'صيانة النظام'}
                                </h3>
                                <p className="text-sm text-slate-500 mb-6">
                                    {language === 'en' ? 'Performance tuning and cache clearing tools.' : 'أدوات تحسين الأداء ومسح التخزين المؤقت.'}
                                </p>
                                <Button variant="secondary" disabled className="flex items-center gap-2">
                                    <RefreshCw size={18} />
                                    {language === 'en' ? 'Clear Site Cache' : 'مسح التخزين المؤقت للموقع'}
                                </Button>
                            </section>

                            {/* Data Export */}
                            <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                    <Database size={20} className="text-indigo-500" />
                                    {language === 'en' ? 'Export Portfolio Data' : 'تصدير بيانات المحفظة'}
                                </h3>
                                <p className="text-sm text-slate-500 mb-6">
                                    {language === 'en' ? 'Download a complete backup of your portfolio data in JSON format.' : 'قم بتنزيل نسخة احتياطية كاملة لبيانات محفظتك بتنسيق JSON.'}
                                </p>
                                <Button
                                    variant="secondary"
                                    onClick={handleExportData}
                                    className="flex items-center gap-2"
                                >
                                    <Download size={18} />
                                    {language === 'en' ? 'Export as JSON' : 'تصدير بصيغة JSON'}
                                </Button>
                            </section>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
