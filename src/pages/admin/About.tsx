import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save } from 'lucide-react';

// This interface should match the structure of your 'about_us' table.
interface AboutData {
  id?: string;
  title: string;
  description: string;
  story: string;
  mission: string;
  vision: string;
  image_url: string;
}

const About = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    setLoading(true);
    try {
      // This query now fetches the single row, or returns null if it doesn't exist.
      const { data, error } = await supabase.from('about_us').select('*').maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setAboutData(data);
      } else {
        // If no data exists, initialize with a default empty state.
        setAboutData({
          title: 'About Prabas Travel',
          description: '',
          story: '',
          mission: '',
          vision: '',
          image_url: '',
        });
      }
    } catch (error: any) {
      console.error('Error fetching about data:', error);
      toast({
        title: 'Error',
        description: `Failed to load About Us data: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof AboutData, value: string) => {
    if (aboutData) {
      setAboutData((prev) => ({
        ...prev!,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutData) return;

    setSaving(true);

    try {
      const dataToSave = {
        ...aboutData,
        updated_at: new Date().toISOString(),
      };

      // The 'upsert' operation is the key here. It will either update the
      // existing row or insert a new one if it doesn't exist.
      const { data, error } = await supabase
        .from('about_us')
        .upsert(dataToSave, { onConflict: 'id' }) // Assumes 'id' is the primary key.
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setAboutData(data);
      }

      toast({
        title: 'Success',
        description: 'About Us information saved successfully!',
      });
    } catch (error: any) {
      console.error('Error saving about data:', error);
      toast({
        title: 'Error',
        description: `Failed to save information: ${error.message}`,
        variant: 'destructive',
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
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">About Us Management</h1>
          <p className="text-muted-foreground">Manage your about us page content</p>
        </div>

        {aboutData && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={aboutData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="About Prabas Travel"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={aboutData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description about your company"
                    rows={3}
                  />
                </div>

                <FileUpload
                  onFileUpload={(url) => handleInputChange('image_url', url)}
                  currentFile={aboutData.image_url}
                  label="About Us Image"
                  acceptedTypes="image/*"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="story">Our Story</Label>
                  <Textarea
                    id="story"
                    value={aboutData.story}
                    onChange={(e) => handleInputChange('story', e.target.value)}
                    placeholder="Tell your company's story"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="mission">Our Mission</Label>
                  <Textarea
                    id="mission"
                    value={aboutData.mission}
                    onChange={(e) => handleInputChange('mission', e.target.value)}
                    placeholder="Your company's mission statement"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="vision">Our Vision</Label>
                  <Textarea
                    id="vision"
                    value={aboutData.vision}
                    onChange={(e) => handleInputChange('vision', e.target.value)}
                    placeholder="Your company's vision statement"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default About;