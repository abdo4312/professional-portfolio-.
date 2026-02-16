import React from 'react';
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';
import Contact from '../Sections/Contact';

const ContactPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <main className="flex-grow pt-20">
                <Contact />
            </main>
            <Footer />
        </div>
    );
};

export default ContactPage;
