import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type Language = 'ar' | 'en';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    isRTL: boolean;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    // Check if the current route is an admin route or the login page
    const isAdminArea = location.pathname.startsWith('/admin') || location.pathname === '/login';

    const [language, setLanguage] = useState<Language>(() => {
        return (localStorage.getItem('lang') as Language) || 'en';
    });

    // On public site, always force English. On admin area, use selected language.
    const effectiveLanguage = isAdminArea ? language : 'en';

    useEffect(() => {
        // Only persist language choice if we're in the admin area
        if (isAdminArea) {
            localStorage.setItem('lang', language);
        }

        document.documentElement.lang = effectiveLanguage;
        document.documentElement.dir = effectiveLanguage === 'ar' ? 'rtl' : 'ltr';
    }, [language, effectiveLanguage, isAdminArea]);

    const toggleLanguage = () => {
        // Only allow toggling if in the admin area (or keep it as a no-op otherwise)
        if (isAdminArea) {
            setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
        }
    };

    const isRTL = effectiveLanguage === 'ar';

    // Basic translation helper (can be expanded)
    const t = (key: string) => {
        return key; // Placeholder for real translations
    };

    return (
        <LanguageContext.Provider value={{ language: effectiveLanguage, toggleLanguage, isRTL, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};
