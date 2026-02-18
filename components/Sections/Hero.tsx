import React from 'react';
import { useAbout } from '../../hooks/usePortfolio';
import { useLanguage } from '../../services/LanguageContext';
import Button from '../UI/Button';
import OptimizedImage from '../UI/OptimizedImage';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Twitter, Mail, Download } from 'lucide-react';

const Hero: React.FC = () => {
  const { language } = useLanguage();
  const { data, isLoading: loading } = useAbout();

  if (loading) return <div className="h-screen flex items-center justify-center font-medium text-slate-400">Loading...</div>;

  const name = language === 'en' ? data?.name_en : data?.name_ar;
  const title = language === 'en' ? data?.title_en : data?.title_ar;
  const shortBio = language === 'en' ? data?.short_bio_en : data?.short_bio_ar;
  const socialLinks = data?.social_links ? JSON.parse(data.social_links) : {};

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-50">
      {/* Background Decor - Animated Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-200/40 rounded-full blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-purple-200/40 rounded-full blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="order-2 lg:order-1 text-center lg:text-start"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-block py-2 px-4 rounded-full bg-white border border-slate-200 text-primary-600 text-sm font-bold tracking-wider shadow-sm mb-6">
                👋 {language === 'en' ? 'Welcome to my portfolio' : 'مرحباً بك في معرض أعمالي'}
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
              {language === 'en' ? "I'm" : "أنا"} <span className="text-primary-600">{name}</span>
            </motion.h1>

            <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl text-slate-500 font-medium mb-8">
              {title}
            </motion.h2>

            <motion.p variants={itemVariants} className="text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {shortBio}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button size="lg" withIcon onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                {language === 'en' ? "Let's Talk" : "تواصل معي"}
              </Button>
              {data?.cvUrl && (
                <Button size="lg" variant="outline" onClick={() => window.open(data.cvUrl, '_blank')}>
                  <Download size={18} className={language === 'en' ? "mr-2" : "ml-2"} />
                  {language === 'en' ? 'Download CV' : 'تحميل السيرة الذاتية'}
                </Button>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-6 justify-center lg:justify-start text-slate-400">
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors transform hover:scale-110">
                  <Github size={24} />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors transform hover:scale-110">
                  <Linkedin size={24} />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-sky-500 transition-colors transform hover:scale-110">
                  <Twitter size={24} />
                </a>
              )}
              {data?.email && (
                 <a href={`mailto:${data.email}`} className="hover:text-red-500 transition-colors transform hover:scale-110">
                   <Mail size={24} />
                 </a>
              )}
            </motion.div>
          </motion.div>

          {/* Image/Visual Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end relative"
          >
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px]">
              {/* Abstract Shapes behind image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 to-blue-50 rounded-full animate-pulse opacity-50 blur-xl"></div>
              
              {data?.imageUrl ? (
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
                  <OptimizedImage
                    src={data.imageUrl}
                    alt={name || 'Profile'}
                    className="w-full h-full"
                    imageClassName="object-cover"
                    width={600}
                    height={600}
                    priority
                  />
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                  <span className="text-6xl">👋</span>
                </div>
              )}

              {/* Floating Badge */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce-slow"
              >
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-bold text-slate-700">
                  {language === 'en' ? 'Available for work' : 'متاح للعمل'}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-slate-400 cursor-pointer"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <ArrowDown size={24} />
      </motion.div>
    </section>
  );
};

export default Hero;
