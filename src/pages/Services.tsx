
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
        <h1 className="sr-only">Our Travel Services</h1>
        <ServicesSection />
      </div>
      <Footer />
    </div>
  );
};

export default Services;
