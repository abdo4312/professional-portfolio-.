import React, { useState } from 'react';
import SectionWrapper from '../UI/SectionWrapper';
import { Service } from '../../services/api';
import { useServices } from '../../hooks/usePortfolio';
import { useLanguage } from '../../services/LanguageContext';
import { 
  Code, Layout, Smartphone, Database, Layers, 
  Search, Zap, Palette, Globe, ArrowRight 
} from 'lucide-react';
import { motion } from 'framer-motion';
import ServiceModal from '../UI/ServiceModal';

const iconMap: { [key: string]: React.ElementType } = {
  'Code': Code,
  'Layout': Layout,
  'Smartphone': Smartphone,
  'Database': Database,
  'Layers': Layers,
  'Search': Search,
  'Zap': Zap,
  'Palette': Palette,
  'Globe': Globe,
};

const ServiceCard: React.FC<{ service: Service; onOpen: (s: Service) => void }> = ({ service, onOpen }) => {
  const { language } = useLanguage();
  const IconComp = iconMap[service.icon || 'Code'] || Code;
  const title = language === 'en' ? service.title_en : service.title_ar;
  const description = language === 'en' ? service.description_en : service.description_ar;

  return (
    <div 
      className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col cursor-pointer"
      onClick={() => onOpen(service)}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-50 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500" />
      
      <div className="mb-6 relative z-10">
        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
          <IconComp size={28} />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors relative z-10">
        {title}
      </h3>
      
      <div className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow relative z-10 line-clamp-4 whitespace-pre-line">
        {description?.replace(/ \+ /g, '\n')}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-50 relative z-10">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onOpen(service);
          }}
          className="inline-flex items-center text-sm font-semibold text-primary-600 group-hover:translate-x-1 transition-transform cursor-pointer bg-transparent border-none p-0"
        >
          {language === 'en' ? 'Learn more' : 'اقرأ المزيد'}
          <ArrowRight size={16} className={language === 'en' ? "ml-1" : "mr-1 rotate-180"} />
        </button>
      </div>
    </div>
  );
};

const Services: React.FC = () => {
  const { language } = useLanguage();
  const { data: services = [], isLoading: loading } = useServices();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading || services.length === 0) return null;

  return (
    <SectionWrapper id="services" background="white">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-sm font-bold tracking-widest text-primary-600 uppercase mb-3">
          {language === 'en' ? 'What I Do' : 'ماذا أقدم'}
        </h2>
        <h3 className="text-3xl font-bold text-slate-900">
          {language === 'en' ? 'Services & Offerings' : 'الخدمات والعروض'}
        </h3>
        <p className="mt-4 text-slate-600">
          {language === 'en'
            ? 'Providing high-quality professional services tailored to your business needs.'
            : 'تقديم خدمات احترافية عالية الجودة مصممة خصيصاً لاحتياجات عملك.'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ServiceCard service={service} onOpen={handleOpenModal} />
          </motion.div>
        ))}
      </div>

      <ServiceModal 
        service={selectedService} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </SectionWrapper>
  );
};

export default Services;
