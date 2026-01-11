import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, MessageSquare, Award, Mail, Settings, Image, Layout, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const [stats, setStats] = useState({
    teamMembers: 0,
    blogPosts: 0,
    testimonials: 0,
    awards: 0,
    inquiries: 0,
    pages: 0,
    admins: 0,
    newsletters: 0,
    banners: 0,
    applications: 0, // NEW
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        teamRes, blogRes, testimonialsRes, awardsRes, inquiriesRes,
        pagesRes, adminsRes, newslettersRes, bannersRes, appsRes
      ] = await Promise.all([
        supabase.from('team_members').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
        supabase.from('awards').select('*', { count: 'exact', head: true }),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }),
        supabase.from('pages').select('*', { count: 'exact', head: true }),
        supabase.from('admin_users').select('*', { count: 'exact', head: true }),
        supabase.from('newsletter_subscriptions').select('*', { count: 'exact', head: true }),
        supabase.from('banner_slides').select('*', { count: 'exact', head: true }),
        supabase.from('job_applications').select('*', { count: 'exact', head: true }), // NEW
      ]);

      setStats({
        teamMembers: teamRes.count || 0,
        blogPosts: blogRes.count || 0,
        testimonials: testimonialsRes.count || 0,
        awards: awardsRes.count || 0,
        inquiries: inquiriesRes.count || 0,
        pages: pagesRes.count || 0,
        admins: adminsRes.count || 0,
        newsletters: newslettersRes.count || 0,
        banners: bannersRes.count || 0,
        applications: appsRes.count || 0, // NEW
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    { title: 'Team Members', value: stats.teamMembers, icon: Users, color: 'text-blue-600' },
    { title: 'Blog Posts', value: stats.blogPosts, icon: FileText, color: 'text-green-600' },
    { title: 'Testimonials', value: stats.testimonials, icon: MessageSquare, color: 'text-purple-600' },
    { title: 'Awards', value: stats.awards, icon: Award, color: 'text-yellow-600' },
    { title: 'Inquiries', value: stats.inquiries, icon: Mail, color: 'text-red-600' },
    { title: 'Pages', value: stats.pages, icon: Settings, color: 'text-indigo-600' },
    { title: 'Banners', value: stats.banners, icon: Image, color: 'text-pink-600' },
    { title: 'Newsletter Subs', value: stats.newsletters, icon: Mail, color: 'text-cyan-600' },
    { title: 'Applications', value: stats.applications, icon: Briefcase, color: 'text-emerald-600' }, // NEW
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Prabas Travel Admin Panel</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* (rest unchanged) */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Database</span>
                <span className="text-green-600 font-medium">Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Admin Panel</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span>File Upload System</span>
                <span className="text-green-600 font-medium">Active (10MB limit)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Session Timeout</span>
                <span className="text-blue-600 font-medium">20 minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Last Updated</span>
                <span className="text-muted-foreground">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
