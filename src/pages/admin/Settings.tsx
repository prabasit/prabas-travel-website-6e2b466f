
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, Globe, Mail, Phone, MapPin } from 'lucide-react';

interface Setting {
  key: string;
  value: any;
  description?: string;
  category: string;
}

const Settings = () => {
  const [settings, setSettings] = useState<Record<string, any>>({
    site_title: 'Prabas Travel',
    site_description: 'Your trusted travel partner in Nepal',
    contact_email: 'info@prabastravel.com',
    contact_phone: '+977-1-4567890',
    contact_address: 'Kathmandu, Nepal',
    social_facebook: '',
    social_instagram: '',
    social_twitter: '',
    business_hours: 'Mon - Fri: 9:00 AM - 6:00 PM',
    emergency_contact: '+977-9801234567'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*');

      if (error) throw error;

      const settingsMap = data?.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, any>) || {};

      setSettings(prev => ({ ...prev, ...settingsMap }));
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const settingsToUpdate = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        category: getCategoryForKey(key),
        description: getDescriptionForKey(key)
      }));

      for (const setting of settingsToUpdate) {
        const { error } = await supabase
          .from('settings')
          .upsert(setting, { onConflict: 'key' });

        if (error) throw error;
      }

      toast({
        title: "Settings Saved",
        description: "All settings have been updated successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getCategoryForKey = (key: string) => {
    if (key.startsWith('social_')) return 'social';
    if (key.startsWith('contact_')) return 'contact';
    if (key.startsWith('site_')) return 'general';
    return 'other';
  };

  const getDescriptionForKey = (key: string) => {
    const descriptions: Record<string, string> = {
      site_title: 'Main website title',
      site_description: 'Website description for SEO',
      contact_email: 'Primary contact email',
      contact_phone: 'Primary contact phone number',
      contact_address: 'Business address',
      social_facebook: 'Facebook page URL',
      social_instagram: 'Instagram profile URL',
      social_twitter: 'Twitter profile URL',
      business_hours: 'Operating hours',
      emergency_contact: '24/7 emergency contact number'
    };
    return descriptions[key] || '';
  };

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage website settings and configuration</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save All Settings'}
          </Button>
        </div>

        <div className="grid gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="site_title">Site Title</Label>
                <Input
                  id="site_title"
                  value={settings.site_title || ''}
                  onChange={(e) => handleInputChange('site_title', e.target.value)}
                  placeholder="Your website title"
                />
              </div>
              <div>
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description || ''}
                  onChange={(e) => handleInputChange('site_description', e.target.value)}
                  placeholder="Brief description of your website"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email || ''}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    placeholder="contact@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={settings.contact_phone || ''}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    placeholder="+977-1-4567890"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="contact_address">Business Address</Label>
                <Input
                  id="contact_address"
                  value={settings.contact_address || ''}
                  onChange={(e) => handleInputChange('contact_address', e.target.value)}
                  placeholder="Your business address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business_hours">Business Hours</Label>
                  <Input
                    id="business_hours"
                    value={settings.business_hours || ''}
                    onChange={(e) => handleInputChange('business_hours', e.target.value)}
                    placeholder="Mon - Fri: 9:00 AM - 6:00 PM"
                  />
                </div>
                <div>
                  <Label htmlFor="emergency_contact">Emergency Contact</Label>
                  <Input
                    id="emergency_contact"
                    value={settings.emergency_contact || ''}
                    onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                    placeholder="24/7 emergency number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="social_facebook">Facebook URL</Label>
                <Input
                  id="social_facebook"
                  value={settings.social_facebook || ''}
                  onChange={(e) => handleInputChange('social_facebook', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <Label htmlFor="social_instagram">Instagram URL</Label>
                <Input
                  id="social_instagram"
                  value={settings.social_instagram || ''}
                  onChange={(e) => handleInputChange('social_instagram', e.target.value)}
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>
              <div>
                <Label htmlFor="social_twitter">Twitter URL</Label>
                <Input
                  id="social_twitter"
                  value={settings.social_twitter || ''}
                  onChange={(e) => handleInputChange('social_twitter', e.target.value)}
                  placeholder="https://twitter.com/yourprofile"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
