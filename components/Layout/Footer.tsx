import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAbout, fetchStats, AboutData, Stats } from '../../services/api';
import { useLanguage } from '../../services/LanguageContext';
import { Eye } from 'lucide-react';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const [about, setAbout] = useState<AboutData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchAbout().then(setAbout).catch(console.error);
    fetchStats().then(setStats).catch(console.error);
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h5 className="text-white text-lg font-bold mb-2">
            {language === 'en' ? about?.name_en : about?.name_ar || 'Portfolio'}
          </h5>
          <p className="text-sm text-slate-400">
            © {currentYear} {language === 'en' ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex gap-8 text-sm font-medium">
            <Link to="/privacy" className="hover:text-white transition-colors">
              {language === 'en' ? 'Privacy' : 'الخصوصية'}
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              {language === 'en' ? 'Terms' : 'الشروط'}
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              {language === 'en' ? 'Contact' : 'اتصل بي'}
            </Link>
          </div>

          {stats && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full">
              <Eye size={12} />
              <span>{stats.page_hits} {language === 'en' ? 'views' : 'مشاهدة'}</span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;