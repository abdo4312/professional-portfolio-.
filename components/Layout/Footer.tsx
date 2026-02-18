import React from 'react';
import { Link } from 'react-router-dom';
import { useAbout, useStats } from '../../hooks/usePortfolio';
import { useLanguage } from '../../services/LanguageContext';
import { Eye, Github, Linkedin, Twitter, Mail, ArrowUp } from 'lucide-react';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const { data: about } = useAbout();
  const { data: stats } = useStats();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = about?.social_links ? JSON.parse(about.social_links) : {};

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-blue-500 to-purple-500"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Column 1: Brand & Bio */}
          <div>
            <h5 className="text-white text-2xl font-bold mb-4 tracking-tight">
              {language === 'en' ? about?.name_en : about?.name_ar || 'Portfolio'}
            </h5>
            <p className="text-slate-400 mb-6 leading-relaxed max-w-sm">
              {language === 'en' 
                ? about?.short_bio_en || 'Building digital experiences with passion and precision.'
                : about?.short_bio_ar || 'بناء تجارب رقمية بشغف ودقة.'}
            </p>
            <div className="flex gap-4">
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 transition-all duration-300">
                  <Github size={20} />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#0077b5] hover:text-white transition-all duration-300">
                  <Linkedin size={20} />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#1DA1F2] hover:text-white transition-all duration-300">
                  <Twitter size={20} />
                </a>
              )}
              {about?.email && (
                <a href={`mailto:${about.email}`} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all duration-300">
                  <Mail size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h6 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">
              {language === 'en' ? 'Quick Links' : 'روابط سريعة'}
            </h6>
            <ul className="space-y-3">
              <li>
                <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-primary-400 transition-colors">
                  {language === 'en' ? 'About Me' : 'من أنا'}
                </button>
              </li>
              <li>
                <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-primary-400 transition-colors">
                  {language === 'en' ? 'Services' : 'الخدمات'}
                </button>
              </li>
              <li>
                <button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-primary-400 transition-colors">
                  {language === 'en' ? 'Projects' : 'المشاريع'}
                </button>
              </li>
              <li>
                <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-primary-400 transition-colors">
                  {language === 'en' ? 'Contact' : 'تواصل معي'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Info */}
          <div>
            <h6 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">
              {language === 'en' ? 'Information' : 'معلومات'}
            </h6>
            <ul className="space-y-3 mb-6">
              <li>
                <Link to="/privacy" className="hover:text-primary-400 transition-colors">
                  {language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary-400 transition-colors">
                  {language === 'en' ? 'Terms of Service' : 'شروط الخدمة'}
                </Link>
              </li>
            </ul>
            
            {stats && (
              <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50">
                <Eye size={14} className="text-primary-500" />
                <span>{stats.page_hits} {language === 'en' ? 'Total Views' : 'إجمالي الزيارات'}</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {currentYear} {about?.name_en || 'Portfolio'}. {language === 'en' ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}
          </p>
          
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            {language === 'en' ? 'Back to Top' : 'العودة للأعلى'}
            <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-primary-600 flex items-center justify-center transition-colors">
              <ArrowUp size={16} />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
