
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validatePasswordStrength, createRateLimiter, secureStorage } from '@/utils/security';

interface AdminSession {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  expires_at: number;
  last_activity: number;
  session_token: string;
}

const SESSION_TIMEOUT = 20 * 60 * 1000; // 20 minutes in milliseconds
const loginRateLimiter = createRateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

export const useSecureAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
    
    // Check for inactivity every minute
    const activityInterval = setInterval(() => {
      checkForInactivity();
    }, 60000);

    // Track user activity
    const trackActivity = () => {
      if (adminUser) {
        const updatedSession = {
          ...adminUser,
          last_activity: Date.now()
        };
        secureStorage.setItem('admin_session', updatedSession);
        setAdminUser(updatedSession);
      }
    };

    // Add activity listeners
    document.addEventListener('mousedown', trackActivity);
    document.addEventListener('keydown', trackActivity);
    document.addEventListener('scroll', trackActivity);
    document.addEventListener('touchstart', trackActivity);

    return () => {
      clearInterval(activityInterval);
      document.removeEventListener('mousedown', trackActivity);
      document.removeEventListener('keydown', trackActivity);
      document.removeEventListener('scroll', trackActivity);
      document.removeEventListener('touchstart', trackActivity);
    };
  }, [adminUser]);

  const generateSessionToken = (): string => {
    return btoa(Date.now() + Math.random().toString(36));
  };

  const checkForInactivity = () => {
    const sessionData = secureStorage.getItem('admin_session');
    if (sessionData) {
      try {
        const session: AdminSession = sessionData;
        const timeSinceLastActivity = Date.now() - session.last_activity;
        
        if (timeSinceLastActivity > SESSION_TIMEOUT) {
          logout();
          toast({
            title: "Session Expired",
            description: "Your session has expired due to inactivity. Please log in again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error checking inactivity:', error);
        logout();
      }
    }
  };

  const checkAuthStatus = () => {
    try {
      const sessionData = secureStorage.getItem('admin_session');
      if (sessionData) {
        const session: AdminSession = sessionData;
        
        const isExpired = Date.now() > session.expires_at;
        const timeSinceLastActivity = Date.now() - (session.last_activity || session.expires_at - (24 * 60 * 60 * 1000));
        const isInactive = timeSinceLastActivity > SESSION_TIMEOUT;
        
        if (isExpired || isInactive || !session.session_token) {
          secureStorage.removeItem('admin_session');
          setIsAuthenticated(false);
          setAdminUser(null);
        } else {
          const updatedSession = {
            ...session,
            last_activity: Date.now()
          };
          secureStorage.setItem('admin_session', updatedSession);
          setAdminUser(updatedSession);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      secureStorage.removeItem('admin_session');
      setIsAuthenticated(false);
      setAdminUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Rate limiting check
      const clientIP = 'client'; // In a real app, you'd get the actual IP
      if (!loginRateLimiter(clientIP)) {
        toast({
          title: "Too Many Attempts",
          description: "Too many login attempts. Please try again in 15 minutes.",
          variant: "destructive",
        });
        return false;
      }

      if (!email || !password) {
        toast({
          title: "Validation Error",
          description: "Email and password are required",
          variant: "destructive",
        });
        return false;
      }

      // Use the simple login function that works
      const { data, error } = await supabase.rpc('admin_login_simple', {
        login_email: email.toLowerCase().trim(),
        login_password: password
      });

      if (error) {
        console.error('Login RPC error:', error);
        toast({
          title: "Login Error",
          description: "An error occurred during login",
          variant: "destructive",
        });
        return false;
      }

      if (!data || data.length === 0 || !data[0].success) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }

      const userData = data[0].user_data;
      const now = Date.now();
      const sessionToken = generateSessionToken();
      
      const session: AdminSession = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        is_active: userData.is_active,
        expires_at: now + (24 * 60 * 60 * 1000), // 24 hours
        last_activity: now,
        session_token: sessionToken
      };

      secureStorage.setItem('admin_session', session);
      setAdminUser(session);
      setIsAuthenticated(true);
      
      toast({
        title: "Login Successful",
        description: "Welcome to Admin Dashboard",
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    secureStorage.removeItem('admin_session');
    setIsAuthenticated(false);
    setAdminUser(null);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const hasRole = (role: string): boolean => {
    return adminUser?.role === role || adminUser?.role === 'super_admin';
  };

  return {
    isAuthenticated,
    adminUser,
    loading,
    login,
    logout,
    hasRole,
    checkAuthStatus
  };
};
