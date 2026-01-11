import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, Clock, Shield, MapPin, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FlightFeature {
  title: string;
  description: string;
  icon: string;
}

interface FlightsNepalData {
  id: string;
  title: string;
  description: string;
  features: FlightFeature[];
}

const FlightsNepal = () => {
  const [data, setData] = useState<FlightsNepalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: flightsData, error } = await supabase
        .from('flights_nepal')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single();

      if (error) throw error;
      
      if (flightsData) {
        setData({
          ...flightsData,
          features: Array.isArray(flightsData.features) ? flightsData.features : []
        });
      }
    } catch (error) {
      console.error('Error fetching flights data:', error);
      // Fallback to default data
      setData({
        id: '1',
        title: 'FlightsNepal.com',
        description: 'Nepal\'s Leading Flight Booking Platform - Your gateway to domestic and international destinations with the most advanced ticketing system and competitive prices.',
        features: [
          {
            title: 'Domestic & International Flights',
            description: 'Complete flight booking services for all destinations across Nepal and worldwide',
            icon: 'Plane'
          },
          {
            title: 'Real-time Booking System',
            description: 'Advanced ticketing system with instant confirmation and e-tickets',
            icon: 'Clock'
          },
          {
            title: 'Secure Payment',
            description: 'Safe and secure payment gateway with multiple payment options',
            icon: 'Shield'
          },
          {
            title: 'All Airlines',
            description: 'Partner with all major domestic and international airlines',
            icon: 'MapPin'
          }
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Plane':
        return Plane;
      case 'Clock':
        return Clock;
      case 'Shield':
        return Shield;
      case 'MapPin':
        return MapPin;
      default:
        return Plane;
    }
  };

  const handleVisitWebsite = () => {
    window.open('https://flightsnepal.com', '_blank');
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
          <p className="text-muted-foreground">FlightsNepal data not available.</p>
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
          style={{ backgroundImage: "url('/prabas-upload/flightsphoto.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative container mx-auto px-4 text-center">
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
              Visit FlightsNepal.com
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">Our Flight Services</h2>
            
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
                Book Your Flight Now
              </Button>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default FlightsNepal;