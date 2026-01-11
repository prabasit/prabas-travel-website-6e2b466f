import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Plane, Sun, ShoppingBag, ExternalLink } from 'lucide-react'; // Assuming these icons for holidays
import { supabase } from '@/integrations/supabase/client';

interface HolidayFeature {
  title: string;
  description: string;
  icon: string;
}

interface HolidaysData {
  id: string;
  title: string;
  description: string;
  features: HolidayFeature[];
  // Removed hero_image_url from this interface as it will be hardcoded
}

const Holidays = () => {
  const [data, setData] = useState<HolidaysData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: holidaysData, error } = await supabase
        .from('holidays') // Assuming your Supabase table is named 'holidays'
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single();

      if (error) throw error;
      
      if (holidaysData) {
        setData({
          ...holidaysData,
          features: Array.isArray(holidaysData.features) ? holidaysData.features : []
        });
      }
    } catch (error) {
      console.error('Error fetching holidays data:', error);
      // Fallback to default data if data fetch fails
      setData({
        id: '1',
        title: 'Amazing Holiday Packages',
        description: 'Discover unforgettable travel experiences with our curated holiday packages. From serene beaches to adventurous mountains, find your perfect getaway.',
        features: [
          {
            title: 'Worldwide Destinations',
            description: 'Explore breathtaking locations across the globe with our diverse tour options.',
            icon: 'Globe'
          },
          {
            title: 'Customizable Itineraries',
            description: 'Tailor your trip to your preferences with flexible travel plans.',
            icon: 'Plane'
          },
          {
            title: 'Best Price Guarantee',
            description: 'Get the most competitive prices for your dream vacation.',
            icon: 'ShoppingBag' // Changed from Shield for holiday context
          },
          {
            title: '24/7 Support',
            description: 'Enjoy peace of mind with round-the-clock assistance during your trip.',
            icon: 'Sun' // Changed from MapPin for holiday context
          }
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return Globe;
      case 'Plane':
        return Plane;
      case 'Sun':
        return Sun;
      case 'ShoppingBag':
        return ShoppingBag;
      default:
        return Globe;
    }
  };

  const handleVisitWebsite = () => {
    // Replace with the actual URL for your holidays website if different
    window.open('https://prabasholidays.com', '_blank'); 
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 text-center py-20">
          <p className="text-muted-foreground">Holidays data not available.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24">
        {/* Hero Section */}
        <section 
          className="relative py-32 bg-cover bg-center text-primary-foreground"
          style={{ backgroundImage: "url('/prabas-upload/holidaysphoto.jpg')" }} // <-- Update this path to your actual holidays background image
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative container mx-auto px-4 text-center">
            {/* Removed the img tag for hero_image_url */}
            <h1 className="text-5xl font-bold mb-6">{data.title}</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {data.description}
            </p>
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-white"
              onClick={handleVisitWebsite}
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Explore Holiday Packages
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">Why Choose Our Holidays?</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {data.features.map((feature, index) => {
                const IconComponent = getIcon(feature.icon);
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <IconComponent className="h-12 w-12 mx-auto text-primary mb-4" />
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                onClick={handleVisitWebsite}
                className="bg-primary hover:bg-primary/90"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Plan Your Dream Vacation
              </Button>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Holidays;