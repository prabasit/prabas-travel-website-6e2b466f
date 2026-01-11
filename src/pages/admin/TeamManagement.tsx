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

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  photo_url: string;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  display_order: number;
}

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      // Fetch members sorted by the display_order
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error: any) {
      console.error('Error fetching team members:', error);
      toast({ title: "Error", description: `Failed to load team members: ${error.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    // Default the order to the next number in the sequence
    const nextOrder = teamMembers.length > 0 ? Math.max(...teamMembers.map(m => m.display_order)) + 1 : 0;
    setEditingMember({ name: '', position: '', bio: '', photo_url: '', display_order: nextOrder });
    setIsDialogOpen(true);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember({ ...member });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;

    try {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Success", description: "Team member deleted successfully!" });
      fetchTeamMembers();
    } catch (error: any) {
      console.error('Error deleting team member:', error);
      toast({ title: "Error", description: `Failed to delete team member: ${error.message}`, variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    setSaving(true);
    try {
      const dataToUpsert = { ...editingMember };
      const { error } = await supabase.from('team_members').upsert(dataToUpsert).select();
      if (error) throw error;
      toast({ title: "Success", description: "Team member saved successfully!" });
      setIsDialogOpen(false);
      setEditingMember(null);
      fetchTeamMembers();
    } catch (error: any) {
      console.error('Error saving team member:', error);
      toast({ title: "Error", description: `Failed to save team member: ${error.message}`, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };
  
  const handleInputChange = (field: keyof TeamMember, value: string | number) => {
    if (editingMember) {
      setEditingMember(prev => ({ ...prev, [field]: value } as Partial<TeamMember>));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Team Management</h1>
            <p className="text-muted-foreground">Manage your team members and their display order</p>
          </div>
          <Button onClick={handleCreateNew}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>

        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Order</TableHead>
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : (
                  teamMembers.map(member => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.display_order}</TableCell>
                      <TableCell>
                        <img src={`${member.photo_url}?t=${new Date().getTime()}`} alt={member.name} className="h-12 w-12 rounded-full object-cover object-top" />
                      </TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.position}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(member)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(member.id!)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMember?.id ? 'Edit' : 'Add'} Team Member</DialogTitle>
          </DialogHeader>
          {editingMember && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={editingMember.name || ''} onChange={e => handleInputChange('name', e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" value={editingMember.position || ''} onChange={e => handleInputChange('position', e.target.value)} required />
                </div>
              </div>

              {/* MODIFICATION: Added input for display_order */}
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input 
                  id="display_order" 
                  type="number" 
                  value={editingMember.display_order ?? ''} 
                  onChange={e => handleInputChange('display_order', parseInt(e.target.value) || 0)} 
                  required 
                />
                 <p className="text-xs text-muted-foreground mt-1">A smaller number (like 0 or 1) will appear first.</p>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={editingMember.bio || ''} onChange={e => handleInputChange('bio', e.target.value)} rows={4} />
              </div>
              <div>
                <Label>Photo</Label>
                <FileUpload
                  onFileUpload={(url) => handleInputChange('photo_url', url)}
                  currentFile={editingMember.photo_url}
                  label="Team Member Photo"
                />
              </div>
              <div>
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input id="linkedin_url" value={editingMember.linkedin_url || ''} onChange={e => handleInputChange('linkedin_url', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="twitter_url">Twitter URL</Label>
                <Input id="twitter_url" value={editingMember.twitter_url || ''} onChange={e => handleInputChange('twitter_url', e.target.value)} />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default TeamManagement;