import React, { useEffect, useState } from 'react';
import SectionWrapper from '../UI/SectionWrapper';
import { User, MapPin, Globe } from 'lucide-react';
import { fetchAbout, AboutData } from '../../services/api';
import { useLanguage } from '../../services/LanguageContext';

const About: React.FC = () => {
  const { language } = useLanguage();
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbout()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  const aboutText = language === 'en' ? data?.about_en : data?.about_ar;
  const address = language === 'en' ? data?.address_en : data?.address_ar;
  const title = language === 'en' ? data?.title_en : data?.title_ar;
  const workStatus = language === 'en' ? (data?.work_status_en || 'Remote / Hybrid') : (data?.work_status_ar || 'عن بعد / هجين');
  const freelanceStatus = language === 'en' ? (data?.freelance_status_en || 'Freelance Available') : (data?.freelance_status_ar || 'متاح للعمل المستقل');

  return (
    <SectionWrapper id="about" background="white">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-primary-600 uppercase mb-3">
            {language === 'en' ? 'About Me' : 'عني'}
          </h2>
          <h3 className="text-3xl font-bold text-slate-900 mb-6">
            {title || (language === 'en' ? 'Experienced developer solving complex problems.' : 'مطور ذو خبرة يحل المشكلات المعقدة.')}
          </h3>
          <div className="space-y-4 text-slate-600 leading-relaxed whitespace-pre-wrap">
            {aboutText}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {address && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-full text-slate-700">
                  <MapPin size={18} />
                </div>
                <span className="text-sm font-medium text-slate-700">{address}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-full text-slate-700">
                <Globe size={18} />
              </div>
              <span className="text-sm font-medium text-slate-700">{workStatus}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-full text-slate-700">
                <User size={18} />
              </div>
              <span className="text-sm font-medium text-slate-700">
                {freelanceStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-primary-200 rounded-2xl transform translate-x-4 translate-y-4 -z-10"></div>
          <img
            src={data?.imageUrl || "https://picsum.photos/600/600?random=10"}
            alt="Profile"
            className="rounded-2xl shadow-lg w-full object-cover aspect-square grayscale hover:grayscale-0 transition-all duration-500"
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default About;