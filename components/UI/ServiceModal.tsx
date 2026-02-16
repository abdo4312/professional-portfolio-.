import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Service } from '../../services/api';
import { useLanguage } from '../../services/LanguageContext';
import { 
  Code, Layout, Smartphone, Database, Layers, 
  Search, Zap, Palette, Globe 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface ServiceModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, isOpen, onClose }) => {
  const { language } = useLanguage();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !service) return null;

  const IconComp = iconMap[service.icon || 'Code'] || Code;
  const title = language === 'en' ? service.title_en : service.title_ar;
  const description = language === 'en' ? service.description_en : service.description_ar;

  const renderDescription = () => {
    if (!description) return null;

    if (description.includes(' + ')) {
      const parts = description.split(' + ');
      return (
        <div className="space-y-3 mt-4">
          {parts.map((part, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={idx === 0 ? "" : "flex items-start gap-3"}
            >
              {idx !== 0 && (
                <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary-500" />
              )}
              <p className={`text-slate-600 leading-relaxed ${idx === 0 ? "text-lg font-medium text-slate-800 mb-4" : ""}`}>
                {part.trim()}
              </p>
            </motion.div>
          ))}
        </div>
      );
    }
    return (
      <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
        {description}
      </p>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative Background Blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-50 to-transparent rounded-bl-full -mr-16 -mt-16 opacity-70 pointer-events-none" />

            {/* Header */}
            <div className="relative p-8 pb-0 flex items-start justify-between">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                <IconComp size={32} />
              </div>
              
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                {title}
              </h2>
              
              <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {renderDescription()}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all hover:shadow-lg active:scale-95"
                >
                  {language === 'en' ? 'Close' : 'إغلاق'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ServiceModal;
