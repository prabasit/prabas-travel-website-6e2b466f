
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BlogSection from '../components/BlogSection';

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24">
        <BlogSection />
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
