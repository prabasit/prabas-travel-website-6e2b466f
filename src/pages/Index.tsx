import React from 'react';
import Header from '../components/Header';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import AwardsSection from '../components/AwardsSection';
import ContactSection from '../components/ContactSection';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import PrabasHero from '../components/home/PrabasHero';
import WhoWeAre from '../components/home/WhoWeAre';
import BrandFamily from '../components/home/BrandFamily';
import WhatWeOffer from '../components/home/WhatWeOffer';
import AirlinePartners from '../components/home/AirlinePartners';
import GlobalBranches from '../components/home/GlobalBranches';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead pageIdentifier="home" />
      <Header />
      <main>
        <PrabasHero />

        <section id="about" className="scroll-mt-16">
          <WhoWeAre />
        </section>

        <section id="brands" className="scroll-mt-16">
          <BrandFamily />
        </section>

        <section id="services" className="scroll-mt-16">
          <WhatWeOffer />
        </section>

        <AirlinePartners />

        <section id="branches" className="scroll-mt-16">
          <GlobalBranches />
        </section>

        <section id="testimonials" className="scroll-mt-16">
          <TestimonialsCarousel />
        </section>

        <section id="awards" className="scroll-mt-16">
          <AwardsSection />
        </section>

        <section id="contact" className="scroll-mt-16">
          <ContactSection />
        </section>

        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
