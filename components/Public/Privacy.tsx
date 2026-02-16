import React from 'react';
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';
import { useLanguage } from '../../services/LanguageContext';

const Privacy: React.FC = () => {
    const { language } = useLanguage();

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900">
                        {language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}
                    </h1>
                    
                    <div className="prose prose-slate max-w-none dark:prose-invert">
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            {language === 'en' 
                                ? 'Your privacy is important to us. It is our policy to respect your privacy regarding any information we may collect from you across our website.' 
                                : 'خصوصيتك مهمة بالنسبة لنا. سياستنا هي احترام خصوصيتك فيما يتعلق بأي معلومات قد نجمعها منك عبر موقعنا الإلكتروني.'}
                        </p>

                        <h3 className="text-xl font-semibold mb-4 text-slate-800">
                            {language === 'en' ? 'Information We Collect' : 'المعلومات التي نجمعها'}
                        </h3>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            {language === 'en'
                                ? 'We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.'
                                : 'نحن نطلب المعلومات الشخصية فقط عندما نحتاج إليها حقاً لتقديم خدمة لك. نجمعها بطرق عادلة وقانونية، بمعرفتك وموافقتك.'}
                        </p>

                        <h3 className="text-xl font-semibold mb-4 text-slate-800">
                            {language === 'en' ? 'How We Use Information' : 'كيف نستخدم المعلومات'}
                        </h3>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            {language === 'en'
                                ? 'We may use the information we collect to operate, maintain, and improve our website and services, and to respond to your comments and questions.'
                                : 'قد نستخدم المعلومات التي نجمعها لتشغيل وصيانة وتحسين موقعنا وخدماتنا، والرد على تعليقاتك وأسئلتك.'}
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Privacy;
