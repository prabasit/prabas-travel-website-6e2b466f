
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Phone, Calendar, CheckCircle, Clock, X } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  responded_at: string | null;
  created_at: string;
}

const InquiriesManagement = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'responded' | 'closed'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast({
        title: "Error",
        description: "Failed to fetch inquiries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      const updateData = {
        status,
        responded_at: status === 'responded' ? new Date().toISOString() : null
      };

      const { error } = await supabase
        .from('inquiries')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Inquiry marked as ${status}`,
      });
      fetchInquiries();
    } catch (error) {
      console.error('Error updating inquiry:', error);
      toast({
        title: "Error",
        description: "Failed to update inquiry status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'responded':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'responded':
        return <CheckCircle className="h-4 w-4" />;
      case 'closed':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => 
    filter === 'all' || inquiry.status === filter
  );

  const getStatusCounts = () => {
    return {
      pending: inquiries.filter(i => i.status === 'pending').length,
      responded: inquiries.filter(i => i.status === 'responded').length,
      closed: inquiries.filter(i => i.status === 'closed').length
    };
  };

  const statusCounts = getStatusCounts();

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
        <div>
          <h1 className="text-3xl font-bold">Inquiries Management</h1>
          <p className="text-muted-foreground">Manage customer inquiries and messages</p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{inquiries.length}</div>
              <div className="text-sm text-muted-foreground">Total Inquiries</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.responded}</div>
              <div className="text-sm text-muted-foreground">Responded</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{statusCounts.closed}</div>
              <div className="text-sm text-muted-foreground">Closed</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All ({inquiries.length})
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
          >
            Pending ({statusCounts.pending})
          </Button>
          <Button
            variant={filter === 'responded' ? 'default' : 'outline'}
            onClick={() => setFilter('responded')}
          >
            Responded ({statusCounts.responded})
          </Button>
          <Button
            variant={filter === 'closed' ? 'default' : 'outline'}
            onClick={() => setFilter('closed')}
          >
            Closed ({statusCounts.closed})
          </Button>
        </div>

        {/* Inquiries List */}
        <div className="grid gap-4">
          {filteredInquiries.map((inquiry) => (
            <Card key={inquiry.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{inquiry.subject}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {inquiry.email}
                      </div>
                      {inquiry.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {inquiry.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(inquiry.status)}>
                      {getStatusIcon(inquiry.status)}
                      <span className="ml-1 capitalize">{inquiry.status}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">From: {inquiry.name}</p>
                    <p className="text-muted-foreground mt-2">{inquiry.message}</p>
                  </div>
                  
                  {inquiry.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateInquiryStatus(inquiry.id, 'responded')}
                      >
                        Mark as Responded
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateInquiryStatus(inquiry.id, 'closed')}
                      >
                        Close
                      </Button>
                    </div>
                  )}
                  
                  {inquiry.status === 'responded' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateInquiryStatus(inquiry.id, 'closed')}
                      >
                        Close
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateInquiryStatus(inquiry.id, 'pending')}
                      >
                        Mark as Pending
                      </Button>
                    </div>
                  )}
                  
                  {inquiry.status === 'closed' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateInquiryStatus(inquiry.id, 'pending')}
                      >
                        Reopen
                      </Button>
                    </div>
                  )}
                  
                  {inquiry.responded_at && (
                    <p className="text-sm text-muted-foreground">
                      Responded on: {new Date(inquiry.responded_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInquiries.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? 'No inquiries found.' 
                  : `No ${filter} inquiries found.`
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default InquiriesManagement;
