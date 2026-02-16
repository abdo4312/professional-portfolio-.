import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    User,
    Briefcase,
    Wrench,
    MessageSquare,
    Settings,
    FileText,
    GraduationCap,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Layers
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageContext';
import { cn } from '../../services/utils';
import { logout } from '../../services/api';

const Sidebar: React.FC = () => {
    const { language, isRTL } = useLanguage();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = React.useState(false);
    const [loggingOut, setLoggingOut] = React.useState(false);

    const menuItems = [
        {
            path: '/admin/dashboard',
            icon: LayoutDashboard,
            label: { en: 'Dashboard', ar: 'لوحة التحكم' }
        },
        {
            path: '/admin/personal',
            icon: User,
            label: { en: 'Personal Info', ar: 'المعلومات الشخصية' }
        },
        {
            path: '/admin/projects',
            icon: Briefcase,
            label: { en: 'Projects', ar: 'المشاريع' }
        },
        {
            path: '/admin/skills',
            icon: Wrench,
            label: { en: 'Skills', ar: 'المهارات' }
        },
        {
            path: '/admin/experience',
            icon: GraduationCap,
            label: { en: 'Exp & Edu', ar: 'الخبرات والتعليم' }
        },
        {
            path: '/admin/services',
            icon: Layers,
            label: { en: 'Services', ar: 'الخدمات' }
        },
        {
            path: '/admin/messages',
            icon: MessageSquare,
            label: { en: 'Messages', ar: 'الرسائل' }
        },
        {
            path: '/admin/settings',
            icon: Settings,
            label: { en: 'Settings', ar: 'الإعدادات' }
        },
    ];

    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            // Still redirect even if server logout fails
            localStorage.removeItem('token');
            navigate('/login');
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <div
            className={cn(
                "h-screen bg-slate-900 text-white transition-all duration-300 relative border-r border-slate-800",
                collapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo Section */}
            <div className="p-6 mb-4 flex items-center justify-between">
                {!collapsed && (
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        {language === 'en' ? 'Tafannen' : 'تفنّن'}
                    </span>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1 hover:bg-slate-800 rounded-md"
                >
                    {collapsed ? (isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />) : (isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />)}
                </button>
            </div>

            {/* Menu Section */}
            <nav className="flex-1 px-3 space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center p-3 rounded-lg transition-colors group",
                            isActive
                                ? "bg-blue-600/20 text-blue-400 border-l-4 border-blue-600"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <item.icon size={22} className={cn(collapsed ? "mx-auto" : "me-3")} />
                        {!collapsed && <span>{item.label[language]}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Logout Section */}
            <div className="absolute bottom-4 w-full px-3">
                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center w-full p-3 text-slate-400 hover:bg-red-900/20 hover:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                >
                    <LogOut size={22} className={cn(collapsed ? "mx-auto" : "me-3")} />
                    {!collapsed && <span>{loggingOut ? (language === 'en' ? 'Logging out...' : 'جاري الخروج...') : (language === 'en' ? 'Logout' : 'تسجيل الخروج')}</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
