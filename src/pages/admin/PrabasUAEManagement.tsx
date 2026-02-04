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
import { Globe, Save, Plus, Trash2 } from 'lucide-react';

interface Service {
  title: string;
  icon: string;
  description: string;
}

interface ContactInfo {
  phone: string;
  whatsapp: string[];
  email: string;
  location: string;
}

interface PrabasUAEData {
  id: string;
  title: string;
  description: string;
  hero_image_url: string;
  services: Service[];
  contact_info: ContactInfo;
  highlights: string[];
}

const PrabasUAEManagement = () => {
  const [data, setData] = useState<PrabasUAEData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: uaeData, error } = await supabase
        .from('prabas_uae')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (uaeData) {
        setData({
          ...uaeData,
          services: uaeData.services || [],
          contact_info: uaeData.contact_info || { phone: '', whatsapp: [], email: '', location: '' },
          highlights: uaeData.highlights || [],
        });
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: `Failed to load data: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('prabas_uae')
        .update({
          title: data.title,
          description: data.description,
          hero_image_url: data.hero_image_url,
          services: data.services,
          contact_info: data.contact_info,
          highlights: data.highlights,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Prabas UAE data updated successfully.",
      });
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast({
        title: "Error",
        description: `Failed to save data: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof PrabasUAEData, value: any) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  const handleContactInfoChange = (field: keyof ContactInfo, value: any) => {
    if (!data) return;
    setData({ 
      ...data, 
      contact_info: { ...data.contact_info, [field]: value }
    });
  };

  const handleServiceChange = (index: number, field: keyof Service, value: string) => {
    if (!data) return;
    const updatedServices = [...data.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setData({ ...data, services: updatedServices });
  };

  const addService = () => {
    if (!data) return;
    const newService: Service = { title: '', icon: 'Globe', description: '' };
    setData({ ...data, services: [...data.services, newService] });
  };

  const removeService = (index: number) => {
    if (!data) return;
    setData({ ...data, services: data.services.filter((_, i) => i !== index) });
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

  if (!data) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No Prabas UAE data found. Please add a record in your Supabase table.</p>
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
              <Globe className="h-7 w-7 md:h-8 md:w-8 mr-2" />
              Prabas UAE Management
            </h1>
            <p className="text-muted-foreground">Manage Prabas Travel UAE content</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={data.title} onChange={(e) => handleInputChange('title', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={data.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} rows={4} />
              </div>
              <div>
                <Label>Hero Image</Label>
                <FileUpload onFileUpload={(url) => handleInputChange('hero_image_url', url)} currentFile={data.hero_image_url} acceptedTypes="image/*" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={data.contact_info.phone} onChange={(e) => handleContactInfoChange('phone', e.target.value)} placeholder="04-2365211" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={data.contact_info.email} onChange={(e) => handleContactInfoChange('email', e.target.value)} placeholder="info@prabastravel.ae" />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp Numbers (comma-separated)</Label>
                <Input 
                  id="whatsapp" 
                  value={data.contact_info.whatsapp?.join(', ') || ''} 
                  onChange={(e) => handleContactInfoChange('whatsapp', e.target.value.split(',').map(n => n.trim()))} 
                  placeholder="050-8804799, 055-3115044" 
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Textarea id="location" value={data.contact_info.location} onChange={(e) => handleContactInfoChange('location', e.target.value)} rows={2} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Services <Button onClick={addService} size="sm"><Plus className="h-4 w-4 mr-2" /> Add</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
              {data.services.map((service, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3 relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeService(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <div>
                    <Label>Title</Label>
                    <Input value={service.title} onChange={(e) => handleServiceChange(index, 'title', e.target.value)} />
                  </div>
                  <div>
                    <Label>Icon Name</Label>
                    <Input value={service.icon} onChange={(e) => handleServiceChange(index, 'icon', e.target.value)} placeholder="e.g., Plane, Building2, Globe" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={service.description} onChange={(e) => handleServiceChange(index, 'description', e.target.value)} rows={2} />
                  </div>
                </div>
              ))}
              {data.services.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No services added.</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Highlights</CardTitle></CardHeader>
            <CardContent>
              <Label>Highlights (one per line)</Label>
              <Textarea 
                value={data.highlights?.join('\n') || ''} 
                onChange={(e) => handleInputChange('highlights', e.target.value.split('\n').filter(h => h.trim()))} 
                rows={8}
                placeholder="Direct flights to Nepal from UAE&#10;Visa assistance and documentation&#10;Corporate travel solutions"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PrabasUAEManagement;
