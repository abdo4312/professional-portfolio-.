import React, { useState } from 'react';
import SectionWrapper from '../UI/SectionWrapper';
import Button from '../UI/Button';
import { sendContactMessage } from '../../services/api';
import { useAbout } from '../../hooks/usePortfolio';
import { useLanguage } from '../../services/LanguageContext';
import { Mail, Linkedin, Twitter, Github, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
  const { language } = useLanguage();
  const { data: aboutData } = useAbout();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await sendContactMessage(formData);
      setStatus({
        type: 'success',
        message: language === 'en' ? response.message : 'تم إرسال رسالتك بنجاح!'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => setStatus({ type: null, message: '' }), 5000);
    } catch (error) {
      setStatus({
        type: 'error',
        message: language === 'en' ? 'Failed to send message. Please try again.' : 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = aboutData?.social_links ? JSON.parse(aboutData.social_links) : {};

  return (
    <SectionWrapper id="contact" background="white">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
               <Mail size={24} />
             </div>
             <h2 className="text-sm font-bold tracking-widest text-primary-600 uppercase">
              {language === 'en' ? 'Get in Touch' : 'اتصل بي'}
            </h2>
          </div>
          
          <h3 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
            {language === 'en' ? "Let's discuss your next project." : "دعنا نناقش مشروعك القادم."}
          </h3>
          
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            {language === 'en'
              ? "I'm currently available for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!"
              : "أنا متاح حالياً للفرص الجديدة. سواء كان لديك سؤال أو تريد فقط إلقاء التحية، سأبذل قصارى جهدي للرد عليك!"}
          </p>

          <div className="space-y-6 mb-12">
            {aboutData?.email && (
              <a 
                href={`mailto:${aboutData.email}`} 
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50 transition-all group"
              >
                <div className="p-3 bg-white rounded-full text-slate-400 group-hover:text-primary-600 shadow-sm transition-colors">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">{language === 'en' ? 'Email Me' : 'راسلني عبر البريد'}</p>
                  <span className="text-lg font-semibold text-slate-800 group-hover:text-primary-700">{aboutData.email}</span>
                </div>
              </a>
            )}
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
              {language === 'en' ? 'Connect with me' : 'تواصل معي'}
            </h4>
            <div className="flex gap-4">
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all hover:-translate-y-1 shadow-sm">
                  <Linkedin size={20} />
                </a>
              )}
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noreferrer" className="p-3 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all hover:-translate-y-1 shadow-sm">
                  <Github size={20} />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="p-3 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-sky-50 hover:text-sky-500 hover:border-sky-200 transition-all hover:-translate-y-1 shadow-sm">
                  <Twitter size={20} />
                </a>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                {language === 'en' ? 'Name' : 'الاسم'}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                placeholder={language === 'en' ? "John Doe" : "الاسم الكامل"}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                placeholder={language === 'en' ? "john@company.com" : "example@domain.com"}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                {language === 'en' ? 'Message' : 'الرسالة'}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all resize-none"
                placeholder={language === 'en' ? "Tell me about your project..." : "أخبرني عن مشروعك..."}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-600/20 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{language === 'en' ? 'Sending...' : 'جاري الإرسال...'}</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>{language === 'en' ? 'Send Message' : 'إرسال الرسالة'}</span>
                </>
              )}
            </button>

            {status.message && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center text-sm font-bold p-4 rounded-xl ${
                  status.type === 'success' 
                    ? 'text-green-700 bg-green-50 border border-green-100' 
                    : 'text-red-700 bg-red-50 border border-red-100'
                }`}
              >
                {status.message}
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default Contact;