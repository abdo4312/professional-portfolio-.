import React, { useState } from 'react';
import SectionWrapper from '../UI/SectionWrapper';
import { Experience as ExperienceType, Education } from '../../services/api';
import { useExperience, useEducation } from '../../hooks/usePortfolio';
import { useLanguage } from '../../services/LanguageContext';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar, Building2 } from 'lucide-react';

const ExperienceItem: React.FC<{ job: ExperienceType; index: number }> = ({ job, index }) => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const description = language === 'en' ? job.description_en : job.description_ar;
  const shouldTruncate = description && description.length > 200;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8 md:pl-12 pb-12 last:pb-0"
    >
      {/* Timeline Dot */}
      <div className="absolute left-[-9px] top-0 w-5 h-5 rounded-full bg-white border-4 border-primary-600 shadow-sm z-10"></div>
      
      {/* Content Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
          <div>
            <h4 className="text-xl font-bold text-slate-900 mb-1">
              {language === 'en' ? job.title_en : job.title_ar}
            </h4>
            <div className="flex items-center gap-2 text-primary-700 font-medium">
              <Building2 size={16} />
              <span>{language === 'en' ? job.company_en : job.company_ar}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full w-fit">
            <Calendar size={14} />
            <span>{language === 'en' ? job.period_en : job.period_ar}</span>
          </div>
        </div>

        <div className="text-slate-600 leading-relaxed">
          <p className={`whitespace-pre-wrap ${!isExpanded && shouldTruncate ? 'line-clamp-3' : ''}`}>
            {description}
          </p>
          {shouldTruncate && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary-600 text-sm font-semibold hover:underline mt-2 inline-flex items-center gap-1"
            >
              {isExpanded 
                ? (language === 'en' ? 'Show less' : 'عرض أقل') 
                : (language === 'en' ? 'Read more' : 'اقرأ المزيد')}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const EducationItem: React.FC<{ edu: Education; index: number }> = ({ edu, index }) => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const description = language === 'en' ? edu.description_en : edu.description_ar;
  const shouldTruncate = description && description.length > 200;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8 md:pl-12 pb-12 last:pb-0"
    >
      {/* Timeline Dot */}
      <div className="absolute left-[-9px] top-0 w-5 h-5 rounded-full bg-white border-4 border-slate-400 shadow-sm z-10"></div>

      {/* Content Card */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
          <div>
            <h4 className="text-xl font-bold text-slate-900 mb-1">
              {language === 'en' ? edu.degree_en : edu.degree_ar}
            </h4>
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <Building2 size={16} />
              <span>{language === 'en' ? edu.institution_en : edu.institution_ar}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 bg-white px-3 py-1 rounded-full w-fit border border-slate-200">
            <Calendar size={14} />
            <span>{language === 'en' ? edu.period_en : edu.period_ar}</span>
          </div>
        </div>

        <div className="text-slate-600 leading-relaxed">
          <p className={`whitespace-pre-wrap ${!isExpanded && shouldTruncate ? 'line-clamp-3' : ''}`}>
            {description}
          </p>
          {shouldTruncate && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-600 text-sm font-semibold hover:underline mt-2 inline-flex items-center gap-1"
            >
              {isExpanded 
                ? (language === 'en' ? 'Show less' : 'عرض أقل') 
                : (language === 'en' ? 'Read more' : 'اقرأ المزيد')}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Experience: React.FC = () => {
  const { language } = useLanguage();
  const { data: experience = [], isLoading: expLoading } = useExperience();
  const { data: education = [], isLoading: eduLoading } = useEducation();
  const loading = expLoading || eduLoading;

  if (loading) return null;

  return (
    <SectionWrapper id="experience" background="white" className="overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 relative">
        {/* Work Experience */}
        <div>
          <div className="mb-12 flex items-center gap-4">
            <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
              <Briefcase size={32} />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-widest text-primary-600 uppercase mb-1">
                {language === 'en' ? 'Career Path' : 'مسار العمل'}
              </h2>
              <h3 className="text-3xl font-bold text-slate-900">
                {language === 'en' ? 'Work Experience' : 'خبرة العمل'}
              </h3>
            </div>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-3 md:ml-6">
            {experience.map((job, index) => (
              <ExperienceItem key={job.id} job={job} index={index} />
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="mb-12 flex items-center gap-4">
            <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
              <GraduationCap size={32} />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-1">
                {language === 'en' ? 'Learning' : 'التعليم'}
              </h2>
              <h3 className="text-3xl font-bold text-slate-900">
                {language === 'en' ? 'Education' : 'التعليم الأكاديمي'}
              </h3>
            </div>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-3 md:ml-6">
            {education.map((edu, index) => (
              <EducationItem key={edu.id} edu={edu} index={index} />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Experience;