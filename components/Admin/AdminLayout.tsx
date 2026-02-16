import React from 'react';
import Sidebar from './Sidebar';
import { useLanguage } from '../../services/LanguageContext';
import { Globe, Sun, Moon } from 'lucide-react';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { toggleLanguage, language } = useLanguage();
    const [isDarkMode, setIsDarkMode] = React.useState(true);

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Navigation */}
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10">
                    <h1 className="text-lg font-semibold">
                        {/* Page title would go here dynamically */}
                        Admin Dashboard
                    </h1>

                    <div className="flex items-center space-x-4 gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors gap-2"
                        >
                            <Globe size={18} />
                            <span className="text-sm font-medium">{language === 'en' ? 'العربية' : 'English'}</span>
                        </button>

                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
