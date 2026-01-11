
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Testimonial {
  id: string;
  client_name: string;
  client_location: string;
  client_image_url: string;
  testimonial_text: string;
  trip_type: string;
  rating: number;
  is_featured: boolean;
  is_active: boolean;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setTestimonials(data);
      } else {
        // Fallback testimonials if CMS is empty
        setTestimonials([
          {
            id: '1',
            client_name: 'John Smith',
            client_location: 'New York, USA',
            client_image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
            testimonial_text: 'Amazing experience! The team at Flights Nepal made our Everest Base Camp trek unforgettable. Professional service and great hospitality.',
            trip_type: 'Everest Base Camp Trek',
            rating: 5,
            is_featured: true,
            is_active: true
          },
          {
            id: '2',
            client_name: 'Sarah Johnson',
            client_location: 'London, UK',
            client_image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b412?w=100&h=100&fit=crop',
            testimonial_text: 'Perfect cultural tour of Kathmandu! Our guide was knowledgeable and friendly. Highly recommend for anyone visiting Nepal.',
            trip_type: 'Cultural Tour',
            rating: 5,
            is_featured: true,
            is_active: true
          },
          {
            id: '3',
            client_name: 'David Brown',
            client_location: 'Sydney, Australia',
            client_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            testimonial_text: 'The Annapurna Circuit was breathtaking! Excellent organization and support throughout the journey.',
            trip_type: 'Annapurna Circuit',
            rating: 5,
            is_featured: false,
            is_active: true
          },
          {
            id: '4',
            client_name: 'Maria Garcia',
            client_location: 'Madrid, Spain',
            client_image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
            testimonial_text: 'Fantastic adventure sports experience! The paragliding in Pokhara was incredible with top-notch safety measures.',
            trip_type: 'Adventure Sports',
            rating: 4,
            is_featured: false,
            is_active: true
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <section id="testimonials" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Read testimonials from our satisfied customers
            </p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Clients Say</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Read testimonials from our satisfied customers who have experienced Nepal with us
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={testimonial.client_image_url}
                    alt={testimonial.client_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{testimonial.client_name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.client_location}</p>
                    <div className="flex items-center mt-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                  <Quote className="h-6 w-6 text-primary/30" />
                </div>
                
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.testimonial_text}"
                </p>
                
                <Badge variant="secondary" className="text-xs">
                  {testimonial.trip_type}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
