import React from 'react';
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';
import { useLanguage } from '../../services/LanguageContext';

const Terms: React.FC = () => {
    const { language } = useLanguage();

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900">
                        {language === 'en' ? 'Terms of Service' : 'شروط الخدمة'}
                    </h1>
                    
                    <div className="prose prose-slate max-w-none dark:prose-invert">
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            {language === 'en' 
                                ? 'By accessing our website, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.' 
                                : 'من خلال الوصول إلى موقعنا، فإنك توافق على الالتزام بشروط الخدمة هذه، وجميع القوانين واللوائح المعمول بها، وتقر بأنك مسؤول عن الامتثال لأي قوانين محلية سارية.'}
                        </p>

                        <h3 className="text-xl font-semibold mb-4 text-slate-800">
                            {language === 'en' ? 'Use License' : 'ترخيص الاستخدام'}
                        </h3>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            {language === 'en'
                                ? 'Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only.'
                                : 'يتم منح إذن لتنزيل نسخة واحدة مؤقتاً من المواد (المعلومات أو البرامج) على موقعنا للمشاهدة الشخصية وغير التجارية العابرة فقط.'}
                        </p>

                        <h3 className="text-xl font-semibold mb-4 text-slate-800">
                            {language === 'en' ? 'Disclaimer' : 'إخلاء المسؤولية'}
                        </h3>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            {language === 'en'
                                ? 'The materials on our website are provided on an "as is" basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.'
                                : 'يتم توفير المواد الموجودة على موقعنا "كما هي". نحن لا نقدم أي ضمانات، صريحة أو ضمنية، ونخلي مسؤوليتنا بموجب هذا وننفي جميع الضمانات الأخرى بما في ذلك، على سبيل المثال لا الحصر، الضمانات الضمنية أو شروط التسويق، والملاءمة لغرض معين، أو عدم انتهاك الملكية الفكرية أو أي انتهاك آخر للحقوق.'}
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Terms;
