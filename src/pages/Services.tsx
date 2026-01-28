
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ServicesSection from '../components/ServicesSection';
import SEOHead from '../components/SEOHead';

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead pageIdentifier="services" />
      <Header />
      <div className="pt-24">
        <ServicesSection />
      </div>
      <Footer />
    </div>
  );
};

export default Services;
