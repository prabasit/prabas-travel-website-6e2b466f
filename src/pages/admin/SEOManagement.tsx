import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, Globe, FileText, Settings, Save, RefreshCw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface PageSEO {
  id: string;
  page_identifier: string;
  page_title: string;
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
  additional_meta: unknown[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface GlobalSEO {
  id: string;
  site_name: string | null;
  site_tagline: string | null;
  default_og_image: string | null;
  twitter_handle: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  google_site_verification: string | null;
  bing_site_verification: string | null;
  google_analytics_id: string | null;
  google_tag_manager_id: string | null;
  facebook_pixel_id: string | null;
  organization_schema: Record<string, unknown> | null;
  favicon_url: string | null;
  apple_touch_icon: string | null;
  updated_at: string;
}

const SEOManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all page SEO entries
  const { data: pageSeoList, isLoading: pagesLoading } = useQuery({
    queryKey: ['admin-page-seo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_seo')
        .select('*')
        .order('page_title', { ascending: true });
      if (error) throw error;
      return data as PageSEO[];
    },
  });

  // Fetch global SEO settings
  const { data: globalSeo, isLoading: globalLoading } = useQuery({
    queryKey: ['admin-global-seo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('global_seo')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as GlobalSEO | null;
    },
  });

  // Get selected page data
  const selectedPageData = pageSeoList?.find(p => p.id === selectedPage);

  // Page SEO form state
  const [pageForm, setPageForm] = useState<Partial<PageSEO>>({});
  const [globalForm, setGlobalForm] = useState<Partial<GlobalSEO>>({});

  // Update page form when selection changes
  React.useEffect(() => {
    if (selectedPageData) {
      setPageForm(selectedPageData);
    }
  }, [selectedPageData]);

  // Update global form when data loads
  React.useEffect(() => {
    if (globalSeo) {
      setGlobalForm(globalSeo);
    }
  }, [globalSeo]);

  // Mutation to update page SEO
  const updatePageSeo = useMutation({
    mutationFn: async (data: Partial<PageSEO>) => {
      const { error } = await supabase
        .from('page_seo')
        .update({
          meta_title: data.meta_title,
          meta_description: data.meta_description,
          meta_keywords: data.meta_keywords,
          og_title: data.og_title,
          og_description: data.og_description,
          og_image: data.og_image,
          og_type: data.og_type,
          og_url: data.og_url,
          og_site_name: data.og_site_name,
          og_locale: data.og_locale,
          twitter_card: data.twitter_card,
          twitter_title: data.twitter_title,
          twitter_description: data.twitter_description,
          twitter_image: data.twitter_image,
          twitter_site: data.twitter_site,
          twitter_creator: data.twitter_creator,
          canonical_url: data.canonical_url,
          robots: data.robots,
          structured_data: data.structured_data,
          additional_meta: data.additional_meta,
        })
        .eq('id', data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-page-seo'] });
      toast({ title: 'Success', description: 'Page SEO settings updated' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Mutation to update global SEO
  const updateGlobalSeo = useMutation({
    mutationFn: async (data: Partial<GlobalSEO>) => {
      const { error } = await supabase
        .from('global_seo')
        .update({
          site_name: data.site_name,
          site_tagline: data.site_tagline,
          default_og_image: data.default_og_image,
          twitter_handle: data.twitter_handle,
          facebook_url: data.facebook_url,
          instagram_url: data.instagram_url,
          linkedin_url: data.linkedin_url,
          youtube_url: data.youtube_url,
          google_site_verification: data.google_site_verification,
          bing_site_verification: data.bing_site_verification,
          google_analytics_id: data.google_analytics_id,
          google_tag_manager_id: data.google_tag_manager_id,
          facebook_pixel_id: data.facebook_pixel_id,
          organization_schema: data.organization_schema,
          favicon_url: data.favicon_url,
          apple_touch_icon: data.apple_touch_icon,
        })
        .eq('id', data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-global-seo'] });
      toast({ title: 'Success', description: 'Global SEO settings updated' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const filteredPages = pageSeoList?.filter(page =>
    page.page_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.page_identifier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageFormChange = (field: keyof PageSEO, value: string | null) => {
    setPageForm(prev => ({ ...prev, [field]: value }));
  };

  const handleGlobalFormChange = (field: keyof GlobalSEO, value: string | null) => {
    setGlobalForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">SEO Management</h1>
            <p className="text-muted-foreground">
              Manage SEO settings for all pages and global site configuration
            </p>
          </div>
        </div>

        <Tabs defaultValue="pages" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Page SEO
            </TabsTrigger>
            <TabsTrigger value="global" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Global Settings
            </TabsTrigger>
          </TabsList>

          {/* Page SEO Tab */}
          <TabsContent value="pages" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              {/* Page Selector */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Select Page</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search pages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    {pagesLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <RefreshCw className="h-6 w-6 animate-spin" />
                      </div>
                    ) : (
                      <div className="space-y-1 p-2">
                        {filteredPages?.map((page) => (
                          <button
                            key={page.id}
                            onClick={() => setSelectedPage(page.id)}
                            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                              selectedPage === page.id
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            }`}
                          >
                            <div className="font-medium">{page.page_title}</div>
                            <div className={`text-xs ${selectedPage === page.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                              /{page.page_identifier}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Page SEO Editor */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {selectedPageData ? `Edit: ${selectedPageData.page_title}` : 'Select a page'}
                  </CardTitle>
                  <CardDescription>
                    Configure SEO meta tags, Open Graph, and Twitter cards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedPageData ? (
                    <ScrollArea className="h-[500px] pr-4">
                      <Accordion type="multiple" defaultValue={['basic', 'og', 'twitter']} className="space-y-4">
                        {/* Basic Meta Tags */}
                        <AccordionItem value="basic" className="border rounded-lg px-4">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                              <Search className="h-4 w-4" />
                              Basic Meta Tags
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label htmlFor="meta_title">Meta Title (60 chars max)</Label>
                              <Input
                                id="meta_title"
                                value={pageForm.meta_title || ''}
                                onChange={(e) => handlePageFormChange('meta_title', e.target.value)}
                                maxLength={60}
                              />
                              <p className="text-xs text-muted-foreground">
                                {(pageForm.meta_title?.length || 0)}/60 characters
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="meta_description">Meta Description (160 chars max)</Label>
                              <Textarea
                                id="meta_description"
                                value={pageForm.meta_description || ''}
                                onChange={(e) => handlePageFormChange('meta_description', e.target.value)}
                                maxLength={160}
                                rows={3}
                              />
                              <p className="text-xs text-muted-foreground">
                                {(pageForm.meta_description?.length || 0)}/160 characters
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="meta_keywords">Keywords (comma separated)</Label>
                              <Input
                                id="meta_keywords"
                                value={pageForm.meta_keywords || ''}
                                onChange={(e) => handlePageFormChange('meta_keywords', e.target.value)}
                                placeholder="travel, nepal, flights, holidays"
                              />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="canonical_url">Canonical URL</Label>
                                <Input
                                  id="canonical_url"
                                  value={pageForm.canonical_url || ''}
                                  onChange={(e) => handlePageFormChange('canonical_url', e.target.value)}
                                  placeholder="https://prabastravel.com/page"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="robots">Robots</Label>
                                <Select
                                  value={pageForm.robots || 'index, follow'}
                                  onValueChange={(value) => handlePageFormChange('robots', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="index, follow">Index, Follow</SelectItem>
                                    <SelectItem value="index, nofollow">Index, No Follow</SelectItem>
                                    <SelectItem value="noindex, follow">No Index, Follow</SelectItem>
                                    <SelectItem value="noindex, nofollow">No Index, No Follow</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Open Graph Tags */}
                        <AccordionItem value="og" className="border rounded-lg px-4">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              Open Graph (Facebook/LinkedIn)
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label htmlFor="og_title">OG Title</Label>
                              <Input
                                id="og_title"
                                value={pageForm.og_title || ''}
                                onChange={(e) => handlePageFormChange('og_title', e.target.value)}
                                placeholder="Leave empty to use meta title"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="og_description">OG Description</Label>
                              <Textarea
                                id="og_description"
                                value={pageForm.og_description || ''}
                                onChange={(e) => handlePageFormChange('og_description', e.target.value)}
                                rows={2}
                                placeholder="Leave empty to use meta description"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="og_image">OG Image URL (1200x630px recommended)</Label>
                              <Input
                                id="og_image"
                                value={pageForm.og_image || ''}
                                onChange={(e) => handlePageFormChange('og_image', e.target.value)}
                                placeholder="https://prabastravel.com/images/og-image.jpg"
                              />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="og_type">OG Type</Label>
                                <Select
                                  value={pageForm.og_type || 'website'}
                                  onValueChange={(value) => handlePageFormChange('og_type', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="website">Website</SelectItem>
                                    <SelectItem value="article">Article</SelectItem>
                                    <SelectItem value="product">Product</SelectItem>
                                    <SelectItem value="profile">Profile</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="og_locale">OG Locale</Label>
                                <Input
                                  id="og_locale"
                                  value={pageForm.og_locale || 'en_US'}
                                  onChange={(e) => handlePageFormChange('og_locale', e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="og_url">OG URL</Label>
                              <Input
                                id="og_url"
                                value={pageForm.og_url || ''}
                                onChange={(e) => handlePageFormChange('og_url', e.target.value)}
                                placeholder="https://prabastravel.com/about"
                              />
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Twitter Card Tags */}
                        <AccordionItem value="twitter" className="border rounded-lg px-4">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                              <Settings className="h-4 w-4" />
                              Twitter Card
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label htmlFor="twitter_card">Card Type</Label>
                              <Select
                                value={pageForm.twitter_card || 'summary_large_image'}
                                onValueChange={(value) => handlePageFormChange('twitter_card', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="summary">Summary</SelectItem>
                                  <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                                  <SelectItem value="app">App</SelectItem>
                                  <SelectItem value="player">Player</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="twitter_title">Twitter Title</Label>
                              <Input
                                id="twitter_title"
                                value={pageForm.twitter_title || ''}
                                onChange={(e) => handlePageFormChange('twitter_title', e.target.value)}
                                placeholder="Leave empty to use OG/meta title"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="twitter_description">Twitter Description</Label>
                              <Textarea
                                id="twitter_description"
                                value={pageForm.twitter_description || ''}
                                onChange={(e) => handlePageFormChange('twitter_description', e.target.value)}
                                rows={2}
                                placeholder="Leave empty to use OG/meta description"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="twitter_image">Twitter Image URL</Label>
                              <Input
                                id="twitter_image"
                                value={pageForm.twitter_image || ''}
                                onChange={(e) => handlePageFormChange('twitter_image', e.target.value)}
                                placeholder="Leave empty to use OG image"
                              />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="twitter_site">Twitter Site (@handle)</Label>
                                <Input
                                  id="twitter_site"
                                  value={pageForm.twitter_site || ''}
                                  onChange={(e) => handlePageFormChange('twitter_site', e.target.value)}
                                  placeholder="@prabastravel"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="twitter_creator">Twitter Creator (@handle)</Label>
                                <Input
                                  id="twitter_creator"
                                  value={pageForm.twitter_creator || ''}
                                  onChange={(e) => handlePageFormChange('twitter_creator', e.target.value)}
                                  placeholder="@author"
                                />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="mt-6 flex justify-end">
                        <Button
                          onClick={() => updatePageSeo.mutate(pageForm)}
                          disabled={updatePageSeo.isPending}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          {updatePageSeo.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex h-[400px] items-center justify-center text-muted-foreground">
                      Select a page from the list to edit its SEO settings
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Global SEO Tab */}
          <TabsContent value="global" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Global SEO Settings</CardTitle>
                <CardDescription>
                  Site-wide settings, social profiles, and analytics configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                {globalLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Site Identity */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Site Identity</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="site_name">Site Name</Label>
                          <Input
                            id="site_name"
                            value={globalForm.site_name || ''}
                            onChange={(e) => handleGlobalFormChange('site_name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="site_tagline">Site Tagline</Label>
                          <Input
                            id="site_tagline"
                            value={globalForm.site_tagline || ''}
                            onChange={(e) => handleGlobalFormChange('site_tagline', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="favicon_url">Favicon URL</Label>
                          <Input
                            id="favicon_url"
                            value={globalForm.favicon_url || ''}
                            onChange={(e) => handleGlobalFormChange('favicon_url', e.target.value)}
                            placeholder="https://prabastravel.com/favicon.ico"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="default_og_image">Default OG Image</Label>
                          <Input
                            id="default_og_image"
                            value={globalForm.default_og_image || ''}
                            onChange={(e) => handleGlobalFormChange('default_og_image', e.target.value)}
                            placeholder="Fallback image for social sharing"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Social Profiles */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Social Profiles</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="twitter_handle">Twitter Handle</Label>
                          <Input
                            id="twitter_handle"
                            value={globalForm.twitter_handle || ''}
                            onChange={(e) => handleGlobalFormChange('twitter_handle', e.target.value)}
                            placeholder="@prabastravel"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="facebook_url">Facebook URL</Label>
                          <Input
                            id="facebook_url"
                            value={globalForm.facebook_url || ''}
                            onChange={(e) => handleGlobalFormChange('facebook_url', e.target.value)}
                            placeholder="https://facebook.com/prabastravel"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="instagram_url">Instagram URL</Label>
                          <Input
                            id="instagram_url"
                            value={globalForm.instagram_url || ''}
                            onChange={(e) => handleGlobalFormChange('instagram_url', e.target.value)}
                            placeholder="https://instagram.com/prabastravel"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                          <Input
                            id="linkedin_url"
                            value={globalForm.linkedin_url || ''}
                            onChange={(e) => handleGlobalFormChange('linkedin_url', e.target.value)}
                            placeholder="https://linkedin.com/company/prabastravel"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="youtube_url">YouTube URL</Label>
                          <Input
                            id="youtube_url"
                            value={globalForm.youtube_url || ''}
                            onChange={(e) => handleGlobalFormChange('youtube_url', e.target.value)}
                            placeholder="https://youtube.com/@prabastravel"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Verification & Analytics */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Verification & Analytics</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="google_site_verification">Google Site Verification</Label>
                          <Input
                            id="google_site_verification"
                            value={globalForm.google_site_verification || ''}
                            onChange={(e) => handleGlobalFormChange('google_site_verification', e.target.value)}
                            placeholder="Verification code from Google Search Console"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bing_site_verification">Bing Site Verification</Label>
                          <Input
                            id="bing_site_verification"
                            value={globalForm.bing_site_verification || ''}
                            onChange={(e) => handleGlobalFormChange('bing_site_verification', e.target.value)}
                            placeholder="Verification code from Bing Webmaster"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                          <Input
                            id="google_analytics_id"
                            value={globalForm.google_analytics_id || ''}
                            onChange={(e) => handleGlobalFormChange('google_analytics_id', e.target.value)}
                            placeholder="G-XXXXXXXXXX"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="google_tag_manager_id">Google Tag Manager ID</Label>
                          <Input
                            id="google_tag_manager_id"
                            value={globalForm.google_tag_manager_id || ''}
                            onChange={(e) => handleGlobalFormChange('google_tag_manager_id', e.target.value)}
                            placeholder="GTM-XXXXXXX"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="facebook_pixel_id">Facebook Pixel ID</Label>
                          <Input
                            id="facebook_pixel_id"
                            value={globalForm.facebook_pixel_id || ''}
                            onChange={(e) => handleGlobalFormChange('facebook_pixel_id', e.target.value)}
                            placeholder="Facebook Pixel tracking ID"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={() => updateGlobalSeo.mutate(globalForm)}
                        disabled={updateGlobalSeo.isPending}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {updateGlobalSeo.isPending ? 'Saving...' : 'Save Global Settings'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SEOManagement;
