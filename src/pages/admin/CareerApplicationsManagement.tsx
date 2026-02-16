import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Phone, Calendar, ExternalLink, Eye, CheckCircle, XCircle, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type Status = 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';

interface JobApplication {
  id: string;
  career_id: string | null;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string | null;
  cover_letter: string | null;
  resume_url: string | null;
  position_title?: string | null; // some rows store this denormalized
  status: Status;
  created_at: string;
}

interface Career {
  id: string;
  title: string;
  is_active: boolean;
}

const statusOptions: Array<{ value: '' | Status; label: string }> = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'hired', label: 'Hired' }
];

export default function CareerApplicationsManagement() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Filters
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'' | Status>('');
  const [careerId, setCareerId] = useState<string>(''); // '' = all
  const [dateFrom, setDateFrom] = useState<string>(''); // yyyy-mm-dd
  const [dateTo, setDateTo] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const [{ data: apps, error: appsErr }, { data: careersData, error: careersErr }] = await Promise.all([
          supabase.from('job_applications').select('*').order('created_at', { ascending: false }),
          supabase.from('careers').select('id,title,is_active').order('title', { ascending: true })
        ]);
        if (appsErr) throw appsErr;
        if (careersErr) throw careersErr;

        setApplications((apps || []) as unknown as JobApplication[]);
        setCareers((careersData as Career[]) || []);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'Failed to load applications/careers',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const careerTitleById = useMemo(() => {
    const map = new Map<string, string>();
    careers.forEach(c => map.set(c.id, c.title));
    return map;
  }, [careers]);

  const normalizedApps = useMemo(() => {
    return applications.map(a => ({
      ...a,
      position_title: a.position_title || (a.career_id ? careerTitleById.get(a.career_id) || 'Untitled Job' : 'General Application')
    }));
  }, [applications, careerTitleById]);

  // Apply filters in-memory (fast + simple). If dataset grows large, we can push these to Supabase queries.
  const filtered = useMemo(() => {
    return normalizedApps.filter(a => {
      if (status && a.status !== status) return false;
      if (careerId && a.career_id !== careerId) return false;

      if (dateFrom && new Date(a.created_at) < new Date(`${dateFrom}T00:00:00`)) return false;
      if (dateTo && new Date(a.created_at) > new Date(`${dateTo}T23:59:59`)) return false;

      if (q) {
        const hay = `${a.applicant_name} ${a.applicant_email} ${a.applicant_phone ?? ''} ${a.cover_letter ?? ''} ${a.position_title ?? ''}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [normalizedApps, status, careerId, q, dateFrom, dateTo]);

  // Group by career/post
  const grouped = useMemo(() => {
    const groups: Record<string, JobApplication[]> = {};
    filtered.forEach(a => {
      const key = a.career_id || 'no-career';
      if (!groups[key]) groups[key] = [];
      groups[key].push(a);
    });
    return groups;
  }, [filtered]);

  const updateApplicationStatus = async (id: string, next: Status) => {
    try {
      const { error } = await supabase.from('job_applications').update({ status: next }).eq('id', id);
      if (error) throw error;
      setApplications(prev => prev.map(app => (app.id === id ? { ...app, status: next } as JobApplication : app)));
      toast({ title: 'Status updated', description: `Application marked as ${next}` });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to update application status', variant: 'destructive' });
    }
  };

  const getStatusBadge = (s: Status) => {
    const map: Record<Status, { variant: 'secondary' | 'default' | 'destructive'; label: string }> = {
      pending: { variant: 'secondary', label: 'Pending' },
      reviewed: { variant: 'default', label: 'Reviewed' },
      shortlisted: { variant: 'default', label: 'Shortlisted' },
      rejected: { variant: 'destructive', label: 'Rejected' },
      hired: { variant: 'default', label: 'Hired' }
    };
    const cfg = map[s] ?? map.pending;
    return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
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
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Job Applications</h1>
            <p className="text-muted-foreground">Review, filter, and update applications per job post.</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <CardTitle className="text-base">Filters</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="q">Search</Label>
              <Input
                id="q"
                placeholder="Name, email, keywords…"
                value={q}
                onChange={e => setQ(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="w-full h-10 border rounded-md bg-background px-3 text-sm"
                value={status}
                onChange={e => setStatus(e.target.value as Status | '')}
              >
                {statusOptions.map(opt => (
                  <option key={opt.value || 'all'} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="career">Job Post</Label>
              <select
                id="career"
                className="w-full h-10 border rounded-md bg-background px-3 text-sm"
                value={careerId}
                onChange={e => setCareerId(e.target.value)}
              >
                <option value="">All job posts</option>
                {careers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title} {c.is_active ? '' : '(inactive)'}
                  </option>
                ))}
                {/* handle apps without a linked career */}
                {Object.keys(grouped).includes('no-career') && <option value="no-career">Unassigned / General</option>}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from">From</Label>
                <Input id="from" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="to">To</Label>
                <Input id="to" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {Object.keys(grouped).length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No applications match your filters.</p>
            </CardContent>
          </Card>
        ) : (
          // Render a section per job post
          Object.entries(grouped).map(([groupKey, apps]) => {
            const title =
              groupKey === 'no-career'
                ? 'Unassigned / General Applications'
                : careerTitleById.get(groupKey) || apps[0]?.position_title || 'Job Post';

            return (
              <Card key={groupKey}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{title}</CardTitle>
                      <p className="text-muted-foreground mt-1">{apps.length} application(s)</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="grid gap-4">
                  {apps.map(application => (
                    <div key={application.id} className="rounded-lg border p-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-semibold">{application.applicant_name}</h3>
                            {getStatusBadge(application.status)}
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {application.position_title}
                          </div>
                        </div>

                        <div className="text-sm grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-2 md:mt-0">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{application.applicant_email}</span>
                          </div>
                          {application.applicant_phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{application.applicant_phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Applied on {new Date(application.created_at).toLocaleDateString()}</span>
                          </div>
                          {application.resume_url && (
                            <div className="flex items-center gap-2">
                              <ExternalLink className="h-4 w-4 text-muted-foreground" />
                              <a
                                href={application.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                View Resume
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Application — {application.applicant_name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Position:</h4>
                                <p>{application.position_title}</p>
                              </div>
                              {application.cover_letter && (
                                <div>
                                  <h4 className="font-semibold mb-2">Cover Letter:</h4>
                                  <div className="bg-muted/50 p-4 rounded-lg">
                                    <p className="whitespace-pre-wrap">{application.cover_letter}</p>
                                  </div>
                                </div>
                              )}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Contact</h4>
                                  <p>Email: {application.applicant_email}</p>
                                  {application.applicant_phone && <p>Phone: {application.applicant_phone}</p>}
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Applied</h4>
                                  <p>{new Date(application.created_at).toLocaleDateString()}</p>
                                </div>
                              </div>
                              {application.resume_url && (
                                <div>
                                  <h4 className="font-semibold mb-2">Resume:</h4>
                                  <a
                                    href={application.resume_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline inline-flex items-center"
                                  >
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    Open resume
                                  </a>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        <div className="flex flex-wrap gap-2">
                          {application.status === 'pending' && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => updateApplicationStatus(application.id, 'reviewed')}>
                                Mark Reviewed
                              </Button>
                              <Button size="sm" onClick={() => updateApplicationStatus(application.id, 'shortlisted')}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Shortlist
                              </Button>
                            </>
                          )}
                          {application.status === 'reviewed' && (
                            <>
                              <Button size="sm" onClick={() => updateApplicationStatus(application.id, 'shortlisted')}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Shortlist
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => updateApplicationStatus(application.id, 'rejected')}>
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {application.status === 'shortlisted' && (
                            <>
                              <Button size="sm" onClick={() => updateApplicationStatus(application.id, 'hired')}>
                                Mark Hired
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => updateApplicationStatus(application.id, 'rejected')}>
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {application.status === 'rejected' && (
                            <Button size="sm" variant="outline" onClick={() => updateApplicationStatus(application.id, 'reviewed')}>
                              Move to Reviewed
                            </Button>
                          )}
                          {application.status === 'hired' && (
                            <Button size="sm" variant="outline" onClick={() => updateApplicationStatus(application.id, 'reviewed')}>
                              Reopen
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </AdminLayout>
  );
}
