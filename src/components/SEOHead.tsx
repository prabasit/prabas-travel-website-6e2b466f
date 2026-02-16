import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SEOHeadProps {
  pageIdentifier: string;
  overrides?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
  };
}

interface PageSEO {
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_type: string | null;
  og_url: string | null;
  og_site_name: string | null;
  og_locale: string | null;
  twitter_card: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  twitter_site: string | null;
  twitter_creator: string | null;
  canonical_url: string | null;
  robots: string | null;
  structured_data: Record<string, unknown> | null;
  additional_meta: Array<{ name: string; content: string }> | null;
}

interface GlobalSEO {
  site_name: string | null;
  site_tagline: string | null;
  default_og_image: string | null;
  twitter_handle: string | null;
  google_site_verification: string | null;
  bing_site_verification: string | null;
  organization_schema: Record<string, unknown> | null;
  favicon_url: string | null;
  apple_touch_icon: string | null;
}

const SEOHead: React.FC<SEOHeadProps> = ({ pageIdentifier, overrides = {} }) => {
  const baseUrl = 'https://prabastravel.com';

  // Fetch page-specific SEO
  const { data: pageSeo } = useQuery({
    queryKey: ['page-seo', pageIdentifier],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_seo')
        .select('*')
        .eq('page_identifier', pageIdentifier)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) throw error;
      return data as unknown as PageSEO | null;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Fetch global SEO settings
  const { data: globalSeo } = useQuery({
    queryKey: ['global-seo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('global_seo')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as GlobalSEO | null;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Compute final values with fallbacks
  const title = overrides.title || pageSeo?.meta_title || `${globalSeo?.site_name || 'Prabas Travel'}`;
  const description = overrides.description || pageSeo?.meta_description || globalSeo?.site_tagline || '';
  const ogImage = overrides.image || pageSeo?.og_image || globalSeo?.default_og_image || `${baseUrl}/prabas-upload/prabaslogo.png`;
  const currentUrl = overrides.url || pageSeo?.og_url || window.location.href;
  const ogType = overrides.type || pageSeo?.og_type || 'website';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {pageSeo?.meta_keywords && (
        <meta name="keywords" content={pageSeo.meta_keywords} />
      )}
      {pageSeo?.robots && (
        <meta name="robots" content={pageSeo.robots} />
      )}

      {/* Canonical URL */}
      {pageSeo?.canonical_url && (
        <link rel="canonical" href={pageSeo.canonical_url} />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={pageSeo?.og_title || title} />
      <meta property="og:description" content={pageSeo?.og_description || description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={pageSeo?.og_site_name || globalSeo?.site_name || 'Prabas Travel'} />
      <meta property="og:locale" content={pageSeo?.og_locale || 'en_US'} />

      {/* Twitter Card */}
      <meta property="twitter:card" content={pageSeo?.twitter_card || 'summary_large_image'} />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={pageSeo?.twitter_title || pageSeo?.og_title || title} />
      <meta property="twitter:description" content={pageSeo?.twitter_description || pageSeo?.og_description || description} />
      <meta property="twitter:image" content={pageSeo?.twitter_image || ogImage} />
      {(pageSeo?.twitter_site || globalSeo?.twitter_handle) && (
        <meta name="twitter:site" content={pageSeo?.twitter_site || globalSeo?.twitter_handle || ''} />
      )}
      {pageSeo?.twitter_creator && (
        <meta name="twitter:creator" content={pageSeo.twitter_creator} />
      )}

      {/* Google Site Verification */}
      {globalSeo?.google_site_verification && (
        <meta name="google-site-verification" content={globalSeo.google_site_verification} />
      )}

      {/* Bing Site Verification */}
      {globalSeo?.bing_site_verification && (
        <meta name="msvalidate.01" content={globalSeo.bing_site_verification} />
      )}

      {/* Favicon */}
      {globalSeo?.favicon_url && (
        <link rel="icon" type="image/x-icon" href={globalSeo.favicon_url} />
      )}
      {globalSeo?.apple_touch_icon && (
        <link rel="apple-touch-icon" href={globalSeo.apple_touch_icon} />
      )}

      {/* Additional Meta Tags */}
      {pageSeo?.additional_meta && Array.isArray(pageSeo.additional_meta) && pageSeo.additional_meta.map((meta, index) => (
        <meta key={index} name={meta.name} content={meta.content} />
      ))}

      {/* Structured Data (JSON-LD) */}
      {pageSeo?.structured_data && (
        <script type="application/ld+json">
          {JSON.stringify(pageSeo.structured_data)}
        </script>
      )}

      {/* Organization Schema from Global SEO */}
      {globalSeo?.organization_schema && (
        <script type="application/ld+json">
          {JSON.stringify(globalSeo.organization_schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
