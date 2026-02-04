import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HomepageAd {
  id: string;
  title: string;
  media_url: string;
  media_type: string;
  link_url: string | null;
  is_active: boolean;
  display_order: number;
}

const HomepageAds = () => {
  const [ads, setAds] = useState<HomepageAd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
    
    const channel = supabase
      .channel('homepage-ads-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'homepage_ads'
        },
        () => {
          fetchAds();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_ads')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching ads:', error);
        return;
      }

      setAds(data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-6 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-24">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (ads.length === 0) {
    return null;
  }

  const renderMedia = (ad: HomepageAd) => {
    const mediaContent = () => {
      if (ad.media_type === 'video') {
        return (
          <video
            src={ad.media_url}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto max-h-[120px] object-contain"
          />
        );
      }
      
      return (
        <img
          src={ad.media_url}
          alt={ad.title}
          className="w-full h-auto max-h-[120px] object-contain"
        />
      );
    };

    if (ad.link_url) {
      return (
        <a 
          href={ad.link_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block hover:opacity-90 transition-opacity"
        >
          {mediaContent()}
        </a>
      );
    }

    return mediaContent();
  };

  return (
    <section className="py-4 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4">
          {ads.map((ad) => (
            <div 
              key={ad.id} 
              className="w-full max-w-4xl rounded-lg overflow-hidden shadow-sm border border-border"
            >
              {renderMedia(ad)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomepageAds;
