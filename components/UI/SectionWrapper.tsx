import React from 'react';
import { motion } from 'framer-motion';

interface SectionWrapperProps {
  id: string;
  className?: string;
  children: React.ReactNode;
  background?: 'white' | 'gray';
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ id, className = '', children, background = 'white' }) => {
  const bgClass = background === 'white' ? 'bg-white' : 'bg-slate-50';
  
  return (
    <section id={id} className={`py-20 md:py-28 ${bgClass} ${className}`}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default SectionWrapper;