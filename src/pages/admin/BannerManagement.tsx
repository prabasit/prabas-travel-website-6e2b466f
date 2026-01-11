import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, MoveUp, MoveDown, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileUpload } from '@/components/ui/file-upload';

interface BannerButton {
  text: string;
  link: string;
  style: 'primary' | 'secondary' | 'accent';
}

const BannerManagement = () => {
  const [selectedBanner, setSelectedBanner] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    buttons: [] as BannerButton[],
    is_active: true,
    display_order: 0
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: banners, isLoading } = useQuery({
    queryKey: ['banner-slides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banner_slides')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  const createBannerMutation = useMutation({
    mutationFn: async (bannerData: any) => {
      const maxOrder = banners ? Math.max(...banners.map(b => b.display_order), 0) : 0;
      const { data, error } = await supabase
        .from('banner_slides')
        .insert([{ ...bannerData, display_order: maxOrder + 1 }])
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banner-slides'] });
      toast({ title: 'Banner created successfully' });
      resetForm();
    },
    onError: (error: any) => {
      console.error('Create banner error:', error);
      toast({
        title: 'Error creating banner',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const updateBannerMutation = useMutation({
    mutationFn: async ({ id, ...bannerData }: any) => {
      const { data, error } = await supabase
        .from('banner_slides')
        .update(bannerData)
        .eq('id', id)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banner-slides'] });
      toast({ title: 'Banner updated successfully' });
      resetForm();
    },
    onError: (error: any) => {
      console.error('Update banner error:', error);
      toast({
        title: 'Error updating banner',
        description: error.message || 'Failed to update banner',
        variant: 'destructive'
      });
    }
  });

  const deleteBannerMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('banner_slides')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banner-slides'] });
      toast({ title: 'Banner deleted successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting banner',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const updateOrderMutation = useMutation({
    mutationFn: async (updates: Array<{ id: string; display_order: number }>) => {
      const promises = updates.map(({ id, display_order }) =>
        supabase
          .from('banner_slides')
          .update({ display_order })
          .eq('id', id)
      );
      
      const results = await Promise.all(promises);
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error('Failed to update order');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banner-slides'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating order',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      buttons: [],
      is_active: true,
      display_order: 0
    });
    setSelectedBanner(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (banner: any) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image_url: banner.image_url,
      buttons: Array.isArray(banner.buttons) ? banner.buttons : [],
      is_active: banner.is_active,
      display_order: banner.display_order
    });
    setIsDialogOpen(true);
  };

  const addButton = () => {
    setFormData({
      ...formData,
      buttons: [...formData.buttons, { text: '', link: '', style: 'primary' }]
    });
  };

  const removeButton = (index: number) => {
    setFormData({
      ...formData,
      buttons: formData.buttons.filter((_, i) => i !== index)
    });
  };

  const updateButton = (index: number, field: keyof BannerButton, value: string) => {
    const updatedButtons = [...formData.buttons];
    updatedButtons[index] = { ...updatedButtons[index], [field]: value };
    setFormData({ ...formData, buttons: updatedButtons });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedBanner) {
      updateBannerMutation.mutate({ ...formData, id: selectedBanner.id });
    } else {
      createBannerMutation.mutate(formData);
    }
  };

  const moveUp = (banner: any) => {
    const currentIndex = banners?.findIndex(b => b.id === banner.id) || 0;
    if (currentIndex > 0 && banners) {
      const prevBanner = banners[currentIndex - 1];
      updateOrderMutation.mutate([
        { id: banner.id, display_order: prevBanner.display_order },
        { id: prevBanner.id, display_order: banner.display_order }
      ]);
    }
  };

  const moveDown = (banner: any) => {
    const currentIndex = banners?.findIndex(b => b.id === banner.id) || 0;
    if (banners && currentIndex < banners.length - 1) {
      const nextBanner = banners[currentIndex + 1];
      updateOrderMutation.mutate([
        { id: banner.id, display_order: nextBanner.display_order },
        { id: nextBanner.id, display_order: banner.display_order }
      ]);
    }
  };

  if (isLoading) {
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Banner Management</h1>
            <p className="text-muted-foreground">Manage home page slider banners with multiple buttons</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedBanner ? 'Edit Banner' : 'Create New Banner'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Textarea
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                
                <div>
                  <FileUpload
                    onFileUpload={(url) => setFormData({ ...formData, image_url: url })}
                    currentFile={formData.image_url}
                    acceptedTypes="image/*"
                    maxSize={10485760}
                    label="Banner Image (Max 10MB)"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Buttons</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addButton}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Button
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.buttons.map((button, index) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label>Button Text</Label>
                                <Input
                                  value={button.text}
                                  onChange={(e) => updateButton(index, 'text', e.target.value)}
                                  placeholder="Button text"
                                />
                              </div>
                              <div>
                                <Label>Button Link</Label>
                                <Input
                                  value={button.link}
                                  onChange={(e) => updateButton(index, 'link', e.target.value)}
                                  placeholder="/page-url"
                                />
                              </div>
                              <div>
                                <Label>Button Style</Label>
                                <Select
                                  value={button.style}
                                  onValueChange={(value) => updateButton(index, 'style', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="primary">Primary (Blue)</SelectItem>
                                    <SelectItem value="secondary">Secondary (Gray)</SelectItem>
                                    <SelectItem value="accent">Accent (Orange)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeButton(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createBannerMutation.isPending || updateBannerMutation.isPending}>
                    {selectedBanner ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {banners?.map((banner, index) => (
            <Card key={banner.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex items-center space-x-4 min-w-0 flex-1">
                    {banner.image_url && (
                      <img 
                        src={banner.image_url} 
                        alt={banner.title}
                        className="w-16 h-16 object-cover rounded flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate">{banner.title}</CardTitle>
                      {banner.subtitle && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{banner.subtitle}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveUp(banner)}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveDown(banner)}
                      disabled={index === (banners?.length || 0) - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(banner)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteBannerMutation.mutate(banner.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      banner.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {banner.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {banner.buttons && Array.isArray(banner.buttons) && banner.buttons.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {banner.buttons.map((btn: any, i: number) => (
                          <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {btn.text} ({btn.style})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Order: {banner.display_order}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default BannerManagement;
