import React from 'react';
import SectionWrapper from '../UI/SectionWrapper';
import { User, MapPin, Globe, Download, Mail } from 'lucide-react';
import { useAbout } from '../../hooks/usePortfolio';
import { useLanguage } from '../../services/LanguageContext';
import OptimizedImage from '../UI/OptimizedImage';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  const { language } = useLanguage();
  const { data, isLoading: loading } = useAbout();

  if (loading) return null;

  const aboutText = language === 'en' ? data?.about_en : data?.about_ar;
  const address = language === 'en' ? data?.address_en : data?.address_ar;
  const title = language === 'en' ? data?.title_en : data?.title_ar;
  const workStatus = language === 'en' ? (data?.work_status_en || 'Remote / Hybrid') : (data?.work_status_ar || 'عن بعد / هجين');
  const freelanceStatus = language === 'en' ? (data?.freelance_status_en || 'Freelance Available') : (data?.freelance_status_ar || 'متاح للعمل المستقل');

  return (
    <SectionWrapper id="about" background="white">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
             <span className="w-12 h-1 bg-primary-600 rounded-full"></span>
             <h2 className="text-sm font-bold tracking-widest text-primary-600 uppercase">
              {language === 'en' ? 'About Me' : 'عني'}
            </h2>
          </div>
          
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
            {title || (language === 'en' ? 'Experienced developer solving complex problems.' : 'مطور ذو خبرة يحل المشكلات المعقدة.')}
          </h3>
          
          <div className="space-y-4 text-slate-600 leading-relaxed whitespace-pre-wrap text-lg">
            {aboutText}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {address && (
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-slate-50 rounded-xl text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase">{language === 'en' ? 'Location' : 'الموقع'}</p>
                  <p className="text-sm font-bold text-slate-800">{address}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 group">
              <div className="p-3 bg-slate-50 rounded-xl text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                <Globe size={22} />
              </div>
              <div>
                  <p className="text-xs text-slate-400 font-medium uppercase">{language === 'en' ? 'Work Status' : 'حالة العمل'}</p>
                  <p className="text-sm font-bold text-slate-800">{workStatus}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="p-3 bg-slate-50 rounded-xl text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                <User size={22} />
              </div>
               <div>
                  <p className="text-xs text-slate-400 font-medium uppercase">{language === 'en' ? 'Freelance' : 'العمل الحر'}</p>
                  <p className="text-sm font-bold text-slate-800">{freelanceStatus}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-10 flex gap-4">
             <a 
               href="#contact" 
               className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1"
             >
               <Mail size={18} />
               {language === 'en' ? 'Contact Me' : 'تواصل معي'}
             </a>
             {data?.cvUrl && (
               <a 
                 href={data.cvUrl} 
                 target="_blank"
                 className="px-6 py-3 bg-white text-slate-700 font-semibold rounded-lg border border-slate-200 hover:border-primary-600 hover:text-primary-600 transition-all flex items-center gap-2"
               >
                 <Download size={18} />
                 {language === 'en' ? 'Download CV' : 'تحميل السيرة الذاتية'}
               </a>
             )}
          </div>
        </motion.div>

        {/* Image */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/20 to-transparent rounded-2xl transform translate-x-4 translate-y-4 -z-10"></div>
          <div className="absolute inset-0 border-2 border-slate-900/5 rounded-2xl transform -translate-x-4 -translate-y-4 -z-10"></div>
          
          <div className="rounded-2xl overflow-hidden shadow-2xl relative aspect-[4/5] bg-slate-200">
            <OptimizedImage
              src={data?.imageUrl || "https://picsum.photos/600/600?random=10"}
              alt="Profile"
              className="w-full h-full"
              imageClassName="object-cover hover:scale-105 transition-transform duration-700"
              width={600}
              height={750}
            />
          </div>
          
          {/* Experience Badge (Optional) */}
          <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border border-slate-100 hidden md:block animate-bounce-slow">
            <div className="flex items-center gap-4">
               <div className="text-4xl font-bold text-primary-600">
                 {new Date().getFullYear() - 2020}+
               </div>
               <div className="text-sm font-semibold text-slate-600 leading-tight">
                 {language === 'en' ? 'Years of\nExperience' : 'سنوات من\nالخبرة'}
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default About;