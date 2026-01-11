
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AwardsSection from '../components/AwardsSection';

const Awards = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24">
        <AwardsSection />
      </div>
      <Footer />
    </div>
  );
};

export default Awards;
