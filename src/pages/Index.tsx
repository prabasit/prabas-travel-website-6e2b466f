
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import AwardsSection from '../components/AwardsSection';
import ContactSection from '../components/ContactSection';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* About Us Section */}
        <section id="about" className="scroll-mt-16">
          <AboutSection />
        </section>
        
        {/* Services Section */}
        <section id="services" className="scroll-mt-16">
          <ServicesSection />
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="scroll-mt-16">
          <TestimonialsCarousel />
        </section>

        {/* Awards & Recognition Section */}
        <section id="awards" className="scroll-mt-16">
          <AwardsSection />
        </section>
        
        {/* Contact Section */}
        <section id="contact" className="scroll-mt-16">
          <ContactSection />
        </section>
        
        {/* Newsletter Section */}
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
