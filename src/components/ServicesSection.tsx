import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Check, XCircle } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon_url: string;
  features: string[] | null;
  is_active: boolean;
}

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: dbError } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        
        if (dbError) throw dbError;

        setServices((data || []) as unknown as Service[]);
      } catch (err: any) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-destructive flex flex-col items-center gap-4">
          <XCircle className="h-12 w-12" />
          <p className="text-lg">{error}</p>
        </div>
      );
    }

    if (services.length === 0) {
      return (
        <div className="text-center text-muted-foreground">
          <p>No services are available at this time. Please check back later.</p>
        </div>
      );
    }

    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map(service => (
          <Card key={service.id} className="hover:shadow-xl transition-shadow flex flex-col overflow-hidden">
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={`${service.icon_url}?t=${new Date().getTime()}`}
                alt={service.title} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
              <p className="text-muted-foreground mb-6 flex-grow">{service.description}</p>
              
              {service.features && service.features.length > 0 && (
                <ul className="space-y-2 text-left text-sm text-muted-foreground mt-auto">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-1 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <section id="services" className="py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
        {renderContent()}
      </div>
    </section>
  );
};

export default ServicesSection;

