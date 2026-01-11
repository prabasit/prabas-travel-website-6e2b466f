
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Career {
  id?: string;
  title: string;
  department: string;
  location: string;
  job_type: string;
  description: string;
  requirements: string;
  salary_range: string;
  benefits: string;
  application_deadline: string;
  is_active: boolean;
}

const CareerManagement = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const initialCareerState: Career = {
    title: '',
    department: '',
    location: '',
    job_type: '',
    description: '',
    requirements: '',
    salary_range: '',
    benefits: '',
    application_deadline: '',
    is_active: true
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCareers(data || []);
    } catch (error) {
      console.error('Error fetching careers:', error);
      toast({
        title: "Error",
        description: "Failed to load career positions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (careerData: Career) => {
    try {
      if (careerData.id) {
        // Update existing career
        const { error } = await supabase
          .from('careers')
          .update(careerData)
          .eq('id', careerData.id);

        if (error) throw error;
        
        setCareers(prev => 
          prev.map(career => career.id === careerData.id ? careerData : career)
        );
        
        toast({
          title: "Success",
          description: "Career position updated successfully",
        });
      } else {
        // Create new career
        const { data, error } = await supabase
          .from('careers')
          .insert([careerData])
          .select()
          .single();

        if (error) throw error;
        
        setCareers(prev => [data, ...prev]);
        
        toast({
          title: "Success",
          description: "New career position created successfully",
        });
      }
      
      setIsDialogOpen(false);
      setEditingCareer(null);
    } catch (error) {
      console.error('Error saving career:', error);
      toast({
        title: "Error",
        description: "Failed to save career position",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this career position?')) return;

    try {
      const { error } = await supabase
        .from('careers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCareers(prev => prev.filter(career => career.id !== id));
      
      toast({
        title: "Success",
        description: "Career position deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting career:', error);
      toast({
        title: "Error",
        description: "Failed to delete career position",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (career?: Career) => {
    setEditingCareer(career ? { ...career } : { ...initialCareerState });
    setIsDialogOpen(true);
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
            <h1 className="text-3xl font-bold">Career Management</h1>
            <p className="text-muted-foreground">Manage job postings and career opportunities</p>
          </div>
          <Button onClick={() => openEditDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Position
          </Button>
        </div>

        <div className="grid gap-6">
          {careers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No career positions yet. Create your first job posting!</p>
              </CardContent>
            </Card>
          ) : (
            careers.map((career) => (
              <Card key={career.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{career.title}</CardTitle>
                      <p className="text-muted-foreground mt-1">
                        {career.department} • {career.location} • {career.job_type}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        career.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {career.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(career)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(career.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{career.description}</p>
                  {career.salary_range && (
                    <p className="text-sm mb-2"><strong>Salary:</strong> {career.salary_range}</p>
                  )}
                  {career.application_deadline && (
                    <p className="text-sm mb-2">
                      <strong>Deadline:</strong> {new Date(career.application_deadline).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCareer?.id ? 'Edit Career Position' : 'Add New Career Position'}
              </DialogTitle>
            </DialogHeader>
            
            {editingCareer && (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSave(editingCareer);
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      value={editingCareer.title}
                      onChange={(e) => setEditingCareer(prev => 
                        prev ? { ...prev, title: e.target.value } : null
                      )}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={editingCareer.department}
                      onChange={(e) => setEditingCareer(prev => 
                        prev ? { ...prev, department: e.target.value } : null
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editingCareer.location}
                      onChange={(e) => setEditingCareer(prev => 
                        prev ? { ...prev, location: e.target.value } : null
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="job_type">Job Type</Label>
                    <Input
                      id="job_type"
                      value={editingCareer.job_type}
                      onChange={(e) => setEditingCareer(prev => 
                        prev ? { ...prev, job_type: e.target.value } : null
                      )}
                      placeholder="Full-time, Part-time, Contract, etc."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    value={editingCareer.description}
                    onChange={(e) => setEditingCareer(prev => 
                      prev ? { ...prev, description: e.target.value } : null
                    )}
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    value={editingCareer.requirements}
                    onChange={(e) => setEditingCareer(prev => 
                      prev ? { ...prev, requirements: e.target.value } : null
                    )}
                    className="min-h-[100px]"
                    placeholder="List requirements, one per line"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="salary_range">Salary Range</Label>
                    <Input
                      id="salary_range"
                      value={editingCareer.salary_range}
                      onChange={(e) => setEditingCareer(prev => 
                        prev ? { ...prev, salary_range: e.target.value } : null
                      )}
                      placeholder="e.g., NPR 50,000 - 80,000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="application_deadline">Application Deadline</Label>
                    <Input
                      id="application_deadline"
                      type="date"
                      value={editingCareer.application_deadline}
                      onChange={(e) => setEditingCareer(prev => 
                        prev ? { ...prev, application_deadline: e.target.value } : null
                      )}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="benefits">Benefits</Label>
                  <Textarea
                    id="benefits"
                    value={editingCareer.benefits}
                    onChange={(e) => setEditingCareer(prev => 
                      prev ? { ...prev, benefits: e.target.value } : null
                    )}
                    placeholder="List benefits and perks"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={editingCareer.is_active}
                    onCheckedChange={(checked) => setEditingCareer(prev => 
                      prev ? { ...prev, is_active: checked } : null
                    )}
                  />
                  <Label htmlFor="is_active">Active Position</Label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save Position
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default CareerManagement;
