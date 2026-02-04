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
  features: string[];
}

interface Offer {
  title: string;
  description: string;
  duration: string;
  price: string;
  originalPrice: string;
  savings: string;
}

interface WhyChooseUs {
  title: string;
  description: string;
}

interface PrabasAustraliaData {
  id: string;
  title: string;
  description: string;
  hero_image_url: string;
  services: Service[];
  offers: Offer[];
  why_choose_us: WhyChooseUs[];
}

const PrabasAustraliaManagement = () => {
  const [data, setData] = useState<PrabasAustraliaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: australiaData, error } = await supabase
        .from('prabas_australia')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (australiaData) {
        setData({
          ...australiaData,
          services: australiaData.services || [],
          offers: australiaData.offers || [],
          why_choose_us: australiaData.why_choose_us || [],
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
        .from('prabas_australia')
        .update({
          title: data.title,
          description: data.description,
          hero_image_url: data.hero_image_url,
          services: data.services,
          offers: data.offers,
          why_choose_us: data.why_choose_us,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Prabas Australia data updated successfully.",
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

  const handleInputChange = (field: keyof PrabasAustraliaData, value: any) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  const handleServiceChange = (index: number, field: keyof Service, value: any) => {
    if (!data) return;
    const updatedServices = [...data.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setData({ ...data, services: updatedServices });
  };

  const addService = () => {
    if (!data) return;
    const newService: Service = { title: '', icon: 'Globe', features: [] };
    setData({ ...data, services: [...data.services, newService] });
  };

  const removeService = (index: number) => {
    if (!data) return;
    setData({ ...data, services: data.services.filter((_, i) => i !== index) });
  };

  const handleOfferChange = (index: number, field: keyof Offer, value: string) => {
    if (!data) return;
    const updatedOffers = [...data.offers];
    updatedOffers[index] = { ...updatedOffers[index], [field]: value };
    setData({ ...data, offers: updatedOffers });
  };

  const addOffer = () => {
    if (!data) return;
    const newOffer: Offer = { title: '', description: '', duration: '', price: '', originalPrice: '', savings: '' };
    setData({ ...data, offers: [...data.offers, newOffer] });
  };

  const removeOffer = (index: number) => {
    if (!data) return;
    setData({ ...data, offers: data.offers.filter((_, i) => i !== index) });
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
          <p className="text-muted-foreground">No Prabas Australia data found. Please add a record in your Supabase table.</p>
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
              Prabas Australia Management
            </h1>
            <p className="text-muted-foreground">Manage Prabas Travel Australia content</p>
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
                    <Input value={service.icon} onChange={(e) => handleServiceChange(index, 'icon', e.target.value)} placeholder="e.g., Plane, Map, Ship" />
                  </div>
                  <div>
                    <Label>Features (comma-separated)</Label>
                    <Textarea 
                      value={service.features?.join(', ') || ''} 
                      onChange={(e) => handleServiceChange(index, 'features', e.target.value.split(',').map(f => f.trim()))} 
                      rows={2} 
                    />
                  </div>
                </div>
              ))}
              {data.services.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No services added.</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Featured Offers <Button onClick={addOffer} size="sm"><Plus className="h-4 w-4 mr-2" /> Add</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.offers.map((offer, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3 relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeOffer(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <div>
                    <Label>Title</Label>
                    <Input value={offer.title} onChange={(e) => handleOfferChange(index, 'title', e.target.value)} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={offer.description} onChange={(e) => handleOfferChange(index, 'description', e.target.value)} rows={2} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Duration</Label>
                      <Input value={offer.duration} onChange={(e) => handleOfferChange(index, 'duration', e.target.value)} />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input value={offer.price} onChange={(e) => handleOfferChange(index, 'price', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Original Price</Label>
                      <Input value={offer.originalPrice} onChange={(e) => handleOfferChange(index, 'originalPrice', e.target.value)} />
                    </div>
                    <div>
                      <Label>Savings</Label>
                      <Input value={offer.savings} onChange={(e) => handleOfferChange(index, 'savings', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              {data.offers.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">No offers added.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default PrabasAustraliaManagement;
