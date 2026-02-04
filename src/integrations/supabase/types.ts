export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      about_us: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          mission: string | null
          story: string | null
          title: string
          updated_at: string
          vision: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          mission?: string | null
          story?: string | null
          title: string
          updated_at?: string
          vision?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          mission?: string | null
          story?: string | null
          title?: string
          updated_at?: string
          vision?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          password_hash: string | null
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          password_hash?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          password_hash?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      awards: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          organization: string
          title: string
          updated_at: string | null
          year: number
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          organization: string
          title: string
          updated_at?: string | null
          year: number
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          organization?: string
          title?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      banner_slides: {
        Row: {
          buttons: Json | null
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          buttons?: Json | null
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          buttons?: Json | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          author_email: string
          author_name: string
          blog_id: string | null
          comment_text: string
          created_at: string | null
          id: string
          is_approved: boolean | null
        }
        Insert: {
          author_email: string
          author_name: string
          blog_id?: string | null
          comment_text: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
        }
        Update: {
          author_email?: string
          author_name?: string
          blog_id?: string | null
          comment_text?: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_likes: {
        Row: {
          blog_id: string | null
          created_at: string | null
          id: string
          user_email: string
        }
        Insert: {
          blog_id?: string | null
          created_at?: string | null
          id?: string
          user_email: string
        }
        Update: {
          blog_id?: string | null
          created_at?: string | null
          id?: string
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_likes_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_seo: {
        Row: {
          blog_id: string
          canonical_url: string | null
          created_at: string | null
          id: string
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          robots: string | null
          structured_data: Json | null
          twitter_description: string | null
          twitter_image: string | null
          twitter_title: string | null
          updated_at: string | null
        }
        Insert: {
          blog_id: string
          canonical_url?: string | null
          created_at?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          robots?: string | null
          structured_data?: Json | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string | null
        }
        Update: {
          blog_id?: string
          canonical_url?: string | null
          created_at?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          robots?: string | null
          structured_data?: Json | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_seo_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: true
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      careers: {
        Row: {
          application_deadline: string | null
          benefits: string | null
          created_at: string | null
          department: string | null
          description: string | null
          id: string
          is_active: boolean | null
          job_type: string | null
          location: string | null
          requirements: string | null
          salary_range: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          application_deadline?: string | null
          benefits?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          location?: string | null
          requirements?: string | null
          salary_range?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          application_deadline?: string | null
          benefits?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          location?: string | null
          requirements?: string | null
          salary_range?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      flights_nepal: {
        Row: {
          created_at: string
          description: string | null
          features: Json | null
          hero_image_url: string | null
          id: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      global_seo: {
        Row: {
          apple_touch_icon: string | null
          bing_site_verification: string | null
          default_og_image: string | null
          facebook_pixel_id: string | null
          facebook_url: string | null
          favicon_url: string | null
          google_analytics_id: string | null
          google_site_verification: string | null
          google_tag_manager_id: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          organization_schema: Json | null
          site_name: string | null
          site_tagline: string | null
          twitter_handle: string | null
          updated_at: string | null
          youtube_url: string | null
        }
        Insert: {
          apple_touch_icon?: string | null
          bing_site_verification?: string | null
          default_og_image?: string | null
          facebook_pixel_id?: string | null
          facebook_url?: string | null
          favicon_url?: string | null
          google_analytics_id?: string | null
          google_site_verification?: string | null
          google_tag_manager_id?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          organization_schema?: Json | null
          site_name?: string | null
          site_tagline?: string | null
          twitter_handle?: string | null
          updated_at?: string | null
          youtube_url?: string | null
        }
        Update: {
          apple_touch_icon?: string | null
          bing_site_verification?: string | null
          default_og_image?: string | null
          facebook_pixel_id?: string | null
          facebook_url?: string | null
          favicon_url?: string | null
          google_analytics_id?: string | null
          google_site_verification?: string | null
          google_tag_manager_id?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          organization_schema?: Json | null
          site_name?: string | null
          site_tagline?: string | null
          twitter_handle?: string | null
          updated_at?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      homepage_ads: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          link_url: string | null
          media_type: string
          media_url: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          link_url?: string | null
          media_type?: string
          media_url: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          link_url?: string | null
          media_type?: string
          media_url?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          responded_at: string | null
          status: string | null
          subject: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          responded_at?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          responded_at?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applicant_email: string
          applicant_name: string
          applicant_phone: string | null
          career_id: string | null
          cover_letter: string
          created_at: string | null
          id: string
          position_title: string
          resume_url: string | null
          status: string | null
        }
        Insert: {
          applicant_email: string
          applicant_name: string
          applicant_phone?: string | null
          career_id?: string | null
          cover_letter: string
          created_at?: string | null
          id?: string
          position_title: string
          resume_url?: string | null
          status?: string | null
        }
        Update: {
          applicant_email?: string
          applicant_name?: string
          applicant_phone?: string | null
          career_id?: string | null
          cover_letter?: string
          created_at?: string | null
          id?: string
          position_title?: string
          resume_url?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_career_id_fkey"
            columns: ["career_id"]
            isOneToOne: false
            referencedRelation: "careers"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscriptions: {
        Row: {
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Relationships: []
      }
      page_seo: {
        Row: {
          additional_meta: Json | null
          canonical_url: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_locale: string | null
          og_site_name: string | null
          og_title: string | null
          og_type: string | null
          og_url: string | null
          page_identifier: string
          page_title: string
          robots: string | null
          structured_data: Json | null
          twitter_card: string | null
          twitter_creator: string | null
          twitter_description: string | null
          twitter_image: string | null
          twitter_site: string | null
          twitter_title: string | null
          updated_at: string | null
        }
        Insert: {
          additional_meta?: Json | null
          canonical_url?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_locale?: string | null
          og_site_name?: string | null
          og_title?: string | null
          og_type?: string | null
          og_url?: string | null
          page_identifier: string
          page_title: string
          robots?: string | null
          structured_data?: Json | null
          twitter_card?: string | null
          twitter_creator?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_site?: string | null
          twitter_title?: string | null
          updated_at?: string | null
        }
        Update: {
          additional_meta?: Json | null
          canonical_url?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_locale?: string | null
          og_site_name?: string | null
          og_title?: string | null
          og_type?: string | null
          og_url?: string | null
          page_identifier?: string
          page_title?: string
          robots?: string | null
          structured_data?: Json | null
          twitter_card?: string | null
          twitter_creator?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_site?: string | null
          twitter_title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          is_published: boolean | null
          meta_description: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      prabas_australia: {
        Row: {
          created_at: string
          description: string | null
          hero_image_url: string | null
          id: string
          is_active: boolean
          offers: Json | null
          services: Json | null
          title: string
          updated_at: string
          why_choose_us: Json | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          offers?: Json | null
          services?: Json | null
          title: string
          updated_at?: string
          why_choose_us?: Json | null
        }
        Update: {
          created_at?: string
          description?: string | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          offers?: Json | null
          services?: Json | null
          title?: string
          updated_at?: string
          why_choose_us?: Json | null
        }
        Relationships: []
      }
      prabas_holidays: {
        Row: {
          created_at: string
          description: string | null
          hero_image_url: string | null
          id: string
          is_active: boolean
          services: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          services?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          services?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      prabas_uae: {
        Row: {
          contact_info: Json | null
          created_at: string
          description: string | null
          hero_image_url: string | null
          highlights: Json | null
          id: string
          is_active: boolean
          services: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          contact_info?: Json | null
          created_at?: string
          description?: string | null
          hero_image_url?: string | null
          highlights?: Json | null
          id?: string
          is_active?: boolean
          services?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          contact_info?: Json | null
          created_at?: string
          description?: string | null
          hero_image_url?: string | null
          highlights?: Json | null
          id?: string
          is_active?: boolean
          services?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          features: Json | null
          icon_url: string | null
          id: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          features?: Json | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          features?: Json | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          category: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          category?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          category?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string | null
          display_order: number | null
          email: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          linkedin_url: string | null
          name: string
          phone: string | null
          photo_url: string | null
          position: string
          social_links: Json | null
          twitter_url: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          linkedin_url?: string | null
          name: string
          phone?: string | null
          photo_url?: string | null
          position: string
          social_links?: Json | null
          twitter_url?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          linkedin_url?: string | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          position?: string
          social_links?: Json | null
          twitter_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          client_image_url: string | null
          client_location: string | null
          client_name: string
          created_at: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          rating: number | null
          testimonial_text: string
          trip_type: string | null
          updated_at: string | null
        }
        Insert: {
          client_image_url?: string | null
          client_location?: string | null
          client_name: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          rating?: number | null
          testimonial_text: string
          trip_type?: string | null
          updated_at?: string | null
        }
        Update: {
          client_image_url?: string | null
          client_location?: string | null
          client_name?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          rating?: number | null
          testimonial_text?: string
          trip_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          role: string
          user_id: string
        }
        Insert: {
          role: string
          user_id: string
        }
        Update: {
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_login: {
        Args: { login_email: string; login_password: string }
        Returns: {
          success: boolean
          user_data: Json
        }[]
      }
      admin_login_simple: {
        Args: { login_email: string; login_password: string }
        Returns: {
          success: boolean
          user_data: Json
        }[]
      }
      get_current_user_role: { Args: never; Returns: string }
      hash_password: { Args: { password: string }; Returns: string }
      secure_admin_login: {
        Args: { login_email: string; login_password: string }
        Returns: {
          success: boolean
          user_data: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
