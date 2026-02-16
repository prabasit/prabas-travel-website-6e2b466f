import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

interface AdminUser {
  id?: string;
  user_id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
}

const AdminManagement = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<AdminUser> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    setLoading(true);
    try {
      // This fetch will now work because the RLS policies are non-recursive.
      const { data, error } = await supabase.from('admin_users').select('*');
      if (error) throw error;
      setAdminUsers((data || []) as unknown as AdminUser[]);
    } catch (error: any) {
      console.error('Error fetching admin users:', error);
      toast({ title: "Error", description: `Failed to load admin users: ${error.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingUser({ name: '', email: '', role: 'admin' });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser({ ...user });
    setIsDialogOpen(true);
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this admin user? This action cannot be undone.")) return;

    try {
      // This should also be moved to a secure Edge Function in a production environment.
      const { error: roleError } = await supabase.from('user_roles').delete().eq('user_id', userId);
      if (roleError) throw roleError;

      const { error: userError } = await supabase.from('admin_users').delete().eq('user_id', userId);
      if (userError) throw userError;
      
      // Note: This does not delete the user from Supabase Auth. That requires another Edge Function call.

      toast({ title: "Success", description: "Admin user deleted successfully!" });
      fetchAdminUsers();
    } catch (error: any) {
      console.error('Error deleting admin user:', error);
      toast({ title: "Error", description: `Failed to delete admin user: ${error.message}`, variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editingUser.email || !editingUser.role) return;

    setSaving(true);
    try {
      if (editingUser.user_id) {
        // EDITING an existing user's role.
        const { error } = await supabase
          .from('user_roles')
          .update({ role: editingUser.role })
          .eq('user_id', editingUser.user_id);
        if (error) throw error;

      } else {
        // CREATING a new user via the secure Edge Function.
        const { error } = await supabase.functions.invoke('create-admin-user', {
          body: {
            email: editingUser.email,
            name: editingUser.name,
            role: editingUser.role,
          },
        });
        if (error) throw error;
      }
      
      toast({ title: "Success", description: "Admin user saved successfully!" });
      setIsDialogOpen(false);
      setEditingUser(null);
      fetchAdminUsers();
    } catch (error: any) {
      console.error('Error saving admin user:', error);
      toast({ title: "Error", description: `Failed to save admin user: ${error.message}`, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };
  
  const handleInputChange = (field: keyof AdminUser, value: string) => {
    if (editingUser) {
      setEditingUser(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Admin User Management</h1>
            <Button onClick={handleCreateNew}><PlusCircle className="h-4 w-4 mr-2" />Add Admin</Button>
        </div>

        <Card>
            <CardContent>
                <Table>
                    <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {loading ? <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow> : 
                            adminUsers.map(user => (
                                <TableRow key={user.user_id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(user)}><Edit className="h-4 w-4" /></Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(user.user_id)}><Trash2 className="h-4 w-4" /></Button>
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
        <DialogContent>
          <DialogHeader><DialogTitle>{editingUser?.user_id ? 'Edit' : 'Add'} Admin User</DialogTitle></DialogHeader>
          {editingUser && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={editingUser.name || ''} onChange={e => handleInputChange('name', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={editingUser.email || ''} onChange={e => handleInputChange('email', e.target.value)} required disabled={!!editingUser.user_id} />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={editingUser.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="superadmin">Superadmin</SelectItem>
                    </SelectContent>
                </Select>
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

export default AdminManagement;