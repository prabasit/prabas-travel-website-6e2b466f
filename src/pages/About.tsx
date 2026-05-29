
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';
import SEOHead from '../components/SEOHead';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead pageIdentifier="about" />
      <Header />
      <div className="pt-24">
        <h1 className="sr-only">About Prabas Travel & Tours</h1>
        <AboutSection />
      </div>
      <Footer />
    </div>
  );
};

export default About;
