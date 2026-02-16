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
import { Plane, Save, Plus, Trash2 } from 'lucide-react';

interface FlightFeature {
  title: string;
  description: string;
  icon: string;
}

interface FlightsNepalData {
  id: string;
  title: string;
  description: string;
  features: FlightFeature[];
  hero_image_url: string;
}

const FlightsNepalManagement = () => {
  const [data, setData] = useState<FlightsNepalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: flightsData, error } = await supabase
        .from('flights_nepal')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is ok
        throw error;
      }
      
      setData(flightsData as unknown as FlightsNepalData);
    } catch (error: any) {
      console.error('Error fetching flights data:', error);
      toast({
        title: "Error",
        description: `Failed to load FlightsNepal data: ${error.message}`,
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
        .from('flights_nepal')
        .update({
          title: data.title,
          description: data.description,
          features: data.features as any,
          hero_image_url: data.hero_image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "FlightsNepal data updated successfully.",
      });
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast({
        title: "Error",
        description: `Failed to save FlightsNepal data: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof FlightsNepalData, value: any) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };
  
  const handleFeatureChange = (index: number, field: keyof FlightFeature, value: string) => {
    if (!data) return;
    const updatedFeatures = [...(data.features || [])];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    setData({ ...data, features: updatedFeatures });
  };

  const addFeature = () => {
    if (!data) return;
    const newFeature: FlightFeature = { title: '', description: '', icon: 'Plane' };
    setData({ ...data, features: [...(data.features || []), newFeature] });
  };

  const removeFeature = (index: number) => {
    if (!data) return;
    const updatedFeatures = (data.features || []).filter((_, i) => i !== index);
    setData({ ...data, features: updatedFeatures });
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
          <p className="text-muted-foreground">No FlightsNepal data found. Please add a record in your Supabase table.</p>
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
              <Plane className="h-7 w-7 md:h-8 md:w-8 mr-2" />
              FlightsNepal Management
            </h1>
            <p className="text-muted-foreground">Manage FlightsNepal content and features</p>
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
                <Textarea id="description" value={data.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={4} />
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
                Features <Button onClick={addFeature} size="sm"><Plus className="h-4 w-4 mr-2" /> Add</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
              {(data.features || []).map((feature, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3 relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeFeature(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <div>
                    <Label>Title</Label>
                    <Input value={feature.title} onChange={(e) => handleFeatureChange(index, 'title', e.target.value)} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={feature.description} onChange={(e) => handleFeatureChange(index, 'description', e.target.value)} rows={2} />
                  </div>
                  <div>
                    <Label>Icon Name</Label>
                    <Input value={feature.icon} onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)} placeholder="e.g., Plane, Clock, Shield" />
                  </div>
                </div>
              ))}
              {(data.features || []).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No features added.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FlightsNepalManagement;
