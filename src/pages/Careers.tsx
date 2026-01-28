import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CareerJobCard from '../components/CareerJobCard';
import CareerApplicationModal from '../components/CareerApplicationModal';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '../components/SEOHead';

interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  job_type: string;
  salary_range: string;
  description: string;
  requirements: string;
  benefits: string;
  application_deadline: string;
  is_active: boolean;
  created_at: string;
}

const Careers = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCareers(data || []);
    } catch (error) {
      console.error('Error fetching careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (career: Career) => {
    setSelectedCareer(career);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCareer(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead pageIdentifier="careers" />
      <Header />
      {/* UPDATED: Corrected padding classes to prevent content from hiding under the header */}
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Be part of Nepal's leading travel company. We're looking for passionate individuals 
              who want to help others discover the beauty of Nepal.
            </p>
          </div>

          {/* Jobs Section */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : careers.length > 0 ? (
            <div className="grid gap-6 md:gap-8">
              {careers.map((career) => (
                <CareerJobCard
                  key={career.id}
                  career={career}
                  onApply={handleApply}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-4">No Open Positions</h3>
              <p className="text-muted-foreground mb-8">
                We currently don't have any open positions, but we're always looking for talented individuals.
              </p>
              <p className="text-sm text-muted-foreground">
                Send your resume to careers@flightsnepal.com and we'll keep you in mind for future opportunities.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <CareerApplicationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        career={selectedCareer}
      />
      
      <Footer />
    </div>
  );
};

export default Careers;
