
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const TestimonialsCarousel = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

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
        // Fallback testimonials
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

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">What Our Clients Say</h2>
          </div>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from our satisfied customers about their amazing experiences with us
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="max-w-2xl mx-auto">
                    <CardContent className="p-6 md:p-8 text-center">
                      <Quote className="h-8 w-8 text-primary/30 mx-auto mb-4" />
                      
                      <p className="text-lg md:text-xl text-muted-foreground mb-6 italic leading-relaxed">
                        "{testimonial.testimonial_text}"
                      </p>
                      
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <img
                          src={testimonial.client_image_url}
                          alt={testimonial.client_name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="text-left">
                          <h4 className="font-semibold text-lg">{testimonial.client_name}</h4>
                          <p className="text-sm text-muted-foreground">{testimonial.client_location}</p>
                          <div className="flex items-center mt-1">
                            {renderStars(testimonial.rating)}
                          </div>
                        </div>
                      </div>
                      
                      <Badge variant="secondary" className="text-xs">
                        {testimonial.trip_type}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {testimonials.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-background/80 backdrop-blur-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-background/80 backdrop-blur-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Indicators */}
          {testimonials.length > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
