import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AboutData {
  id: string;
  title: string;
  description: string | null;
  story: string | null;
  mission: string | null;
  vision: string | null;
  image_url: string | null;
}

const AboutSection = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
    
    // Set up real-time subscription for updates
    const channel = supabase
      .channel('about-us-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'about_us'
        },
        () => {
          fetchAboutData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAboutData = async () => {
    try {
      const { data, error } = await supabase
        .from('about_us')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching about data:', error);
        return;
      }

      if (data) {
        setAboutData(data);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!aboutData) {
    return (
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">About Prabas Travel</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Your trusted partner for unforgettable travel experiences across Nepal and beyond.
            </p>
            <p className="text-muted-foreground">
              Please add content through the admin panel to display your company information here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{aboutData.title}</h2>
          {aboutData.description && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {aboutData.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            {aboutData.story && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Our Story</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {aboutData.story}
                </p>
              </div>
            )}

            {aboutData.mission && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {aboutData.mission}
                </p>
              </div>
            )}

            {aboutData.vision && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {aboutData.vision}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center">
            {aboutData.image_url ? (
              <img
                src={aboutData.image_url}
                alt="About Prabas Travel"
                className="rounded-lg shadow-lg max-w-full h-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">About Image</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload an image through the admin panel
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;