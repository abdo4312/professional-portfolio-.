import React, { useState } from 'react';
import SectionWrapper from '../UI/SectionWrapper';
import { Skill } from '../../services/api';
import { useSkills } from '../../hooks/usePortfolio';
import { useLanguage } from '../../services/LanguageContext';
import { Code2, Server, Wrench, Palette, Layout, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

const SkillCard: React.FC<{ title: string; icon: React.ReactNode; items: Skill[]; delay: number }> = ({ title, icon, items, delay }) => {
  if (items.length === 0) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col group"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
          {icon}
        </div>
        <h4 className="text-xl font-bold text-slate-900 group-hover:text-primary-700 transition-colors">{title}</h4>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-auto">
        {items.map((skill) => (
          <motion.div
            key={skill.id}
            whileHover={{ scale: 1.05 }}
            className="relative overflow-hidden inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-slate-50 text-slate-700 border border-slate-200 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 cursor-default"
          >
            <span className="relative z-10">{skill.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Skills: React.FC = () => {
  const { language } = useLanguage();
  const { data: skills = [], isLoading: loading } = useSkills();

  if (loading) return null;

  // Sort by display order
  const sortedSkills = [...skills].sort((a, b) => a.displayOrder - b.displayOrder);

  // Normalize and group skills
  const normalizeCategory = (cat: string) => {
    if (!cat) return 'other';
    const lower = cat.toLowerCase().trim();
    if (lower.includes('front') || lower.includes('react') || lower.includes('vue') || lower.includes('angular') || lower.includes('web')) return 'frontend';
    if (lower.includes('back') || lower.includes('node') || lower.includes('db') || lower.includes('data') || lower.includes('sql') || lower.includes('server')) return 'backend';
    if (lower.includes('design') || lower.includes('ui') || lower.includes('ux') || lower.includes('adobe') || lower.includes('figma')) return 'design';
    if (lower.includes('tool') || lower.includes('devops') || lower.includes('git') || lower.includes('docker') || lower.includes('cloud')) return 'tools';
    return 'other';
  };

  const groupedSkills = sortedSkills.reduce((acc, skill) => {
    const category = normalizeCategory(skill.category);
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // Define sections configuration
  const sections = [
    {
      id: 'frontend',
      title_en: "Frontend Development",
      title_ar: "تطوير الواجهة الأمامية",
      icon: <Code2 size={28} strokeWidth={1.5} />,
      items: groupedSkills['frontend'] || []
    },
    {
      id: 'backend',
      title_en: "Backend & Database",
      title_ar: "الخلفية وقواعد البيانات",
      icon: <Server size={28} strokeWidth={1.5} />,
      items: groupedSkills['backend'] || []
    },
    {
      id: 'design',
      title_en: "UI/UX Design",
      title_ar: "تصميم واجهة المستخدم",
      icon: <Palette size={28} strokeWidth={1.5} />,
      items: groupedSkills['design'] || []
    },
    {
      id: 'tools',
      title_en: "Tools & DevOps",
      title_ar: "الأدوات والعمليات",
      icon: <Wrench size={28} strokeWidth={1.5} />,
      items: groupedSkills['tools'] || []
    },
    {
      id: 'other',
      title_en: "Other Skills",
      title_ar: "مهارات أخرى",
      icon: <Terminal size={28} strokeWidth={1.5} />,
      items: groupedSkills['other'] || []
    }
  ].filter(section => section.items.length > 0);

  return (
    <SectionWrapper id="skills" background="gray" className="overflow-hidden">
      <div className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold tracking-widest text-primary-600 uppercase mb-3"
          >
            {language === 'en' ? 'Expertise' : 'الخبرات'}
          </motion.h2>
          
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700"
          >
            {language === 'en' ? 'Skills & Proficiency' : 'المهارات والكفاءات'}
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            {language === 'en'
              ? 'A comprehensive overview of my technical stack and creative tools used to build scalable digital solutions.'
              : 'نظرة شاملة على مجموعة التقنيات والأدوات الإبداعية التي أستخدمها لبناء حلول رقمية قابلة للتوسع.'}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {sections.map((section, index) => (
            <SkillCard
              key={section.id}
              title={language === 'en' ? section.title_en : section.title_ar}
              icon={section.icon}
              items={section.items}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl -z-10" />
    </SectionWrapper>
  );
};

export default Skills;