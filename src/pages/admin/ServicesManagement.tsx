import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon_url: string;
  features: string[] | null;
  display_order: number;
  is_active: boolean;
}

interface ServiceFormData {
  title: string;
  description: string;
  icon_url: string;
  features: string;
  display_order: number;
  is_active: boolean;
}

const ServicesManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    icon_url: '',
    features: '',
    display_order: 0,
    is_active: true,
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      console.error('Error fetching services:', error);
      toast({ title: "Error", description: `Failed to load services: ${error.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingService(null);
    const nextOrder = services.length > 0 ? Math.max(...services.map(s => s.display_order)) + 1 : 0;
    setFormData({ title: '', description: '', icon_url: '', features: '', display_order: nextOrder, is_active: true });
    setIsDialogOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon_url: service.icon_url,
      features: Array.isArray(service.features) ? service.features.join(', ') : '',
      display_order: service.display_order,
      is_active: service.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Success", description: "Service deleted successfully!" });
      fetchServices();
    } catch (error: any) {
      console.error('Error deleting service:', error);
      toast({ title: "Error", description: `Failed to delete service: ${error.message}`, variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f);

      const dataToUpsert = {
        id: editingService?.id,
        title: formData.title,
        description: formData.description,
        icon_url: formData.icon_url,
        features: featuresArray,
        display_order: formData.display_order,
        is_active: formData.is_active,
      };

      const { error } = await supabase.from('services').upsert(dataToUpsert);
      if (error) throw error;

      toast({ title: "Success", description: "Service saved successfully!" });
      setIsDialogOpen(false);
      fetchServices();
    } catch (error: any) {
      console.error('Error saving service:', error);
      toast({ title: "Error", description: `Failed to save service: ${error.message}`, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };
  
  const handleInputChange = (field: keyof ServiceFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Services Management</h1>
            <Button onClick={handleCreateNew}><PlusCircle className="h-4 w-4 mr-2" />Add Service</Button>
        </div>
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Order</TableHead>
                  <TableHead>Photo</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow> : 
                  services.map(service => (
                    <TableRow key={service.id}>
                      <TableCell>{service.display_order}</TableCell>
                      <TableCell>
                        <img src={`${service.icon_url}?t=${new Date().getTime()}`} alt={service.title} className="h-12 w-20 rounded object-cover" />
                      </TableCell>
                      <TableCell>{service.title}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${ service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }`}>
                          {service.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(service)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(service.id!)}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingService ? 'Edit' : 'Add'} Service</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={formData.title} onChange={e => handleInputChange('title', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={e => handleInputChange('description', e.target.value)} rows={4} required />
              </div>
              <div>
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Textarea id="features" value={formData.features} onChange={e => handleInputChange('features', e.target.value)} rows={3} placeholder="Feature 1, Feature 2, Feature 3" />
              </div>
               <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input id="display_order" type="number" value={formData.display_order} onChange={e => handleInputChange('display_order', parseInt(e.target.value) || 0)} required />
              </div>
              <div>
                {/* MODIFICATION: Changed label from "Icon" to "Service Photo" */}
                <Label>Service Photo</Label>
                <FileUpload
                  onFileUpload={(url) => handleInputChange('icon_url', url)}
                  currentFile={formData.icon_url}
                  label="Service Photo (Recommended: 16:9 ratio)"
                />
              </div>
              <div className="flex items-center space-x-2">
                  <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => handleInputChange('is_active', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
              </div>
            </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ServicesManagement;

