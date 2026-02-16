import React, { useEffect, useState } from 'react';
import SectionWrapper from '../UI/SectionWrapper';
import { fetchExperience, fetchEducation, Experience as ExperienceType, Education } from '../../services/api';
import { useLanguage } from '../../services/LanguageContext';

const ExperienceItem: React.FC<{ job: ExperienceType }> = ({ job }) => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const description = language === 'en' ? job.description_en : job.description_ar;
  const shouldTruncate = description && description.length > 200;

  return (
    <div className="relative pl-8 md:pl-12">
      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-primary-600"></div>

      <div className="flex flex-col mb-2">
        <h4 className="text-xl font-bold text-slate-900">
          {language === 'en' ? job.title_en : job.title_ar}
        </h4>
        <span className="text-sm font-semibold text-slate-500 mt-1">
          {language === 'en' ? job.period_en : job.period_ar}
        </span>
      </div>

      <div className="text-lg text-primary-700 font-medium mb-4">
        {language === 'en' ? job.company_en : job.company_ar}
      </div>

      <div className="text-slate-600 leading-relaxed mb-4 max-w-3xl">
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
  );
};

const EducationItem: React.FC<{ edu: Education }> = ({ edu }) => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const description = language === 'en' ? edu.description_en : edu.description_ar;
  const shouldTruncate = description && description.length > 200;

  return (
    <div className="relative pl-8 md:pl-12">
      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-slate-400"></div>

      <div className="flex flex-col mb-2">
        <h4 className="text-xl font-bold text-slate-900">
          {language === 'en' ? edu.degree_en : edu.degree_ar}
        </h4>
        <span className="text-sm font-semibold text-slate-500 mt-1">
          {language === 'en' ? edu.period_en : edu.period_ar}
        </span>
      </div>

      <div className="text-lg text-slate-700 font-medium mb-4">
        {language === 'en' ? edu.institution_en : edu.institution_ar}
      </div>

      <div className="text-slate-600 leading-relaxed mb-4 max-w-3xl">
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
  );
};

const Experience: React.FC = () => {
  const { language } = useLanguage();
  const [experience, setExperience] = useState<ExperienceType[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchExperience(), fetchEducation()])
      .then(([expData, eduData]) => {
        setExperience(expData);
        setEducation(eduData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <SectionWrapper id="experience" background="white">
      <div className="grid lg:grid-cols-2 gap-16">
        {/* Work Experience */}
        <div>
          <div className="mb-12">
            <h2 className="text-sm font-bold tracking-widest text-primary-600 uppercase mb-3">
              {language === 'en' ? 'Career Path' : 'مسار العمل'}
            </h2>
            <h3 className="text-3xl font-bold text-slate-900">
              {language === 'en' ? 'Work Experience' : 'خبرة العمل'}
            </h3>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-3 md:ml-6 space-y-12">
            {experience.map((job) => (
              <ExperienceItem key={job.id} job={job} />
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="mb-12">
            <h2 className="text-sm font-bold tracking-widest text-primary-600 uppercase mb-3">
              {language === 'en' ? 'Learning' : 'التعليم'}
            </h2>
            <h3 className="text-3xl font-bold text-slate-900">
              {language === 'en' ? 'Education' : 'التعليم الأكاديمي'}
            </h3>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-3 md:ml-6 space-y-12">
            {education.map((edu) => (
              <EducationItem key={edu.id} edu={edu} />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Experience;