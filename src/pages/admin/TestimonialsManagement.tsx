
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FileUpload } from '@/components/ui/file-upload';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Trash2, Plus, Save, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  client_name: string;
  client_location: string;
  client_image_url: string;
  testimonial_text: string;
  trip_type: string;
  rating: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const TestimonialsManagement = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    client_name: '',
    client_location: '',
    client_image_url: '',
    testimonial_text: '',
    trip_type: '',
    rating: 5,
    is_featured: false,
    is_active: true
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: "Error",
        description: "Failed to fetch testimonials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTestimonial = async () => {
    try {
      if (editingTestimonial) {
        const { error } = await supabase
          .from('testimonials')
          .update(formData)
          .eq('id', editingTestimonial.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Testimonial updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Testimonial created successfully",
        });
      }

      fetchTestimonials();
      resetForm();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to save testimonial",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
    }
  };

  const startEditing = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      client_name: testimonial.client_name,
      client_location: testimonial.client_location || '',
      client_image_url: testimonial.client_image_url || '',
      testimonial_text: testimonial.testimonial_text,
      trip_type: testimonial.trip_type || '',
      rating: testimonial.rating,
      is_featured: testimonial.is_featured,
      is_active: testimonial.is_active
    });
    setIsCreating(false);
  };

  const resetForm = () => {
    setEditingTestimonial(null);
    setIsCreating(false);
    setFormData({
      client_name: '',
      client_location: '',
      client_image_url: '',
      testimonial_text: '',
      trip_type: '',
      rating: 5,
      is_featured: false,
      is_active: true
    });
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Testimonials Management</h1>
            <p className="text-muted-foreground">Manage customer testimonials</p>
          </div>
          <Button onClick={() => setIsCreating(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </div>

        {(isCreating || editingTestimonial) && (
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">
                {editingTestimonial ? 'Edit Testimonial' : 'Create New Testimonial'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client_name" className="text-foreground">Client Name</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                    placeholder="Client full name"
                    className="bg-background text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="client_location" className="text-foreground">Client Location</Label>
                  <Input
                    id="client_location"
                    value={formData.client_location}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_location: e.target.value }))}
                    placeholder="City, Country"
                    className="bg-background text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="trip_type" className="text-foreground">Trip Type</Label>
                  <Input
                    id="trip_type"
                    value={formData.trip_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, trip_type: e.target.value }))}
                    placeholder="Everest Base Camp Trek"
                    className="bg-background text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="rating" className="text-foreground">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="bg-background text-foreground"
                  />
                </div>
              </div>

              <FileUpload
                onFileUpload={(url) => setFormData(prev => ({ ...prev, client_image_url: url }))}
                currentFile={formData.client_image_url}
                label="Client Photo"
                acceptedTypes="image/*"
              />

              <div>
                <Label htmlFor="testimonial_text" className="text-foreground">Testimonial Text</Label>
                <Textarea
                  id="testimonial_text"
                  value={formData.testimonial_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, testimonial_text: e.target.value }))}
                  placeholder="Client's testimonial..."
                  rows={4}
                  className="bg-background text-foreground"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                  />
                  <Label htmlFor="is_featured" className="text-foreground">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active" className="text-foreground">Active</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveTestimonial} className="bg-primary hover:bg-primary/90">
                  <Save className="h-4 w-4 mr-2" />
                  Save Testimonial
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-card">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      {testimonial.client_image_url && (
                        <img
                          src={testimonial.client_image_url}
                          alt={testimonial.client_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-card-foreground">{testimonial.client_name}</h3>
                        <p className="text-muted-foreground">{testimonial.client_location}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-2">"{testimonial.testimonial_text}"</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      {testimonial.trip_type && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {testimonial.trip_type}
                        </span>
                      )}
                      {testimonial.is_featured && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          Featured
                        </span>
                      )}
                      {!testimonial.is_active && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditing(testimonial)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTestimonial(testimonial.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {testimonials.length === 0 && (
          <Card className="bg-card">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No testimonials found. Create your first testimonial to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default TestimonialsManagement;
