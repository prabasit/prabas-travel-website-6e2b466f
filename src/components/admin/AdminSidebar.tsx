import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  FileText,
  MessageSquare,
  Award,
  Mail,
  Settings,
  Shield,
  Plane,
  Globe,
  Image,
  Layout,
  Briefcase,
  Star,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

type NavLeaf = {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
};

type NavGroup =
  | {
      title: string;
      href: string;
      icon?: React.ComponentType<{ className?: string }>;
      description?: string;
    }
  | {
      title: string;
      items: NavLeaf[];
    };

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const { pathname } = useLocation();

  // ————————————————————————————————————————————————————————————————
  // Navigation model
  // Add/edit items here. New: “Job Applications”
  // ————————————————————————————————————————————————————————————————
  const navigationItems: NavGroup[] = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: Home,
      description: 'Overview and statistics',
    },
    {
      title: 'Content Management',
      items: [
        { title: 'Banner Management', href: '/admin/banners', icon: Image, description: 'Manage homepage banners' },
        { title: 'Pages CMS', href: '/admin/pages', icon: Layout, description: 'Create and edit pages' },
        { title: 'Blog Posts', href: '/admin/blogs', icon: FileText, description: 'Manage blog content' },
      ],
    },
    {
      title: 'Business Management',
      items: [
        { title: 'Team Members', href: '/admin/team', icon: Users, description: 'Manage team profiles' },
        { title: 'Services', href: '/admin/services', icon: Settings, description: 'Manage service offerings' },
        { title: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare, description: 'Customer testimonials' },
        { title: 'Awards', href: '/admin/awards', icon: Award, description: 'Company achievements' },
        { title: 'Careers', href: '/admin/careers', icon: Briefcase, description: 'Job postings' },
        // NEW: job applications management page
        { title: 'Job Applications', href: '/admin/job-applications', icon: Users, description: 'View & manage applications' },
      ],
    },
    // (Optional) travel-related section—keep if your project uses these routes
    {
      title: 'Travel Operations',
      items: [
        { title: 'Visa Queries', href: '/admin/visa-inquiries', icon: Shield, description: 'Visa inquiry management' },
        { title: 'Flight Requests', href: '/admin/flight-requests', icon: Plane, description: 'Flight bookings & quotes' },
        { title: 'Destinations', href: '/admin/destinations', icon: Globe, description: 'Country/region content' },
      ],
    },
    // (Optional) communications section—keep if present in your app
    {
      title: 'Communications',
      items: [
        { title: 'Inquiries', href: '/admin/inquiries', icon: Mail, description: 'Website contact form entries' },
        { title: 'Newsletter', href: '/admin/newsletter', icon: Star, description: 'Email subscribers' },
      ],
    },
  ];

  const isActive = (href: string) => {
    // Consider the item active if the current path starts with its href
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div
      className={cn(
        'h-full border-r bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40',
        isCollapsed ? 'w-16' : 'w-72'
      )}
    >
      {/* Top bar with brand + collapse toggle */}
      <div className="flex items-center justify-between px-3 py-3">
        <div className={cn('font-bold tracking-tight', isCollapsed && 'sr-only')}>
          Admin
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onToggleCollapse}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <Separator />

      <ScrollArea className="h-[calc(100%-3.25rem)] px-2">
        <nav className="py-3 space-y-2">
          {navigationItems.map((entry, index) => {
            const isLeaf = (e: NavGroup): e is NavLeaf => (e as NavLeaf).href !== undefined;
            if (isLeaf(entry)) {
              const Icon = entry.icon ?? ChevronRight;
              return (
                <div key={`${entry.title}-${index}`} className="px-1">
                  <NavLink
                    to={entry.href}
                    className={({ isActive: rrActive }) =>
                      cn(
                        'group flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors',
                        rrActive || isActive(entry.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                      )
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className={cn('truncate', isCollapsed && 'sr-only')}>{entry.title}</span>
                  </NavLink>
                  {index < navigationItems.length - 1 && !isCollapsed && <Separator className="my-2" />}
                </div>
              );
            }

            // Group with children
            return (
              <div key={`${entry.title}-${index}`} className="px-1">
                {!isCollapsed && (
                  <div className="px-2 pb-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                    {entry.title}
                  </div>
                )}
                <div className="space-y-1">
                  {entry.items.map((item) => {
                    const Icon = item.icon ?? ChevronRight;
                    return (
                      <NavLink
                        key={item.href}
                        to={item.href}
                        className={({ isActive: rrActive }) =>
                          cn(
                            'group flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors',
                            rrActive || isActive(item.href)
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                          )
                        }
                        title={isCollapsed ? item.title : undefined}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <div className={cn('min-w-0', isCollapsed && 'sr-only')}>
                          <div className="truncate">{item.title}</div>
                          {item.description && (
                            <div className="truncate text-xs text-muted-foreground/80">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </NavLink>
                    );
                  })}
                </div>

                {index < navigationItems.length - 1 && !isCollapsed && <Separator className="my-3" />}
              </div>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
};

export default AdminSidebar;
