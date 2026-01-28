
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BlogSection from '../components/BlogSection';
import SEOHead from '../components/SEOHead';

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead pageIdentifier="blog" />
      <Header />
      <div className="pt-24">
        <BlogSection />
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
