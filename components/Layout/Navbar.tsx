import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks, personalInfo } from '../../data/portfolioData';
import logo from '@/assets/logo.png';
import { Menu, X, Github, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../services/LanguageContext';

const Navbar: React.FC = () => {
  const { isRTL } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 md:py-5 shadow-sm'
          : 'bg-transparent py-7 md:py-10'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        <Link to="/" className="block relative z-50" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img 
            src={logo} 
            alt={personalInfo.name} 
            className="h-10 md:h-14 w-auto object-contain transition-all hover:scale-110"
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
              {link.name}
            </a>
          ))}

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

          <div className="flex items-center gap-4">
            {personalInfo.socials.github && (
              <a
                href={personalInfo.socials.github}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
            )}
            {personalInfo.socials.linkedin && (
              <a
                href={personalInfo.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            )}
          </div>

          <a 
            href="#contact"
            className="px-5 py-2.5 bg-purple-600 text-white text-sm font-bold rounded-full hover:bg-purple-700 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Hire Me
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden relative z-50">
          <button 
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 transition-all shadow-sm active:scale-95"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white dark:bg-slate-950 flex flex-col md:hidden"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
            </div>

            <div className="flex-grow flex flex-col justify-center items-center relative z-10">
              <nav className="flex flex-col items-center gap-6 w-full max-w-sm px-10">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                    className="text-3xl font-extrabold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-all tracking-tight"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="relative group">
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-1 bg-primary-600 transition-all group-hover:w-full"></span>
                    </span>
                  </motion.a>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.1 + 0.1 }}
                  className="w-full pt-6 mt-4 flex flex-col items-center gap-6"
                >
                  <Link
                    to="/contact"
                    className="w-full py-5 bg-purple-600 text-white text-center text-xl font-black rounded-2xl hover:bg-purple-700 transition-all shadow-2xl transform active:scale-[0.98]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                     Hire Me
                  </Link>
                </motion.div>
              </nav>
            </div>

            {/* Bottom info in menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="p-10 text-center border-t border-slate-100 dark:border-slate-900"
            >
              <div className="flex justify-center gap-6 mb-4">
                {personalInfo.socials.github && (
                  <a href={personalInfo.socials.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <Github size={24} />
                  </a>
                )}
                {personalInfo.socials.linkedin && (
                  <a href={personalInfo.socials.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                    <Linkedin size={24} />
                  </a>
                )}
              </div>
              <p className="text-slate-400 text-sm font-medium">{personalInfo.email}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
