import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    isRTL: boolean;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        return (localStorage.getItem('lang') as Language) || 'en';
    });

    useEffect(() => {
        localStorage.setItem('lang', language);
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
    };

    const isRTL = language === 'ar';

    // Basic translation helper (can be expanded)
    const t = (key: string) => {
        return key; // Placeholder for real translations
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, isRTL, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};
