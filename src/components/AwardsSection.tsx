import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Calendar, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface AwardData {
  id: string;
  title: string;
  organization: string;
  year: number;
  description: string;
  image_url: string;
  category: string;
  is_active: boolean;
}

const AwardsSection = () => {
  const [awards, setAwards] = useState<AwardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const { data, error } = await supabase
        .from('awards')
        .select('*')
        .eq('is_active', true)
        .order('year', { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setAwards(data);
      } else {
        // Fallback awards if CMS is empty
        setAwards([
          {
            id: '1',
            title: 'Best Travel Agency 2023',
            organization: 'Nepal Tourism Board',
            year: 2023,
            description: 'Recognized for excellence in promoting Nepal tourism and providing exceptional travel services.',
            image_url: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1080&h=1080&fit=crop',
            category: 'Tourism Excellence',
            is_active: true
          },
          {
            id: '2',
            title: 'Customer Service Excellence',
            organization: 'Travel Industry Association',
            year: 2023,
            description: 'Awarded for outstanding customer service and client satisfaction in the travel industry.',
            image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1080&h=1080&fit=crop',
            category: 'Service Quality',
            is_active: true
          },
          {
            id: '3',
            title: 'Sustainable Tourism Award',
            organization: 'Eco Tourism Society',
            year: 2022,
            description: 'Recognized for promoting sustainable and responsible tourism practices in Nepal.',
            image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&h=1080&fit=crop',
            category: 'Sustainability',
            is_active: true
          },
          {
            id: '4',
            title: 'Innovation in Travel Tech',
            organization: 'Digital Travel Awards',
            year: 2022,
            description: 'Awarded for innovative use of technology in the travel sector.',
            image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&h=1080&fit=crop',
            category: 'Technology',
            is_active: true
          },
          {
            id: '5',
            title: 'Top Tour Operator',
            organization: 'Asia Travel Awards',
            year: 2021,
            description: 'Named top tour operator for creating unique and authentic travel experiences.',
            image_url: 'https://images.unsplash.com/photo-1534349987384-8ab3a504b281?w=1080&h=1080&fit=crop',
            category: 'Tour Operator',
            is_active: true
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching awards:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="awards" className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Awards & Recognition</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our commitment to excellence has been recognized by industry leaders
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
    <section id="awards" className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Awards & Recognition</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our commitment to excellence has been recognized by industry leaders
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {awards.map((award) => (
              <CarouselItem key={award.id} className="md:basis-1/2 lg:basis-1/4">
                <div className="p-1">
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    <div className="relative overflow-hidden rounded-t-lg aspect-square">
                      <img 
                        src={award.image_url}
                        alt={award.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <Award className="h-8 w-8 text-yellow-400" />
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          {award.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col flex-grow">
                      <CardHeader>
                        <CardTitle className="text-lg">{award.title}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Building className="h-4 w-4" />
                            <span>{award.organization}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{award.year}</span>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="flex-grow">
                        <p className="text-muted-foreground text-sm">{award.description}</p>
                      </CardContent>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default AwardsSection;

