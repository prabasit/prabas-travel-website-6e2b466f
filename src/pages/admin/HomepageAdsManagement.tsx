import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Image, Save, Plus, Trash2, ExternalLink } from 'lucide-react';

interface HomepageAd {
  id: string;
  title: string;
  media_url: string;
  media_type: string;
  link_url: string | null;
  is_active: boolean;
  display_order: number;
}

const HomepageAdsManagement = () => {
  const [ads, setAds] = useState<HomepageAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_ads')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setAds(data || []);
    } catch (error: any) {
      console.error('Error fetching ads:', error);
      toast({
        title: "Error",
        description: `Failed to load ads: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAd = () => {
    const newAd: HomepageAd = {
      id: `temp-${Date.now()}`,
      title: 'New Ad',
      media_url: '',
      media_type: 'image',
      link_url: null,
      is_active: true,
      display_order: ads.length,
    };
    setAds([...ads, newAd]);
  };

  const handleUpdateAd = (index: number, field: keyof HomepageAd, value: any) => {
    const updatedAds = [...ads];
    updatedAds[index] = { ...updatedAds[index], [field]: value };
    setAds(updatedAds);
  };

  const handleDeleteAd = async (index: number) => {
    const ad = ads[index];
    
    if (!ad.id.startsWith('temp-')) {
      try {
        const { error } = await supabase
          .from('homepage_ads')
          .delete()
          .eq('id', ad.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Ad deleted successfully.",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to delete ad: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
    }
    
    setAds(ads.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const ad of ads) {
        if (!ad.media_url) {
          toast({
            title: "Error",
            description: "Please upload media for all ads before saving.",
            variant: "destructive",
          });
          setSaving(false);
          return;
        }

        const adData = {
          title: ad.title,
          media_url: ad.media_url,
          media_type: ad.media_type,
          link_url: ad.link_url || null,
          is_active: ad.is_active,
          display_order: ad.display_order,
          updated_at: new Date().toISOString(),
        };

        if (ad.id.startsWith('temp-')) {
          const { error } = await supabase
            .from('homepage_ads')
            .insert(adData);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('homepage_ads')
            .update(adData)
            .eq('id', ad.id);
          if (error) throw error;
        }
      }

      toast({
        title: "Success",
        description: "All ads saved successfully.",
      });
      
      fetchAds();
    } catch (error: any) {
      console.error('Error saving ads:', error);
      toast({
        title: "Error",
        description: `Failed to save ads: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              <Image className="h-7 w-7 md:h-8 md:w-8 mr-2" />
              Homepage Ads Management
            </h1>
            <p className="text-muted-foreground">Manage advertisement banners on the homepage</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddAd} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Ad
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save All'}
            </Button>
          </div>
        </div>

        {ads.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No ads configured yet.</p>
              <Button onClick={handleAddAd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Ad
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {ads.map((ad, index) => (
              <Card key={ad.id}>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm">
                        #{index + 1}
                      </span>
                      {ad.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAd(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`title-${index}`}>Title</Label>
                        <Input
                          id={`title-${index}`}
                          value={ad.title}
                          onChange={(e) => handleUpdateAd(index, 'title', e.target.value)}
                          placeholder="Ad title"
                        />
                      </div>
                      
                      <div>
                        <Label>Media Type</Label>
                        <Select
                          value={ad.media_type}
                          onValueChange={(value) => handleUpdateAd(index, 'media_type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="gif">GIF</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor={`link-${index}`}>Link URL (optional)</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`link-${index}`}
                            value={ad.link_url || ''}
                            onChange={(e) => handleUpdateAd(index, 'link_url', e.target.value)}
                            placeholder="https://example.com"
                          />
                          {ad.link_url && (
                            <Button variant="outline" size="icon" asChild>
                              <a href={ad.link_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Switch
                          checked={ad.is_active}
                          onCheckedChange={(checked) => handleUpdateAd(index, 'is_active', checked)}
                        />
                        <Label>Active</Label>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Media Upload</Label>
                      <FileUpload
                        onFileUpload={(url) => handleUpdateAd(index, 'media_url', url)}
                        currentFile={ad.media_url}
                        acceptedTypes={ad.media_type === 'video' ? 'video/*' : 'image/*'}
                      />
                      {ad.media_url && (
                        <div className="mt-2 border rounded-lg overflow-hidden max-h-[120px]">
                          {ad.media_type === 'video' ? (
                            <video
                              src={ad.media_url}
                              controls
                              className="w-full h-auto max-h-[120px] object-contain"
                            />
                          ) : (
                            <img
                              src={ad.media_url}
                              alt={ad.title}
                              className="w-full h-auto max-h-[120px] object-contain"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default HomepageAdsManagement;
