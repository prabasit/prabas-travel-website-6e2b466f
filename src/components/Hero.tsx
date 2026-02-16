import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BannerButton {
  text: string;
  link: string;
  style: 'primary' | 'secondary' | 'accent';
}

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  buttons: BannerButton[];
  is_active: boolean;
  display_order: number;
}

const Hero = () => {
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBannerSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const fetchBannerSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('banner_slides')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const processedSlides = data.map(slide => ({
          ...slide,
          buttons: Array.isArray(slide.buttons) ? slide.buttons as unknown as BannerButton[] : []
        }));
        setSlides(processedSlides);
      } else {
        // Fallback slide with multiple buttons
        setSlides([{
          id: 'fallback',
          title: 'Welcome to Flights Nepal',
          subtitle: 'Your Gateway to Nepal\'s Wonders - Discover breathtaking adventures with our comprehensive travel services',
          image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80',
          buttons: [
            { text: 'Explore Services', link: '/services', style: 'primary' },
            { text: 'Our Team', link: '/team', style: 'secondary' }
          ],
          is_active: true,
          display_order: 1
        }]);
      }
    } catch (error) {
      console.error('Error fetching banner slides:', error);
      // Fallback slide on error
      setSlides([{
        id: 'fallback',
        title: 'Welcome to Flights Nepal',
        subtitle: 'Your Gateway to Nepal\'s Wonders',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        buttons: [
          { text: 'Explore Services', link: '/services', style: 'primary' },
          { text: 'Contact Us', link: '/contact', style: 'accent' }
        ],
        is_active: true,
        display_order: 1
      }]);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const getButtonClassName = (style: string) => {
    switch (style) {
      case 'primary':
        return 'bg-primary hover:bg-primary/90 text-primary-foreground';
      case 'secondary':
        return 'bg-secondary hover:bg-secondary/90 text-secondary-foreground';
      case 'accent':
        return 'bg-orange-500 hover:bg-orange-600 text-white';
      default:
        return 'bg-primary hover:bg-primary/90 text-primary-foreground';
    }
  };

  if (loading) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    // The section itself remains full-screen to contain the background image.
    <section className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.28)), url(${currentSlideData.image_url})` 
        }}
      />
      
      {/* UPDATED: The content container now has significant top padding (pt-32)
        to push the content down, out from behind the header.
      */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-primary-foreground bg-clip-text text-transparent">
              {currentSlideData.title}
            </span>
          </h1>
          
          {currentSlideData.subtitle && (
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              {currentSlideData.subtitle}
            </p>
          )}
          
          {currentSlideData.buttons && currentSlideData.buttons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-10 justify-center items-center">
              {currentSlideData.buttons.map((button, index) => (
                <Button 
                  key={index}
                  size="lg" 
                  className={`${getButtonClassName(button.style)} px-16 py-8 text-2xl font-bold`}
                  onClick={() => window.location.href = button.link}
                >
                  {button.text}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows - Only show if multiple slides */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full backdrop-blur-sm transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full backdrop-blur-sm transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Slide Indicators - Only show if multiple slides */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
