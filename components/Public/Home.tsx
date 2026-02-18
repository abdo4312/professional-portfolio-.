import React, { useEffect } from 'react';
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';
import Hero from '../Sections/Hero';
import About from '../Sections/About';
import Services from '../Sections/Services';
import Skills from '../Sections/Skills';
import Experience from '../Sections/Experience';
import Projects from '../Sections/Projects';
import Contact from '../Sections/Contact';
import { incrementHit } from '../../services/api';
import { useLanguage } from '../../services/LanguageContext';
import { useSettings } from '../../hooks/usePortfolio';

const Home: React.FC = () => {
  const { language } = useLanguage();
  const { data: settings } = useSettings();

  useEffect(() => {
    // Force scroll to top on mount
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // 1. Analytics: Increment hit if not already counted this session
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
      incrementHit()
        .then(() => sessionStorage.setItem('hasVisited', 'true'))
        .catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (settings) {
      const title = language === 'en' ? settings.site_title_en : settings.site_title_ar;
      const description = language === 'en' ? settings.site_description_en : settings.site_description_ar;
      const keywords = language === 'en' ? settings.keywords_en : settings.keywords_ar;

      if (title) document.title = title;
      if (description) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', description);
      }
      if (keywords) {
        let metaKeys = document.querySelector('meta[name="keywords"]');
        if (!metaKeys) {
          metaKeys = document.createElement('meta');
          metaKeys.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeys);
        }
        metaKeys.setAttribute('content', keywords);
      }
    }
  }, [settings, language]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <About />
        <Services />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Home;