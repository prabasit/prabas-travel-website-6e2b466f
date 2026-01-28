
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TestimonialsSection from '../components/TestimonialsSection';
import SEOHead from '../components/SEOHead';

const Testimonials = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead pageIdentifier="testimonials" />
      <Header />
      <div className="pt-24">
        <TestimonialsSection />
      </div>
      <Footer />
    </div>
  );
};

export default Testimonials;
