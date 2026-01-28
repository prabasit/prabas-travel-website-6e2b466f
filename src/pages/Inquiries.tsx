
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactSection from '../components/ContactSection';
import SEOHead from '../components/SEOHead';

const Inquiries = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead pageIdentifier="inquiries" />
      <Header />
      <div className="pt-24">
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default Inquiries;
