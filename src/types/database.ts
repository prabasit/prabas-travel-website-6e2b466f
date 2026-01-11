
export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          role: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          role?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          role?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      pages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          content: string | null;
          meta_description: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          content?: string | null;
          meta_description?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          content?: string | null;
          meta_description?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      about_us: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          story: string | null;
          mission: string | null;
          vision: string | null;
          values: any;
          stats: any;
          image_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          story?: string | null;
          mission?: string | null;
          vision?: string | null;
          values?: any;
          stats?: any;
          image_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          story?: string | null;
          mission?: string | null;
          vision?: string | null;
          values?: any;
          stats?: any;
          image_url?: string | null;
          updated_at?: string;
        };
      };
      team_members: {
        Row: {
          id: string;
          name: string;
          position: string;
          bio: string | null;
          email: string | null;
          phone: string | null;
          image_url: string | null;
          social_links: any;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          position: string;
          bio?: string | null;
          email?: string | null;
          phone?: string | null;
          image_url?: string | null;
          social_links?: any;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          position?: string;
          bio?: string | null;
          email?: string | null;
          phone?: string | null;
          image_url?: string | null;
          social_links?: any;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      careers: {
        Row: {
          id: string;
          title: string;
          department: string | null;
          location: string | null;
          job_type: string | null;
          salary_range: string | null;
          description: string | null;
          requirements: string | null;
          benefits: string | null;
          application_deadline: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          department?: string | null;
          location?: string | null;
          job_type?: string | null;
          salary_range?: string | null;
          description?: string | null;
          requirements?: string | null;
          benefits?: string | null;
          application_deadline?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          department?: string | null;
          location?: string | null;
          job_type?: string | null;
          salary_range?: string | null;
          description?: string | null;
          requirements?: string | null;
          benefits?: string | null;
          application_deadline?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          image_url: string | null;
          category: string | null;
          tags: string[] | null;
          author_id: string | null;
          is_published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string | null;
          image_url?: string | null;
          category?: string | null;
          tags?: string[] | null;
          author_id?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string | null;
          image_url?: string | null;
          category?: string | null;
          tags?: string[] | null;
          author_id?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          client_location: string | null;
          client_image_url: string | null;
          testimonial_text: string;
          trip_type: string | null;
          rating: number;
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_name: string;
          client_location?: string | null;
          client_image_url?: string | null;
          testimonial_text: string;
          trip_type?: string | null;
          rating?: number;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_name?: string;
          client_location?: string | null;
          client_image_url?: string | null;
          testimonial_text?: string;
          trip_type?: string | null;
          rating?: number;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      awards: {
        Row: {
          id: string;
          title: string;
          organization: string;
          year: number;
          description: string | null;
          image_url: string | null;
          category: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          organization: string;
          year: number;
          description?: string | null;
          image_url?: string | null;
          category?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          organization?: string;
          year?: number;
          description?: string | null;
          image_url?: string | null;
          category?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      inquiries: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string;
          message: string;
          status: string;
          responded_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject: string;
          message: string;
          status?: string;
          responded_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          subject?: string;
          message?: string;
          status?: string;
          responded_at?: string | null;
          created_at?: string;
        };
      };
      settings: {
        Row: {
          id: string;
          key: string;
          value: any;
          description: string | null;
          category: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value?: any;
          description?: string | null;
          category?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: any;
          description?: string | null;
          category?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}
