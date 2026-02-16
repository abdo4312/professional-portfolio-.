import React, { useEffect, useState } from 'react';
import SectionWrapper from '../UI/SectionWrapper';
import Button from '../UI/Button';
import { sendContactMessage, fetchAbout, AboutData } from '../../services/api';
import { useLanguage } from '../../services/LanguageContext';
import { Mail, Linkedin, Twitter, Github } from 'lucide-react';

const Contact: React.FC = () => {
  const { language } = useLanguage();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  useEffect(() => {
    fetchAbout()
      .then(setAboutData)
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
      setFormData({ name: '', email: '', message: '' });

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
      <div className="grid lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-primary-600 uppercase mb-3">
            {language === 'en' ? 'Get in Touch' : 'اتصل بي'}
          </h2>
          <h3 className="text-3xl font-bold text-slate-900 mb-6">
            {language === 'en' ? "Let's discuss your next project." : "دعنا نناقش مشروعك القادم."}
          </h3>
          <p className="text-slate-600 mb-8 leading-relaxed">
            {language === 'en'
              ? "I'm currently available for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!"
              : "أنا متاح حالياً للفرص الجديدة. سواء كان لديك سؤال أو تريد فقط إلقاء التحية، سأبذل قصارى جهدي للرد عليك!"}
          </p>

          <div className="space-y-4 mb-8">
            {aboutData?.email && (
              <a href={`mailto:${aboutData.email}`} className="flex items-center gap-3 text-slate-700 hover:text-primary-600 transition-colors">
                <div className="p-3 bg-slate-100 rounded-full">
                  <Mail size={20} />
                </div>
                <span className="font-medium">{aboutData.email}</span>
              </a>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-4">
              {language === 'en' ? 'Connect with me' : 'تواصل معي'}
            </h4>
            <div className="flex gap-4">
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 border border-slate-200 rounded-full text-slate-600 hover:bg-slate-100 hover:text-primary-600 transition-all hover:-translate-y-1">
                  <Linkedin size={20} />
                </a>
              )}
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 border border-slate-200 rounded-full text-slate-600 hover:bg-slate-100 hover:text-primary-600 transition-all hover:-translate-y-1">
                  <Github size={20} />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 border border-slate-200 rounded-full text-slate-600 hover:bg-slate-100 hover:text-primary-600 transition-all hover:-translate-y-1">
                  <Twitter size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                {language === 'en' ? 'Name' : 'الاسم'}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md bg-white border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                placeholder={language === 'en' ? "John Doe" : "الاسم الكامل"}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md bg-white border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                placeholder={language === 'en' ? "john@company.com" : "example@domain.com"}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                {language === 'en' ? 'Message' : 'الرسالة'}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md bg-white border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all resize-none"
                placeholder={language === 'en' ? "Tell me about your project..." : "أخبرني عن مشروعك..."}
              ></textarea>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? (language === 'en' ? 'Sending...' : 'جاري الإرسال...')
                : (language === 'en' ? 'Send Message' : 'إرسال الرسالة')}
            </Button>

            {status.message && (
              <div className={`text-center text-sm font-medium p-2 rounded ${status.type === 'success' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                {status.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Contact;