import React, { useEffect, useState } from 'react';
import { fetchProjects, fetchSkills, fetchContacts, fetchExperience, fetchServices, fetchStats, fetchDailyStats, ContactMessage, DailyStats } from '../../services/api';
import { useLanguage } from '../../services/LanguageContext';
import { Briefcase, MessageSquare, Code, Layers, GraduationCap, ArrowRight, ExternalLink, PlusCircle, Box, Eye, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../services/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardHome: React.FC = () => {
    const { language } = useLanguage();
    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        messages: 0,
        unreadMessages: 0,
        experience: 0,
        services: 0,
        pageHits: 0,
    });
    const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
    const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [projects, skills, messages, experience, services, statsData, dailyStatsData] = await Promise.all([
                fetchProjects(),
                fetchSkills(),
                fetchContacts(),
                fetchExperience(),
                fetchServices(),
                fetchStats(),
                fetchDailyStats(),
            ]);

            const unread = messages.filter(m => !m.isRead);

            setStats({
                projects: projects.length,
                skills: skills.length,
                messages: messages.length,
                unreadMessages: unread.length,
                experience: experience.length,
                services: services.length,
                pageHits: statsData?.page_hits || 0,
            });

            setDailyStats(dailyStatsData);
            setRecentMessages(messages.slice(0, 5));
        } catch (error) {
            console.error('Error loading dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { title: language === 'en' ? 'Page Views' : 'مشاهدات الصفحة', value: stats.pageHits, icon: Eye, color: 'bg-amber-500', link: '#' },
        { title: language === 'en' ? 'Projects' : 'المشاريع', value: stats.projects, icon: Layers, color: 'bg-blue-500', link: '/admin/projects' },
        { title: language === 'en' ? 'Skills' : 'المهارات', value: stats.skills, icon: Code, color: 'bg-indigo-500', link: '/admin/skills' },
        { title: language === 'en' ? 'Messages' : 'الرسائل', value: stats.messages, icon: MessageSquare, subValue: stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : '', color: 'bg-emerald-500', link: '/admin/messages' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {language === 'en' ? 'Welcome back, Admin' : 'مرحباً بعودتك، أيها المشرف'}
                </h2>
                <p className="text-slate-500 mt-2">
                    {language === 'en' ? "Here's what's happening with your portfolio today." : 'إليك ما يحدث في محفظتك اليوم.'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, i) => (
                    <Link
                        to={card.link}
                        key={i}
                        className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-3 rounded-2xl text-white shadow-lg", card.color)}>
                                <card.icon size={24} />
                            </div>
                            <ArrowRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={20} />
                        </div>
                        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{card.title}</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold">{card.value}</span>
                            {card.subValue && <span className="text-[10px] bg-red-50 dark:bg-red-900/20 text-red-500 px-2 py-0.5 rounded-full font-bold">{card.subValue}</span>}
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Daily Visitors Chart (Recharts) */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2">
                            <TrendingUp size={18} className="text-amber-500" />
                            {language === 'en' ? 'Visitor Analytics' : 'تحليلات الزوار'}
                        </h3>
                        <div className="text-xs text-slate-400">
                             {language === 'en' ? 'Last 7 Days' : 'آخر 7 أيام'}
                        </div>
                    </div>
                    <div className="p-6 h-[300px] min-h-0">
                        {dailyStats.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={dailyStats}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorHits" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis 
                                        dataKey="visit_date" 
                                        tickFormatter={(str) => new Date(str).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-EG', { weekday: 'short' })}
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis 
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickCount={5}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: number) => [value, language === 'en' ? 'Page Views' : 'مشاهدات']}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    />
                                    <Area type="monotone" dataKey="page_hits" stroke="#f59e0b" fillOpacity={1} fill="url(#colorHits)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm flex-col gap-2">
                                <TrendingUp size={48} className="text-slate-200" />
                                {language === 'en' ? 'No data available yet' : 'لا توجد بيانات متاحة بعد'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Messages */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2">
                            <MessageSquare size={18} className="text-blue-500" />
                            {language === 'en' ? 'Recent Messages' : 'الرسائل الأخيرة'}
                        </h3>
                        <Link to="/admin/messages" className="text-sm text-blue-500 hover:underline">
                            {language === 'en' ? 'View Inbox' : 'عرض البريد'}
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="p-4 space-y-2 animate-pulse">
                                    <div className="h-4 w-1/4 bg-slate-100 dark:bg-slate-800 rounded" />
                                    <div className="h-3 w-3/4 bg-slate-100 dark:bg-slate-800 rounded" />
                                </div>
                            ))
                        ) : recentMessages.length === 0 ? (
                            <div className="p-10 text-center text-slate-400">
                                {language === 'en' ? 'No messages yet.' : 'لا توجد رسائل بعد.'}
                            </div>
                        ) : recentMessages.map((msg) => (
                            <div key={msg.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-sm font-bold">{msg.name}</span>
                                    <span className="text-[10px] text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-1">{msg.subject || msg.message}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm p-6">
                    <h3 className="font-bold mb-6 flex items-center gap-2">
                        <PlusCircle size={18} className="text-indigo-500" />
                        {language === 'en' ? 'Quick Actions' : 'إجراءات سريعة'}
                    </h3>
                    <div className="space-y-4">
                        <Link
                            to="/admin/projects/new"
                            className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-700 dark:text-slate-300 rounded-2xl transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-900/50"
                        >
                            <Layers size={18} className="text-blue-500" />
                            <span className="text-sm font-medium">{language === 'en' ? 'Post New Project' : 'نشر مشروع جديد'}</span>
                        </Link>
                        <Link
                            to="/admin/skills"
                            className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 rounded-2xl transition-all border border-transparent hover:border-indigo-200 dark:hover:border-indigo-900/50"
                        >
                            <Code size={18} className="text-indigo-500" />
                            <span className="text-sm font-medium">{language === 'en' ? 'Update Skills' : 'تحديث المهارات'}</span>
                        </Link>
                        <a
                            href="/"
                            target="_blank"
                            className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-slate-300 rounded-2xl transition-all border border-transparent hover:border-emerald-200 dark:hover:border-emerald-900/50"
                        >
                            <ExternalLink size={18} className="text-emerald-500" />
                            <span className="text-sm font-medium">{language === 'en' ? 'View Live Site' : 'عرض الموقع المباشر'}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
