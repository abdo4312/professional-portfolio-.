import React, { useEffect, useState } from 'react';
import { fetchAbout, AboutData } from '../../services/api';
import { useLanguage } from '../../services/LanguageContext';
import Button from '../UI/Button';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const { language } = useLanguage();
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbout()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-[50vh] flex items-center justify-center font-medium text-slate-400">Loading...</div>;

  const name = language === 'en' ? data?.name_en : data?.name_ar;
  const title = language === 'en' ? data?.title_en : data?.title_ar;
  const shortBio = language === 'en' ? data?.short_bio_en : data?.short_bio_ar;

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Decor - Subtle Gradients */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-gradient-to-bl from-primary-50 to-transparent rounded-bl-full opacity-60"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-1/3 bg-gradient-to-tr from-slate-100 to-transparent rounded-tr-full opacity-60"></div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold tracking-wider mb-6 border border-slate-200">
            {language === 'en' ? 'OPEN TO OPPORTUNITIES' : 'متاح للعمل'}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
            {language === 'en' ? "Hello, I'm" : "مرحباً، أنا"} {name}. <br />
            <span className="text-slate-500">{title}</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl">
            {shortBio}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" withIcon onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              {language === 'en' ? 'Get in Touch' : 'تواصل معي'}
            </Button>
            {data?.cvUrl && (
              <Button size="lg" variant="outline" onClick={() => window.open(data.cvUrl, '_blank')}>
                {language === 'en' ? 'Download CV' : 'تحميل السيرة الذاتية'}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;