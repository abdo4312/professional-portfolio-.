import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks, personalInfo } from '../../data/portfolioData';
import logo from '@/assets/logo.png';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../services/LanguageContext';

const Navbar: React.FC = () => {
  const { language, toggleLanguage, isRTL } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const translations: Record<string, string> = {
    'About': 'نبذة عني',
    'Services': 'خدماتي',
    'Skills': 'مهاراتي',
    'Experience': 'الخبرات',
    'Projects': 'أعمالي',
    'Contact': 'تواصل معي',
    'Hire Me': 'وظفني'
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Lock body scroll when menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-3 shadow-sm' 
          : 'bg-transparent py-5'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        <Link to="/" className="block relative z-50" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img 
            src={logo} 
            alt={personalInfo.name} 
            className="h-10 md:h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {language === 'en' ? link.name : translations[link.name] || link.name}
            </a>
          ))}
          
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Language"
          >
            <Globe size={20} className="text-slate-600 dark:text-slate-300" />
          </button>

          <a 
            href="#contact"
            className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-full hover:bg-slate-800 dark:hover:bg-slate-100 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {language === 'en' ? 'Hire Me' : translations['Hire Me']}
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden relative z-50">
           <button
            onClick={toggleLanguage}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Globe size={20} className="text-slate-600 dark:text-slate-300" />
          </button>

          <button 
            className="text-slate-900 dark:text-white hover:text-primary-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl flex flex-col justify-center items-center md:hidden"
          >
            <nav className="flex flex-col items-center gap-8 w-full max-w-sm px-6">
              {navLinks.map((link, index) => (
                <motion.a 
                  key={link.name} 
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.1 }}
                  className="text-2xl font-bold text-slate-800 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {language === 'en' ? link.name : translations[link.name] || link.name}
                </motion.a>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 + 0.1 }}
                className="w-full pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center gap-6"
              >
                <Link 
                  to="/contact"
                  className="w-full py-4 bg-primary-600 text-white text-center text-lg font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                   {language === 'en' ? 'Hire Me' : translations['Hire Me']}
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;